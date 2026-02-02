import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { defineEventHandler, setHeader } from 'h3'

const WIDTH = 1200
const HEIGHT = 630

export default defineEventHandler(async (event) => {
  // Generate SVG using Satori - branded MusicBizQR image
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0f0f0f 100%)',
          fontFamily: 'Inter',
          position: 'relative',
        },
        children: [
          // Animated gradient orbs (static for OG)
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '-100px',
                left: '-100px',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                borderRadius: '50%',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '-150px',
                right: '-100px',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                borderRadius: '50%',
              },
            },
          },
          // QR code icon
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                borderRadius: '24px',
                marginBottom: '32px',
                boxShadow: '0 20px 60px rgba(139, 92, 246, 0.4)',
              },
              children: [
                {
                  type: 'svg',
                  props: {
                    width: 64,
                    height: 64,
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'white',
                    strokeWidth: 2,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    children: [
                      { type: 'path', props: { d: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' } },
                    ],
                  },
                },
              ],
            },
          },
          // Title
          {
            type: 'div',
            props: {
              style: {
                fontSize: '72px',
                fontWeight: 800,
                color: 'white',
                marginBottom: '16px',
                letterSpacing: '-2px',
              },
              children: 'MusicBizQR',
            },
          },
          // Tagline
          {
            type: 'div',
            props: {
              style: {
                fontSize: '28px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '40px',
              },
              children: 'Scan • Listen • Follow',
            },
          },
          // Feature pills
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '16px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      padding: '12px 24px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '100px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 500,
                    },
                    children: '🎵 Smart Links',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      padding: '12px 24px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '100px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 500,
                    },
                    children: '📊 Analytics',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      padding: '12px 24px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '100px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 500,
                    },
                    children: '🎨 Custom QR Codes',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: 'Inter',
          data: await loadFont(),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: await loadFont(700),
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: await loadFont(800),
          weight: 800,
          style: 'normal',
        },
      ],
    }
  )

  // Convert SVG to PNG
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
  })
  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  // Set headers for image response with caching
  setHeader(event, 'Content-Type', 'image/png')
  setHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=604800') // 1 day browser, 7 days CDN

  return pngBuffer
})

// Load Inter font from Google Fonts
async function loadFont(weight = 400): Promise<ArrayBuffer> {
  const url = `https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff`
  
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Font fetch failed')
    return await response.arrayBuffer()
  } catch {
    // Fallback: return empty buffer (satori will use default)
    return new ArrayBuffer(0)
  }
}
