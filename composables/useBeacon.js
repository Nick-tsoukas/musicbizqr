// composables/useBeacon.js
import { useRuntimeConfig } from '#imports';

export function useBeacon() {
  const config = useRuntimeConfig();
  console.log('→ sending media-play to', config.public.strapiUrl);

  /**
   * Tracks a media play (song or video) by POSTing to Strapi.
   * @param {number} bandId
   * @param {'song'|'video'} mediaType
   * @param {string} title
   */
  async function trackMediaPlay(bandId, mediaType, title) {
    const res = await fetch(
      `${config.public.strapiUrl}/api/media-plays/track`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bandId, mediaType, title }),
      }
    );
    console.log('← media-play response', res.status);
    return res;
  }

  /**
   * Tracks an outbound link click using Beacon API (or fetch fallback),
   * then navigates to the destination URL after a short delay.
   * @param {number} bandId
   * @param {string} platform
   * @param {string} destinationUrl
   */
  const trackClick = (bandId, platform, destinationUrl) => {
    const apiUrl = `${config.public.strapiUrl}/api/link-clicks/track`;
    const payload = { bandId, platform };
    const data = JSON.stringify(payload);

    console.log('Tracking click:', payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([data], { type: 'application/json' });
      const result = navigator.sendBeacon(apiUrl, blob);
      console.log('Beacon result:', result);
    } else {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true,
      })
        .then((res) => console.log('Fetch tracking success', res))
        .catch((err) => console.error('Error tracking click:', err));
    }

    setTimeout(() => {
      window.location.href = destinationUrl;
    }, 300);
  };

  return { trackClick, trackMediaPlay };
}
