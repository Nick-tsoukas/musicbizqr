import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { defineEventHandler, getRouterParam, setHeader } from 'h3'

const WIDTH = 1200
const HEIGHT = 630

export default defineEventHandler(async (event) => {
  // Get the slug from the catch-all param (returns array) and remove .png extension
  const slugParam = getRouterParam(event, 'slug')
  // Handle both array (catch-all) and string formats
  const rawSlug = Array.isArray(slugParam) ? slugParam.join('/') : (slugParam || '')
  const bandSlug = rawSlug.replace(/\.png$/, '')
  
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

  // Generate SVG using Satori - matches share card style
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
          background: '#0a0a0a',
          fontFamily: 'Inter',
          position: 'relative',
        },
        children: [
          // Subtle gradient overlay
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(ellipse at center, rgba(20, 30, 40, 0.5) 0%, transparent 70%)',
              },
            },
          },
          // Band image with glow effect
          bandImageUrl ? {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '40px',
                position: 'relative',
              },
              children: [
                // Glow behind image
                {
                  type: 'div',
                  props: {
                    style: {
                      position: 'absolute',
                      width: '220px',
                      height: '220px',
                      borderRadius: '50%',
                      background: 'rgba(0, 200, 180, 0.15)',
                      filter: 'blur(30px)',
                    },
                  },
                },
                {
                  type: 'img',
                  props: {
                    src: bandImageUrl.startsWith('http') ? bandImageUrl : `${strapiUrl}${bandImageUrl}`,
                    style: {
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid rgba(255, 255, 255, 0.15)',
                    },
                  },
                },
              ],
            },
          } : null,
          // "PUT SOMEONE ON" headline
          {
            type: 'div',
            props: {
              style: {
                fontSize: '52px',
                fontWeight: 700,
                color: '#00c8b4',
                textAlign: 'center',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '16px',
              },
              children: 'PUT SOMEONE ON',
            },
          },
          // Band name with dashes
          {
            type: 'div',
            props: {
              style: {
                fontSize: '28px',
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
                maxWidth: '900px',
                marginBottom: '40px',
              },
              children: `— ${bandName} —`,
            },
          },
          // Tagline
          {
            type: 'div',
            props: {
              style: {
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.4)',
                letterSpacing: '2px',
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
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.25)',
              },
              children: 'via MusicBizQR',
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
  const fontUrl = 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff'
  
  try {
    const res = await fetch(fontUrl)
    return await res.arrayBuffer()
  } catch (err) {
    console.error('[og/band] Failed to load font:', err)
    return new ArrayBuffer(0)
  }
}
