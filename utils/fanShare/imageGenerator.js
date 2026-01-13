/**
 * MBQ Fan Share Image Generator
 * 
 * Generates "poster energy" images for fan shares.
 * These are emotion-driven, not data-driven.
 * 
 * Visual rules:
 * - Band image centered and prominent
 * - Bold emotional headline
 * - NO stats or data
 * - Poster vibe, not report card
 */

// ============================================================
// ACCENT COLORS (shared with band shareables)
// ============================================================

const ACCENT_COLORS = {
  violet: { primary: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.3)' },
  blue: { primary: '#3B82F6', glow: 'rgba(59, 130, 246, 0.3)' },
  emerald: { primary: '#10B981', glow: 'rgba(16, 185, 129, 0.3)' },
  amber: { primary: '#F59E0B', glow: 'rgba(245, 158, 11, 0.3)' },
  rose: { primary: '#F43F5E', glow: 'rgba(244, 63, 94, 0.3)' },
}

// ============================================================
// MOMENT TYPE TO ACCENT MAPPING
// ============================================================

const MOMENT_ACCENTS = {
  FIRST_DISCOVERY: 'violet',
  AFTER_SHOW_FAN: 'rose',
  CITY_SUPPORT: 'blue',
  RETURNING_FAN: 'emerald',
  SUPER_FAN_ACTION: 'amber',
  DEFAULT: 'violet',
}

/**
 * Get accent color for a moment type
 * @param {string} momentType 
 * @returns {{ primary: string, glow: string }}
 */
export function getAccentForMoment(momentType) {
  const accentKey = MOMENT_ACCENTS[momentType] || 'violet'
  return ACCENT_COLORS[accentKey]
}

// ============================================================
// TEXT HELPERS
// ============================================================

/**
 * Wrap text to fit within maxWidth
 * @param {CanvasRenderingContext2D} ctx 
 * @param {string} text 
 * @param {number} maxWidth 
 * @param {number} maxLines 
 * @returns {string[]}
 */
function wrapText(ctx, text, maxWidth, maxLines = 2) {
  const words = text.split(' ')
  const lines = []
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

  // Truncate if too many lines
  if (lines.length > maxLines) {
    const truncated = lines.slice(0, maxLines)
    truncated[maxLines - 1] = truncated[maxLines - 1].slice(0, -3) + '...'
    return truncated
  }

  return lines
}

/**
 * Auto-fit text to width by reducing font size
 * @param {CanvasRenderingContext2D} ctx 
 * @param {string} text 
 * @param {number} maxWidth 
 * @param {number} baseFontSize 
 * @param {number} minFontSize 
 * @returns {{ fontSize: number, fits: boolean }}
 */
