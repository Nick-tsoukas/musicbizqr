/**
 * Share Kit composable - shared utilities for band and moment sharing
 * Provides helpers for Web Share API, clipboard, downloads, and social sharing
 */

export function useShareKit() {
  /**
   * Build the share URL for a band
   */
  function buildShareUrl({ bandSlug }) {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}/${bandSlug}`
  }

  /**
   * Build caption text (without URL) - for Instagram/social copy
   */
  function buildCaption({ bandName, momentType = null, momentTitle = null }) {
    if (momentType) {
      switch (momentType) {
        case 'I_WAS_THERE':
          return `I was there. ${bandName} was a vibe 🔥`
        case 'FUELED_MOMENTUM':
          return `I just supported ${bandName}. Help them keep it moving 💜`
        case 'PULSE_SURGE':
          return `${bandName} is heating up right now 🔥`
        case 'AFTER_SHOW_RECAP':
          return `Last night was wild — ${bandName} brought the heat.`
        default:
          return `Put someone on: ${bandName} 🎧`
      }
    }
    // Default band share caption
    return `Been listening to ${bandName}. Put someone on 🎧`
  }

  /**
   * Build share text (with URL) - for SMS/email/Web Share
   */
  function buildShareText({ bandName, shareUrl, momentType = null, momentTitle = null }) {
    if (momentType) {
      const caption = buildCaption({ bandName, momentType, momentTitle })
      return `${caption} ${shareUrl}`
    }
    return `Check out ${bandName} on MusicBizQR: ${shareUrl}`
  }

  /**
   * Generate share image using canvas
   * @param {Object} options
   * @param {HTMLCanvasElement} options.canvasEl - Canvas element to draw on
   * @param {string} options.bandName - Band name
   * @param {string|null} options.bandImageUrl - Optional band image URL
   * @param {string|null} options.momentTitle - Optional moment title (e.g., "You were part of this moment")
   * @param {string|null} options.subtitle - Optional subtitle (e.g., location)
   * @returns {Promise<Blob|null>}
   */
  async function generateShareImage({ canvasEl, bandName, bandImageUrl = null, momentTitle = null, subtitle = null }) {
    if (!canvasEl) return null

    try {
      const ctx = canvasEl.getContext('2d')
      const width = 1080
      const height = 1080

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#1a0a2e')
      gradient.addColorStop(0.5, '#0f0f0f')
      gradient.addColorStop(1, '#0a1a1a')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Decorative circles
      ctx.beginPath()
      ctx.arc(width * 0.85, height * 0.15, 180, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(139, 92, 246, 0.2)'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(width * 0.15, height * 0.85, 140, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)'
      ctx.fill()

      ctx.textAlign = 'center'

      // If moment title exists, draw it above band name
      if (momentTitle) {
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 56px system-ui, -apple-system, sans-serif'
        ctx.fillText(momentTitle, width / 2, height * 0.32)
      }

      // Band name - large and centered
      ctx.fillStyle = momentTitle ? '#c4b5fd' : '#ffffff'
      ctx.font = `bold ${momentTitle ? 64 : 80}px system-ui, -apple-system, sans-serif`

      // Word wrap band name if too long
      const maxWidth = width - 120
      const words = bandName.split(' ')
      let lines = []
      let currentLine = ''

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      if (currentLine) lines.push(currentLine)

      // Draw band name lines
      const lineHeight = momentTitle ? 75 : 95
      const startY = momentTitle ? height * 0.48 : height * 0.42
      const adjustedStartY = startY - ((lines.length - 1) * lineHeight) / 2
      lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, adjustedStartY + i * lineHeight)
      })

      // Subtitle (location) if provided
      if (subtitle) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.font = '32px system-ui, -apple-system, sans-serif'
        ctx.fillText(subtitle, width / 2, adjustedStartY + lines.length * lineHeight + 20)
      }

      // Tagline
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.font = '36px system-ui, -apple-system, sans-serif'
      ctx.fillText('Scan • Listen • Follow', width / 2, height * 0.72)

      // MusicBizQR branding
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.font = '28px system-ui, -apple-system, sans-serif'
      ctx.fillText('via MusicBizQR', width / 2, height * 0.92)

      // Convert to blob
      return new Promise((resolve) => {
        canvasEl.toBlob((blob) => {
          resolve(blob)
        }, 'image/png')
      })
    } catch (err) {
      console.error('[useShareKit] Failed to generate image:', err)
      return null
    }
  }

  /**
   * Attempt Web Share API
   * @returns {{ ok: boolean, usedFile: boolean }}
   */
  async function webShare({ title, text, url, imageBlob = null, filename = 'share.png' }) {
    if (!navigator.share) {
      return { ok: false, usedFile: false }
    }

    try {
      const shareData = { title, text, url }

      // Try with file if available
      if (imageBlob && navigator.canShare) {
        const file = new File([imageBlob], filename, { type: 'image/png' })
        const dataWithFile = { ...shareData, files: [file] }

        if (navigator.canShare(dataWithFile)) {
          await navigator.share(dataWithFile)
          return { ok: true, usedFile: true }
        }
      }

      // Fallback: share without file
      await navigator.share(shareData)
      return { ok: true, usedFile: false }
    } catch (err) {
      if (err.name === 'AbortError') {
        // User cancelled - not an error
        return { ok: false, usedFile: false }
      }
      console.error('[useShareKit] Web Share failed:', err)
      return { ok: false, usedFile: false }
    }
  }

  /**
   * Copy text to clipboard
   */
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        return true
      }
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch (err) {
      console.error('[useShareKit] Copy failed:', err)
      return false
    }
  }

  /**
   * Download blob as file
   */
  function downloadBlob(blob, filename) {
    try {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      return true
    } catch (err) {
      console.error('[useShareKit] Download failed:', err)
      return false
    }
  }

  /**
   * Open Facebook sharer in new tab
   */
  function openFacebookSharer(shareUrl) {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(fbUrl, '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  /**
   * Generate filename for share image
   */
  function getShareFilename(bandSlug, type = 'share') {
    return `${bandSlug}-${type}.png`
  }

  return {
    buildShareUrl,
    buildCaption,
    buildShareText,
    generateShareImage,
    webShare,
    copyToClipboard,
    downloadBlob,
    openFacebookSharer,
    getShareFilename,
  }
}
