import {
  defineEventHandler,
  readBody,
  getRequestHeader,
  getQuery,
  setResponseStatus,
  H3Event,
} from "h3";

/* ---------------- in-memory TTL cache (external geo lookups) ---------------- */
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

/* ----------------------------- IP utilities -------------------------------- */
function getClientIp(event: H3Event) {
  const q = getQuery(event);
  const devIp = (q.ip as string) || (q.devIp as string) || null; // allow ?ip=1.2.3.4 in dev
  const hdr = (n: string) => (getRequestHeader(event, n) || "").trim();

  const xff = hdr("x-forwarded-for");     // "client, proxy1, proxy2"
  const cf = hdr("cf-connecting-ip");     // Cloudflare
  const real = hdr("x-real-ip");          // nginx/other
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

/* -------------------------- source/medium inference ------------------------- */
function inferSourceMedium(refDomain: string, utmSource: string, utmMedium: string) {
  let source = (utmSource || "").toLowerCase();
  let medium = (utmMedium || "").toLowerCase();

  if (!source) {
    const d = (refDomain || "").toLowerCase();
    if (!d) {
      // direct/no referrer
      source = "";
      medium = medium || "direct";
    } else if (d.includes("google")) {
      source = "google";
      medium = medium || "search";
    } else if (d.includes("facebook")) {
      source = "facebook";
      medium = medium || "social";
    } else if (d.includes("instagram")) {
      source = "instagram";
      medium = medium || "social";
    } else if (d.includes("twitter") || d.includes("x.com") || d === "t.co") {
      source = "twitter";
      medium = medium || "social";
    } else if (d.includes("tiktok")) {
      source = "tiktok";
      medium = medium || "social";
    } else if (d.includes("bing") || d.includes("duckduckgo") || d.includes("yahoo")) {
      source = d.split(".").slice(-2).join(".");
      medium = medium || "search";
    } else {
      // generic referral
      source = d.split(".").slice(-2).join(".");
      medium = medium || "referral";
    }
  }

  return { refSource: source || "unknown", refMedium: medium || "unknown" };
}

/* ---------------------------- category bucketing ---------------------------- */
function inferSourceCategory(refSource: string, refMedium: string, refDomain: string) {
  const s = (refSource || "").toLowerCase();
  const m = (refMedium || "").toLowerCase();
  const d = (refDomain || "").toLowerCase();

  // explicit mediums win
  if (m === "social") return "social";
  if (m === "search") return "search";
  if (m === "referral") return "referral";
  if (m === "direct") return "direct";

  // heuristics by source/domain
  if (/(facebook|instagram|twitter|t\.co|x\.com|tiktok|snap|linkedin)/.test(s + " " + d)) {
    return "social";
  }
  if (/(google|bing|duckduckgo|yahoo)/.test(s + " " + d)) {
    return "search";
  }
  if (!d && !s) return "direct";
  return "referral";
}

/* --------------------------------- handler --------------------------------- */
export default defineEventHandler(async (event) => {
  try {
    /* 1) input */
    const body = (await readBody(event)) as {
      bandId?: number | string;
      path?: string;
      title?: string;
      url?: string; // full landing URL (window.location.href)
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

    /* URL helpers */
    const safeURL = (u?: string) => {
      try {
        return u ? new URL(u) : null;
      } catch {
        return null;
      }
    };
    const qParams = (u?: string) => {
      const out: Record<string, string> = {};
      const url = safeURL(u);
      if (!url) return out;
      url.searchParams.forEach((v, k) => (out[k] = v));
      return out;
    };

    /* landing & referrer */
    const pageUrl = body.url || "";
    const pageU = safeURL(pageUrl);
    const landingPath = pageU?.pathname || "";
    const landingQuery = pageU?.search || "";

    const refererHeader = getRequestHeader(event, "referer") || "";
    const refU = safeURL(refererHeader);
    const refDomain = refU?.hostname?.toLowerCase?.() || "";

    /* UTM/CLIDs — parse BEFORE inference */
    const qp = qParams(pageUrl);
    const utmSource   = qp.utm_source || "";
    const utmMedium   = qp.utm_medium || "";
    const utmCampaign = qp.utm_campaign || "";
    const utmTerm     = qp.utm_term || "";
    const utmContent  = qp.utm_content || "";
    const gclid       = qp.gclid || "";
    const fbclid      = qp.fbclid || "";
    const ttclid      = qp.ttclid || "";
    const twclid      = qp.twclid || "";

    /* infer refSource/refMedium, then broad sourceCategory */
    const { refSource, refMedium } = inferSourceMedium(refDomain, utmSource, utmMedium);
    const sourceCategory = inferSourceCategory(refSource, refMedium, refDomain);

    /* 2) dev overrides for local testing */
    const q = getQuery(event);
    let city = (q.city as string) || null;
    let region = (q.region as string) || null;
    let country = (q.country as string) || null;
    let lat: number | null = q.lat ? Number(q.lat) : null;
    let lon: number | null = q.lon ? Number(q.lon) : null;

    let geoSource: "override" | "cloudflare" | "geoip" | "external" | "none" = "none";
    if (city || region || country || lat || lon) {
      geoSource = "override";
    }

    /* 3) Cloudflare headers */
    if (geoSource === "none") {
      const cfCity    = getRequestHeader(event, "cf-ipcity")     || getRequestHeader(event, "CF-IPCity");
      const cfCountry = getRequestHeader(event, "cf-ipcountry")  || getRequestHeader(event, "CF-IPCountry");
      const cfRegion  = getRequestHeader(event, "cf-region")     || getRequestHeader(event, "CF-Region");
      const cfLat     = getRequestHeader(event, "cf-iplatitude") || getRequestHeader(event, "CF-IPLatitude");
      const cfLon     = getRequestHeader(event, "cf-iplongitude")|| getRequestHeader(event, "CF-IPLongitude");

      if (cfCity || cfCountry || cfRegion || cfLat || cfLon) {
        city    = (cfCity    || city    || null) as any;
        region  = (cfRegion  || region  || null) as any;
        country = (cfCountry || country || null) as any;
        lat = lat ?? (cfLat ? Number(cfLat) : null);
        lon = lon ?? (cfLon ? Number(cfLon) : null);
        geoSource = "cloudflare";
      }
    }

    /* 4) geoip-lite */
    if (geoSource === "none" && !isPrivateIp(ip)) {
      try {
        const { createRequire } = await import("module");
        const require = createRequire(import.meta.url);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const geoip = require("geoip-lite");
        const loc = geoip.lookup(ip);
        if (loc) {
          city    = city    || loc.city   || null;
          region  = region  || loc.region || null;
          country = country || loc.country|| null;
          if (Array.isArray(loc.ll) && loc.ll.length === 2) {
            lat = lat ?? Number(loc.ll[0]);
            lon = lon ?? Number(loc.ll[1]);
          }
          if (city || region || country) geoSource = "geoip";
        }
      } catch {
        // ignore — fall through to external
      }
    }

    /* 5) External IP API fallback */
    if (geoSource === "none" && !isPrivateIp(ip)) {
      const cacheKey = `ipapi:${ip}`;
      let data = cacheGet(cacheKey);
      if (!data) {
        const url = `https://ipapi.co/${encodeURIComponent(ip)}/json/`;
        try {
          data = await $fetch(url, { timeout: 3000 });
          cacheSet(cacheKey, data);
        } catch {
          data = null;
        }
      }
      if (data) {
        city    = city    || data.city || null;
        region  = region  || data.region || data.region_code || null;
        country = country || data.country || data.country_name || null;
        lat = lat ?? (typeof data.latitude  === "number" ? data.latitude  : null);
        lon = lon ?? (typeof data.longitude === "number" ? data.longitude : null);
        if (city || region || country) geoSource = "external";
      }
    }

    /* 6) send to Strapi */
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
        lat,
        lon,
        timestamp: nowIso,

        // landing / referrer
        pageUrl,
        landingPath,
        landingQuery,
        referrer: refererHeader,
        refDomain,

        // normalized marketing fields
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        gclid,
        fbclid,
        ttclid,
        twclid,

        // inferred fields
        refSource,
        refMedium,
        sourceCategory,
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
