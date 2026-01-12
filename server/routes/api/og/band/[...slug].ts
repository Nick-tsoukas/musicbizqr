import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { defineEventHandler, getRouterParam, setHeader } from 'h3'

const WIDTH = 1200
const HEIGHT = 630

export default defineEventHandler(async (event) => {
  // Get the slug from the catch-all param and remove .png extension
  const slugParam = getRouterParam(event, 'slug') || ''
  const bandSlug = slugParam.replace(/\.png$/, '')
  
  if (!bandSlug) {
    throw createError({ statusCode: 400, message: 'Missing bandSlug' })
  }

  const config = useRuntimeConfig()
  const strapiUrl = config.public.strapiUrl || 'http://localhost:1337'

  // Fetch band data from Strapi
  let band: any = null
  try {
    const res = await fetch(
      `${strapiUrl}/api/bands?filters[slug][$eq]=${bandSlug}&populate=bandImg`
    )
    const json = await res.json()
    band = json.data?.[0]
  } catch (err) {
    console.error('[og/band] Failed to fetch band:', err)
  }

  const bandName = band?.name || band?.attributes?.name || bandSlug
  const bandImageUrl = band?.bandImg?.url || band?.attributes?.bandImg?.data?.attributes?.url || null

  // Generate SVG using Satori
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
          background: 'linear-gradient(135deg, #1a0a2e 0%, #0f0f0f 50%, #0a1a1a 100%)',
          fontFamily: 'Inter',
        },
        children: [
          // Decorative circle top right
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '40px',
                right: '80px',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.2)',
              },
            },
          },
          // Decorative circle bottom left
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '60px',
                left: '100px',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
              },
            },
          },
          // Band image (if available)
          bandImageUrl ? {
            type: 'img',
            props: {
              src: bandImageUrl.startsWith('http') ? bandImageUrl : `${strapiUrl}${bandImageUrl}`,
              style: {
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '30px',
              },
            },
          } : null,
          // Band name
          {
            type: 'div',
            props: {
              style: {
                fontSize: '72px',
                fontWeight: 700,
                color: '#ffffff',
                textAlign: 'center',
                maxWidth: '1000px',
                lineHeight: 1.1,
              },
              children: bandName,
            },
          },
          // Tagline
          {
            type: 'div',
            props: {
              style: {
                fontSize: '32px',
                color: '#c4b5fd',
                marginTop: '20px',
              },
              children: 'Scan • Listen • Follow',
            },
          },
          // Watermark
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '30px',
                right: '40px',
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.4)',
              },
              children: 'MusicBizQR',
            },
          },
        ].filter(Boolean),
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: 'Inter',
          data: await loadDefaultFont(),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: await loadDefaultFont(),
          weight: 700,
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

  // Set headers
  setHeader(event, 'Content-Type', 'image/png')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800')

  return pngBuffer
})

// Load a default font for Satori
async function loadDefaultFont(): Promise<ArrayBuffer> {
  // Use Inter font from Google Fonts CDN
  const fontUrl = 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff'
  
  try {
    const res = await fetch(fontUrl)
    return await res.arrayBuffer()
  } catch (err) {
    console.error('[og/band] Failed to load font:', err)
    // Return empty buffer as fallback
    return new ArrayBuffer(0)
  }
}