function fitTextToWidth(ctx, text, maxWidth, baseFontSize, minFontSize) {
  let fontSize = baseFontSize
  
  while (fontSize >= minFontSize) {
    ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`
    const metrics = ctx.measureText(text)
    
    if (metrics.width <= maxWidth) {
      return { fontSize, fits: true }
    }
    fontSize -= 2
  }
  
  return { fontSize: minFontSize, fits: false }
}

// ============================================================
// IMAGE GENERATOR
// ============================================================

/**
 * Generate fan share image (poster style)
 * @param {Object} options
 * @param {HTMLCanvasElement} options.canvasEl - Canvas element (1080x1080)
 * @param {string} options.headline - Emotional headline (e.g., "JUST FOUND SOMETHING SPECIAL")
 * @param {string} options.bandName - Band name
 * @param {string|null} options.bandImageUrl - Optional band image URL
 * @param {boolean} options.isBandNameInLogo - Skip band name if true
 * @param {string} options.momentType - Fan moment type for accent color
 * @param {Function} options.loadImage - Image loader function
 * @returns {Promise<Blob|null>}
 */
export async function generateFanShareImage({
  canvasEl,
  headline,
  bandName,
  bandImageUrl = null,
  isBandNameInLogo = false,
  momentType = 'DEFAULT',
  loadImage,
}) {
  if (!canvasEl) return null

  try {
    const ctx = canvasEl.getContext('2d')
    const width = 1080
    const height = 1080

    // Get accent colors
    const accent = getAccentForMoment(momentType)

    // === BACKGROUND ===
    // Clean cinematic gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height)
    bgGradient.addColorStop(0, '#1a0a2e')      // Deep purple-black
    bgGradient.addColorStop(0.5, '#0f0f0f')    // Near black
    bgGradient.addColorStop(1, '#0a1a1a')      // Dark teal hint
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, width, height)

    // === SUBTLE VIGNETTE ===
    const vignetteGradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, width * 0.7
    )
    vignetteGradient.addColorStop(0, 'transparent')
    vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)')
    ctx.fillStyle = vignetteGradient
    ctx.fillRect(0, 0, width, height)

    // === ACCENT GLOW (top) ===
    ctx.beginPath()
    ctx.arc(width / 2, 0, 400, 0, Math.PI * 2)
    const topGlow = ctx.createRadialGradient(
      width / 2, 0, 0,
      width / 2, 0, 400
    )
    topGlow.addColorStop(0, accent.glow)
    topGlow.addColorStop(1, 'transparent')
    ctx.fillStyle = topGlow
    ctx.fill()

    ctx.textAlign = 'center'

    // === BAND IMAGE ===
    const imageSize = 340
    const imageY = 200

    // Helper to draw placeholder with initials
    function drawPlaceholder() {
      console.log('[fanShareImage] Drawing placeholder, bandName:', bandName)
      
      // Draw circle background
      ctx.beginPath()
      ctx.arc(width / 2, imageY + imageSize / 2, imageSize / 2, 0, Math.PI * 2)
      ctx.closePath()
      const placeholderGradient = ctx.createLinearGradient(
        width / 2 - imageSize / 2, imageY,
        width / 2 + imageSize / 2, imageY + imageSize
      )
      placeholderGradient.addColorStop(0, accent.primary + '60')
      placeholderGradient.addColorStop(1, accent.primary + '30')
      ctx.fillStyle = placeholderGradient
      ctx.fill()
      
      // Draw border
      ctx.beginPath()
      ctx.arc(width / 2, imageY + imageSize / 2, imageSize / 2, 0, Math.PI * 2)
      ctx.strokeStyle = accent.primary + '50'
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw initials
      if (bandName && bandName.trim()) {
        const initials = bandName
          .trim()
          .split(' ')
          .filter(w => w.length > 0)
          .map(w => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
        
        if (initials) {
          ctx.font = 'bold 100px system-ui, -apple-system, sans-serif'
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
          ctx.fillText(initials, width / 2, imageY + imageSize / 2 + 35)
        }
      }
    }

    let imageDrawn = false

    if (bandImageUrl && loadImage) {
      try {
        const img = await loadImage(bandImageUrl)
        
        if (img && img.width > 0 && img.height > 0) {
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
          
          // Subtle glow around image
          ctx.beginPath()
          ctx.arc(width / 2, imageY + imageSize / 2, imageSize / 2 + 4, 0, Math.PI * 2)
          ctx.strokeStyle = accent.primary + '40'
          ctx.lineWidth = 3
          ctx.stroke()
          
          imageDrawn = true
        }
      } catch (imgErr) {
        console.warn('[fanShareImage] Failed to load band image:', imgErr)
      }
    }
    
    // Always draw placeholder if image wasn't drawn
    if (!imageDrawn) {
      drawPlaceholder()
    }

    // === DECORATIVE LINE ===
    const lineY = imageY + imageSize + 50
    ctx.beginPath()
    ctx.moveTo(width / 2 - 60, lineY)
    ctx.lineTo(width / 2 + 60, lineY)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 2
    ctx.stroke()

    // === HEADLINE ===
    const headlineY = lineY + 80
    const headlineText = headline || 'PUT SOMEONE ON'
    
    // Fit headline to width
    const { fontSize: headlineFontSize } = fitTextToWidth(
      ctx, headlineText, width - 100, 64, 40
    )
    
    ctx.font = `900 ${headlineFontSize}px system-ui, -apple-system, sans-serif`
    
    // Gradient fill for headline
    const headlineGradient = ctx.createLinearGradient(
      width / 2 - 200, headlineY,
      width / 2 + 200, headlineY
    )
    headlineGradient.addColorStop(0, '#ffffff')
    headlineGradient.addColorStop(0.5, accent.primary)
    headlineGradient.addColorStop(1, '#ffffff')
    ctx.fillStyle = headlineGradient
    
    // Wrap if needed
    const headlineLines = wrapText(ctx, headlineText, width - 100, 2)
    headlineLines.forEach((line, i) => {
      ctx.fillText(line, width / 2, headlineY + i * (headlineFontSize + 10))
    })

    // === BAND NAME ===
    if (!isBandNameInLogo && bandName) {
      const bandNameY = headlineY + headlineLines.length * (headlineFontSize + 10) + 50
      ctx.font = '600 36px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      
      // Truncate if too long
      let displayName = bandName
      while (ctx.measureText(displayName).width > width - 100 && displayName.length > 10) {
        displayName = displayName.slice(0, -4) + '...'
      }
      ctx.fillText(`— ${displayName} —`, width / 2, bandNameY)
    }

    // === TAGLINE ===
    ctx.font = '28px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fillText('Scan • Listen • Follow', width / 2, height - 100)

    // === BRANDING ===
    ctx.font = '22px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
    ctx.fillText('via MusicBizQR', width / 2, height - 55)

    // Convert to blob
    return new Promise((resolve) => {
      canvasEl.toBlob((blob) => {
        resolve(blob)
      }, 'image/png')
    })
  } catch (err) {
    console.error('[fanShareImage] Failed to generate image:', err)
    return null
  }
}

export default {
  generateFanShareImage,
  getAccentForMoment,
  ACCENT_COLORS,
  MOMENT_ACCENTS,
}
