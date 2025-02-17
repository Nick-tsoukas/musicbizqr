// composables/useBeacon.js
import { useRuntimeConfig } from '#imports';

export function useBeacon() {
  const config = useRuntimeConfig();

  const trackClick = (bandId, platform, destinationUrl) => {
    const apiUrl = `${config.public.strapiUrl}/api/link-clicks/track`;
    const payload = { bandId, platform };
    const data = JSON.stringify(payload);

    console.log("Tracking click:", payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([data], { type: "application/json" });
      const result = navigator.sendBeacon(apiUrl, blob);
      console.log("Beacon result:", result);
    } else {
      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
        keepalive: true,
      })
        .then((res) => console.log("Fetch tracking success", res))
        .catch((err) => console.error("Error tracking click:", err));
    }
    setTimeout(() => {
      window.location.href = destinationUrl;
    }, 300);
  };

  return { trackClick };
}
