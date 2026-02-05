// server/middleware/qr-gateway.ts
// Redirects all non-directqr routes from qr.musicbizqr.com to main domain
import { defineEventHandler, sendRedirect } from 'h3'

export default defineEventHandler((event) => {
  const host = event.node.req.headers.host || ''
  const url = event.node.req.url || '/'

  // Only activate for qr.musicbizqr.com subdomain
  if (host.startsWith('qr.musicbizqr.com')) {
    // Allow /directqr requests to pass through
    if (url.startsWith('/directqr')) {
      return
    }

    // Redirect all other routes to main domain
    return sendRedirect(
      event,
      `https://musicbizqr.com${url}`,
      302
    )
  }
})
