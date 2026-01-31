# MusicBizQR PWA Documentation

## Overview

MusicBizQR is configured as a Progressive Web App (PWA) with:
- Installable app experience
- Offline support for public pages
- Background updates with user-friendly prompts
- Network status indicators

## Architecture

### Files Created

```
qr/
├── public/
│   ├── manifest.webmanifest     # PWA manifest
│   └── icons/
│       ├── icon-192.png         # Standard icon
│       ├── icon-512.png         # Large icon
│       ├── icon-512-maskable.png # Maskable icon for Android
│       └── apple-touch-icon.png  # iOS icon
├── pages/
│   ├── install.vue              # Premium install page
│   └── offline.vue              # Branded offline page
├── components/
│   ├── PwaUpdateToast.vue       # Update notification
│   └── NetworkStatus.vue        # Online/offline indicator
├── composables/
│   └── usePwa.js                # PWA state management
└── plugins/
    └── pwa.client.js            # PWA initialization
```

### Configuration (nuxt.config.ts)

The PWA is configured with:
- `registerType: 'prompt'` - User must approve updates
- Custom manifest at `/manifest.webmanifest`
- Service worker with runtime caching

## Caching Strategy

### Excluded from Cache (Never cached)
- `/api/*` - API routes
- `/account/*` - User account pages
- `/dashboard/*` - Dashboard
- `/agency/*` - Agency pages
- `/internal/*` - Internal pages
- `/checkout/*` - Checkout flow
- Any request with Authorization header

### Caching Rules

| Content Type | Strategy | TTL | Notes |
|-------------|----------|-----|-------|
| Page routes | NetworkFirst | 24h | 3s timeout, falls back to cache |
| Images | CacheFirst | 30 days | Up to 100 entries |
| Fonts | CacheFirst | 1 year | Up to 20 entries |
| Google Fonts | CacheFirst | 1 year | External fonts |

## Testing

### Lighthouse PWA Audit

1. Open Chrome DevTools (F12)
2. Go to **Lighthouse** tab
3. Check **Progressive Web App**
4. Click **Analyze page load**
5. Review PWA score and recommendations

### Test Offline Mode

1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Check **Offline** checkbox
4. Navigate to a public page
5. Should see cached content or `/offline` page

### Test Update Flow

1. Deploy a new version
2. Visit the site
3. Wait for service worker to detect update
4. Update toast should appear (bottom-right on desktop, bottom-center on mobile)
5. Click "Update now" - page should refresh with new version

### Test Install on iOS

1. Open https://musicbizqr.com/install in Safari
2. Follow the on-screen instructions:
   - Tap Share button
   - Tap "Add to Home Screen"
   - Tap "Add"
3. Open from home screen - should launch in standalone mode

### Test Install on Android

1. Open https://musicbizqr.com/install in Chrome
2. Click "Install MBQ" button
3. Confirm installation
4. App icon should appear on home screen

## Unregister Service Worker

If you need to reset the PWA:

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** in sidebar
4. Click **Unregister** next to the service worker
5. Clear site data: **Application** → **Storage** → **Clear site data**

Or via console:
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister())
})
```

## Verify Installation

### Check if Running as PWA
```javascript
// In browser console
window.matchMedia('(display-mode: standalone)').matches
// Returns true if installed PWA
```

### Check Service Worker Status
```javascript
navigator.serviceWorker.controller
// Returns ServiceWorker object if active
```

## Troubleshooting

### Update Toast Not Appearing
- Check browser console for SW errors
- Verify not on excluded route (`/account`, `/dashboard`, etc.)
- Check if `updateDismissed` is true in session

### Install Button Not Appearing
- Must be served over HTTPS
- Must have valid manifest
- Must meet PWA installability criteria
- Check `beforeinstallprompt` event in console

### Offline Page Not Loading
- Verify `/offline` route exists
- Check `navigateFallback` in PWA config
- Verify SW is registered and active

### Cache Not Updating
- SW updates happen in background
- Close all tabs and reopen
- Or use DevTools → Application → Service Workers → Update
