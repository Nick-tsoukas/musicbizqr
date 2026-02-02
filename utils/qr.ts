/**
 * QR Code Utilities
 * Sanitization and validation for QR code data
 */

/**
 * Remove invisible characters that can corrupt QR scanning
 * - BOM (Byte Order Mark)
 * - Zero-width characters
 * - Other invisible Unicode
 */
export function sanitizeQrValue(value: unknown): string {
  // Convert to string
  let str = String(value ?? '')
  
  // Remove BOM and zero-width characters
  str = str.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '')
  
  // Remove other common invisible characters
  str = str.replace(/[\u2060\u180E]/g, '')
  
  // Trim whitespace
  str = str.trim()
  
  console.log('[QR Sanitize] Input:', JSON.stringify(String(value)))
  console.log('[QR Sanitize] Output:', JSON.stringify(str))
  console.log('[QR Sanitize] Char codes:', [...str.slice(0, 30)].map(c => c.charCodeAt(0)))
  
  return str
}

/**
 * Validate that a value is a valid HTTPS URL
 */
export function assertHttpsUrl(value: string): boolean {
  const sanitized = sanitizeQrValue(value)
  
  if (!sanitized) {
    console.error('[QR Validate] Empty value')
    return false
  }
  
  if (!sanitized.startsWith('https://')) {
    console.error('[QR Validate] Not HTTPS:', sanitized)
    return false
  }
  
  try {
    new URL(sanitized)
    return true
  } catch {
    console.error('[QR Validate] Invalid URL:', sanitized)
    return false
  }
}

/**
 * Safe Mode QR configuration - proven to scan on all devices
 * Use this for downloads to ensure maximum compatibility
 */
export const SAFE_QR_CONFIG = {
  width: 420,
  height: 420,
  margin: 20, // Quiet zone - critical for scanning
  qrOptions: {
    errorCorrectionLevel: 'M' as const, // Medium error correction
  },
  dotsOptions: {
    type: 'square' as const,
    color: '#000000',
  },
  cornersSquareOptions: {
    type: 'square' as const,
    color: '#000000',
  },
  cornersDotOptions: {
    type: 'square' as const,
    color: '#000000',
  },
  backgroundOptions: {
    color: '#FFFFFF', // Solid white - NO transparency
  },
  // No image/logo in safe mode - maximizes scan reliability
  image: undefined,
  imageOptions: undefined,
}

/**
 * Merge user config with safe mode overrides
 */
export function applySafeMode(config: Record<string, any>): Record<string, any> {
  return {
    ...config,
    ...SAFE_QR_CONFIG,
    // Preserve data from original config
    data: sanitizeQrValue(config.data),
  }
}

/**
 * Debug helper - get QR config summary for troubleshooting
 */
export function getQrDebugInfo(config: Record<string, any>, rawValue: string): Record<string, any> {
  const sanitized = sanitizeQrValue(rawValue)
  return {
    rawValue: JSON.stringify(rawValue),
    sanitizedValue: JSON.stringify(sanitized),
    charCodes: [...sanitized.slice(0, 24)].map(c => c.charCodeAt(0)),
    stringLength: sanitized.length,
    config: {
      width: config.width,
      height: config.height,
      margin: config.margin,
      errorCorrectionLevel: config.qrOptions?.errorCorrectionLevel,
      dotsType: config.dotsOptions?.type,
      dotsColor: config.dotsOptions?.color,
      bgColor: config.backgroundOptions?.color,
      hasLogo: !!config.image,
    }
  }
}
