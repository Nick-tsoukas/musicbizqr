/**
 * Share Kit composable - shared utilities for band and moment sharing
 * Provides helpers for Web Share API, clipboard, downloads, and social sharing
 */

import { useRuntimeConfig } from '#imports'

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
   * @param {boolean} options.isBandNameInLogo - If true, hide band name text (it's in the logo)
   * @returns {Promise<Blob|null>}
   */
  async function generateShareImage({ canvasEl, bandName, bandImageUrl = null, momentTitle = null, subtitle = null, isBandNameInLogo = false }) {
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

      // Calculate layout based on whether we have an image
      const hasImage = !!bandImageUrl
      const showBandNameText = !isBandNameInLogo
      
      // Image dimensions and position
      const imageSize = 320
      const imageY = hasImage ? (momentTitle ? height * 0.22 : height * 0.18) : 0

      // Load and draw band image if available
      if (bandImageUrl) {
        try {
          const img = await loadImage(bandImageUrl)
          
          // Draw circular clipped image
          ctx.save()
          ctx.beginPath()
          ctx.arc(width / 2, imageY + imageSize / 2, imageSize / 2, 0, Math.PI * 2)
          ctx.closePath()
          ctx.clip()
          
          // Draw image centered and cover the circle
          const imgAspect = img.width / img.height
          let drawWidth, drawHeight, drawX, drawY
          
          if (imgAspect > 1) {
            drawHeight = imageSize
            drawWidth = imageSize * imgAspect
            drawX = width / 2 - drawWidth / 2
            drawY = imageY
          } else {
            drawWidth = imageSize
            drawHeight = imageSize / imgAspect
            drawX = width / 2 - imageSize / 2
            drawY = imageY - (drawHeight - imageSize) / 2
          }
          
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
          ctx.restore()
          
          // Add subtle border around image
          ctx.beginPath()
          ctx.arc(width / 2, imageY + imageSize / 2, imageSize / 2, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
          ctx.lineWidth = 3
          ctx.stroke()
        } catch (imgErr) {
          console.warn('[useShareKit] Failed to load band image:', imgErr)
        }
      }

      // Calculate text positions based on image presence
      const textStartY = hasImage ? imageY + imageSize + 50 : (momentTitle ? height * 0.32 : height * 0.35)

      // If moment title exists, draw it
      if (momentTitle) {
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 48px system-ui, -apple-system, sans-serif'
        ctx.fillText(momentTitle, width / 2, hasImage ? textStartY : height * 0.32)
      }

      // Band name - only if not in logo
      if (showBandNameText) {
        const bandNameY = momentTitle 
          ? (hasImage ? textStartY + 70 : height * 0.48)
          : (hasImage ? textStartY + 20 : height * 0.42)
        
        ctx.fillStyle = momentTitle ? '#c4b5fd' : '#ffffff'
        ctx.font = `bold ${hasImage ? 56 : (momentTitle ? 64 : 80)}px system-ui, -apple-system, sans-serif`

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
        const lineHeight = hasImage ? 65 : (momentTitle ? 75 : 95)
        const adjustedStartY = bandNameY - ((lines.length - 1) * lineHeight) / 2
        lines.forEach((line, i) => {
          ctx.fillText(line, width / 2, adjustedStartY + i * lineHeight)
        })

        // Subtitle (location) if provided
        if (subtitle) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
          ctx.font = '32px system-ui, -apple-system, sans-serif'
          ctx.fillText(subtitle, width / 2, adjustedStartY + lines.length * lineHeight + 25)
        }
      } else if (subtitle) {
        // If no band name text but we have subtitle, show it below image/moment title
        const subtitleY = momentTitle 
          ? (hasImage ? textStartY + 70 : height * 0.48)
          : (hasImage ? textStartY + 20 : height * 0.50)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.font = '32px system-ui, -apple-system, sans-serif'
        ctx.fillText(subtitle, width / 2, subtitleY)
      }

      // Tagline
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.font = '36px system-ui, -apple-system, sans-serif'
      ctx.fillText('Scan • Listen • Follow', width / 2, height * 0.82)

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

  // Get runtime config for proxy URL
  const runtimeConfig = useRuntimeConfig()

  /**
   * Load an image from URL (handles CORS via backend proxy)
   * @param {string} url
   * @returns {Promise<HTMLImageElement>}
   */
  async function loadImage(url) {
    
    // Strategy 1: Try direct load with crossOrigin first (fastest if CORS headers exist)
    try {
      const img = await loadImageDirect(url)
      return img
    } catch (e) {
      console.warn('[useShareKit] Direct image load failed, trying proxy...', e)
    }

    // Strategy 2: Use backend proxy for CORS-blocked images
    if (url.includes('cloudinary.com') || url.includes('res.cloudinary')) {
      try {
        const proxyUrl = `${runtimeConfig.public.strapiUrl}/api/image-proxy?url=${encodeURIComponent(url)}`
        const img = await loadImageDirect(proxyUrl)
        return img
      } catch (e) {
        console.warn('[useShareKit] Proxy load failed:', e)
      }
    }

    // Strategy 3: Try fetching as blob directly
    try {
      const response = await fetch(url, { mode: 'cors' })
      if (response.ok) {
        const blob = await response.blob()
        const objectUrl = URL.createObjectURL(blob)
        
        const img = await new Promise((resolve, reject) => {
          const image = new Image()
          image.onload = () => {
            URL.revokeObjectURL(objectUrl)
            resolve(image)
          }
          image.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            reject(new Error('Blob image load failed'))
          }
          image.src = objectUrl
        })
        return img
      }
    } catch (fetchErr) {
      console.warn('[useShareKit] Fetch blob failed:', fetchErr)
    }

    // Strategy 4: Load without crossOrigin (canvas will be tainted but image shows)
    console.warn('[useShareKit] All CORS strategies failed, loading without crossOrigin')
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
  }

  /**
   * Direct image load with crossOrigin
   */
  function loadImageDirect(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
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
