import {
  defineEventHandler,
  readBody,
  getRequestHeader,
  getQuery,
  setResponseStatus,
  H3Event,
} from "h3";

// --- tiny in-memory TTL cache for external lookups ---
const geoCache = new Map<string, { v: any; exp: number }>();
const GEO_TTL_MS = 60_000 * 30; // 30 minutes

function cacheGet(key: string) {
  const hit = geoCache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.exp) {
    geoCache.delete(key);
    return null;
  }
  return hit.v;
}
function cacheSet(key: string, v: any) {
  geoCache.set(key, { v, exp: Date.now() + GEO_TTL_MS });
}

// Normalize client IP (strip IPv6 mapped prefix, handle comma chains)
function getClientIp(event: H3Event) {
  const q = getQuery(event);
  const devIp = (q.ip as string) || (q.devIp as string) || null; // allow ?ip=1.2.3.4 in dev

  const hdr = (n: string) => (getRequestHeader(event, n) || "").trim();
  const xff = hdr("x-forwarded-for"); // "client, proxy1, proxy2"
  const cf = hdr("cf-connecting-ip"); // Cloudflare
  const real = hdr("x-real-ip"); // nginx/other
  const sock = (event.node.req.socket as any)?.remoteAddress || "";

  let ip =
    devIp ||
    cf ||
    "" ||
    real ||
    "" ||
    (xff || "").split(",")[0]?.trim() ||
    "" ||
    sock ||
    "";

  ip = ip.replace(/^::ffff:/i, "");
  if (ip === "::1") ip = "127.0.0.1";
  return ip || "127.0.0.1";
}

function isPrivateIp(ip: string) {
  return /^(::1|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(ip);
}

export default defineEventHandler(async (event) => {
  try {
    // 1) input
    const body = (await readBody(event)) as {
      bandId?: number | string;
      path?: string;
      title?: string;
    };
    if (!body?.bandId) {
      setResponseStatus(event, 400);
      return { ok: false, error: "Missing bandId" };
    }
    const bandId = Number(body.bandId);
    const path = body.path || "";
    const title = body.title || "";
    const ua = getRequestHeader(event, "user-agent") || "";
    const ip = getClientIp(event);

    // 2) dev overrides for local testing
    const q = getQuery(event);
    let city = (q.city as string) || null;
    let region = (q.region as string) || null;
    let country = (q.country as string) || null;
    let lat: number | null = q.lat ? Number(q.lat) : null;
    let lon: number | null = q.lon ? Number(q.lon) : null;

    let geoSource: "override" | "cloudflare" | "geoip" | "external" | "none" =
      "none";
    if (city || region || country || lat || lon) {
      geoSource = "override";
    }

    // 3) Cloudflare headers (best if you’re behind CF)
    if (geoSource === "none") {
      const cfCity =
        getRequestHeader(event, "cf-ipcity") ||
        getRequestHeader(event, "CF-IPCity");
      const cfCountry =
        getRequestHeader(event, "cf-ipcountry") ||
        getRequestHeader(event, "CF-IPCountry");
      const cfRegion =
        getRequestHeader(event, "cf-region") ||
        getRequestHeader(event, "CF-Region");
      const cfLat =
        getRequestHeader(event, "cf-iplatitude") ||
        getRequestHeader(event, "CF-IPLatitude");
      const cfLon =
        getRequestHeader(event, "cf-iplongitude") ||
        getRequestHeader(event, "CF-IPLongitude");

      if (cfCity || cfCountry || cfRegion || cfLat || cfLon) {
        city = (cfCity || city || null) as any;
        region = (cfRegion || region || null) as any;
        country = (cfCountry || country || null) as any;
        lat = lat ?? (cfLat ? Number(cfLat) : null);
        lon = lon ?? (cfLon ? Number(cfLon) : null);
        geoSource = "cloudflare";
      }
    }

    // 4) geoip-lite (what you already use)
    if (geoSource === "none" && !isPrivateIp(ip)) {
      try {
        const { createRequire } = await import("module");
        const require = createRequire(import.meta.url);
        const geoip = require("geoip-lite");
        const loc = geoip.lookup(ip);
        if (loc) {
          city = city || loc.city || null;
          region = region || loc.region || null;
          country = country || loc.country || null;
          if (Array.isArray(loc.ll) && loc.ll.length === 2) {
            lat = lat ?? Number(loc.ll[0]);
            lon = lon ?? Number(loc.ll[1]);
          }
          if (city || region || country) geoSource = "geoip";
        }
      } catch (e) {
        // ignore — fall through to external
      }
    }

    // 5) External IP API fallback (ipapi.co here; swap as you prefer)
    if (geoSource === "none" && !isPrivateIp(ip)) {
      const cacheKey = `ipapi:${ip}`;
      let data = cacheGet(cacheKey);
      if (!data) {
        // You can switch to ipinfo/ipdata and use a token via runtime config
        const url = `https://ipapi.co/${encodeURIComponent(ip)}/json/`;
        try {
          data = await $fetch(url, { timeout: 3000 });
          cacheSet(cacheKey, data);
        } catch {
          data = null;
        }
      }
      if (data) {
        city = city || data.city || null;
        region = region || data.region || data.region_code || null;
        country = country || data.country || data.country_name || null;
        lat = lat ?? (typeof data.latitude === "number" ? data.latitude : null);
        lon =
          lon ?? (typeof data.longitude === "number" ? data.longitude : null);
        if (city || region || country) geoSource = "external";
      }
    }

    // 6) send to Strapi
    const config = useRuntimeConfig();
    const STRAPI_URL =
      (config?.public as any)?.strapiUrl ||
      process.env.NUXT_PUBLIC_STRAPI_URL ||
      "http://localhost:1337";
    const nowIso = new Date().toISOString();
    const payload = {
      data: {
        band: bandId,
        path,
        title,
        ipAddress: ip || "",
        userAgent: ua,
        city,
        region,
        country,
        referrer: getRequestHeader(event, "referer") || "",
        lat,
        lon,
        timestamp: nowIso,
      },
    };

    const saved = await $fetch(`${STRAPI_URL}/api/band-page-views`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });

    return {
      ok: true,
      ip,
      geoSource,
      geo: { city, region, country, lat, lon },
      saved,
    };
  } catch (err: any) {
    console.error("[track/band-view] ERROR:", err);
    setResponseStatus(event, 500);
    return { ok: false, error: err?.message || String(err) };
  }
});
