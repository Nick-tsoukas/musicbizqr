// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

//  trigger redeploy

  // Router scroll behavior is configured in app/router.options.ts

  vite: {
    optimizeDeps: {
      include: ['chart.js', 'chartjs-adapter-luxon',    '@tiptap/vue-3',
        '@tiptap/starter-kit',]
    }
  },
  
  build: {
    transpile: ['chart.js', 'chartjs-adapter-luxon',   '@tiptap/vue-3',
      '@tiptap/starter-kit']
  },
  css: ['@/assets/css/tailwind.css', 'animate.css/animate.min.css', '@fortawesome/fontawesome-free/css/all.css'],

  runtimeConfig: {
     gaPropertyId: process.env.GA_PROPERTY_ID,
    gaServiceAccountJson: process.env.GA_SERVICE_ACCOUNT_JSON,
     // ✅ Your Stripe secret config
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeDefaultPriceId: process.env.STRIPE_DEFAULT_PRICE_ID,
    resendKey: process.env.RESEND_API_KEY,
    contactTo: process.env.CONTACT_TO,
    contactFrom: process.env.CONTACT_FROM,
     strapiApiToken: process.env.STRAPI_API_TOKEN,
    public: {
      strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337',
        baseUrl: process.env.BASE_URL || 'https://musicbizqr.com',
      // strapiUrl: ' https://finite-fit-queries-kansas.trycloudflare.com',
    
      stripe: {
        key: process.env.STRIPE_PUBLISHABLE_KEY,
        options: {},
      },
    },
    stripe: {
      key: process.env.STRIPE_SECRET_KEY,
      options: {},
    },

  },

  app: {
    head: {
   
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }
      ],
    },
  },

  devtools: { enabled: true },

  modules: [
    'nuxt-aos',
    'nuxt-headlessui',
    "@nuxtjs/tailwindcss",
    "@nuxtjs/strapi",
    'nuxt-tiptap-editor',
    '@vee-validate/nuxt',
    "@nuxt/image",
    "nuxt-particles",
    "@unlok-co/nuxt-stripe",
    '@nuxtjs/seo',
    '@pinia/nuxt'
  ],

   image: {
    // Allow your S3 bucket host
    domains: [
      'qrcode101.s3.us-east-1.amazonaws.com',
    ],

    // Optional alias if you want to prefix short names later
    alias: {
      s3: 'https://qrcode101.s3.us-east-1.amazonaws.com',
    },

    // Preset for small dashboard thumbnails
    presets: {
      dashboardThumb: {
        modifiers: {
          width: 100,
          height: 100,
          fit: 'cover',
          format: 'webp',
          quality: 60,
        },
      },
    },
  },

  site: {
    url: 'https://musicbizqr.com',
      name: 'MusicBizQR',
  description: 'Dynamic QR codes and smart links for bands and musicians.'
  },

sitemap: {
  credits: false,
  xsl: false,
  cacheTime: 0,
  sitemapName: 'sitemap.xml',

  async urls() {
    const base = process.env.STRAPI_URL || 'http://localhost:1337'
    const site = process.env.BASE_URL || 'https://musicbizqr.com'

    const res = await fetch(`${base}/api/seo-pages?pagination[pageSize]=1000`)
    const { data } = await res.json()

    // Helper: normalize slug for SEO-safe URLs
    const normalizeSlug = (str) => {
      if (!str) return ''
      return String(str)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/[.,!?:;/"']+$/g, '')
        .replace(/^-+|-+$/g, '')
    }

    // Helper: validate slug is valid (non-empty, not "null")
    const isValidSlug = (str) => {
      if (!str) return false
      const normalized = normalizeSlug(str)
      if (!normalized) return false
      if (normalized === 'null' || normalized === 'undefined') return false
      return true
    }

    // ✅ Only include "good" categories (no uncategorized, no null, normalized)
    const categories = Array.from(
      new Set(
        data
          .map((page) => normalizeSlug(page.attributes.category))
          .filter((cat) => isValidSlug(cat) && cat !== 'uncategorized')
      )
    )

    const categoryUrls = categories.map((cat) => ({
      loc: `/article/${cat}`,
      changefreq: 'weekly',
      priority: 0.8
    }))

    // ✅ Only include valid article URLs (must have valid category+slug, normalized)
    const articleUrls = data
      .map((page) => {
        const cat = normalizeSlug(page.attributes.category)
        const slug = normalizeSlug(page.attributes.slug)
        
        // Skip invalid entries
        if (!isValidSlug(cat) || !isValidSlug(slug)) return null
        if (cat === 'uncategorized') return null

        return {
          loc: `/article/${cat}/${slug}`,
          lastmod: page.attributes.updatedAt,
          changefreq: 'weekly',
          priority: 0.9
        }
      })
      .filter(Boolean)

    return [
      { loc: '/', changefreq: 'daily', priority: 1.0 },
      { loc: '/article', changefreq: 'weekly', priority: 0.9 },
      { loc: '/contact', changefreq: 'monthly', priority: 0.4 },
      { loc: '/privacypolicy', changefreq: 'yearly', priority: 0.2 },
      { loc: '/termsofservice', changefreq: 'yearly', priority: 0.2 },

      ...categoryUrls,
      ...articleUrls
    ]
  }
},

  aos: {
    // Global settings:
    disable: false, // Disable AOS globally (e.g., for mobile devices)
    startEvent: 'DOMContentLoaded', // Event to initialize AOS
    initClassName: 'aos-init', // Class applied after initialization
    animatedClassName: 'aos-animate', // Class applied on animation
    useClassNames: false, // Add content of `data-aos` as classes on scroll
    disableMutationObserver: false, // Disable automatic mutations' detections
    debounceDelay: 50, // Delay on debounce used while resizing window
    throttleDelay: 99, // Delay on throttle used while scrolling the page

    // Settings that can be overridden on per-element basis:
    offset: 50, // Offset (in px) from the original trigger point - reduced for mobile
    delay: 0, // Delay value from 0 to 3000 (in ms)
    duration: 400, // Duration value from 0 to 3000 (in ms)
    easing: 'ease', // Default easing for AOS animations
    once: true, // Whether animation should happen only once - set true so elements stay visible
    mirror: false, // Whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // Defines which position of the element regarding to window should trigger the animation
  },

  stripe: {
    server: {
      key: process.env.STRIPE_SECRET_KEY,
      options: {
        // Optional: Additional Stripe configuration options
      },
    },
    client: {
      key: process.env.STRIPE_PUBLIC_KEY,
      manualClientLoad: true,
      options: {
        // Optional: Additional Stripe.js configuration options
      },
    },
  },

  particles: {
    mode: 'full',
    lazy: true
  },

  strapi: {
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    prefix: '/api',
    admin: '/admin',
    version: 'v4',
    cookie: {},
    cookieName: 'strapi_jwt'
  },

    nitro: {
    externals: { inline: ['geoip-lite'] },
    routeRules: {
     '/**': {
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
          'Content-Security-Policy':
            "frame-src 'self' https:; child-src 'self' https:;",
        }
      },
     '/article/smart-links/smart-links': {
        redirect: { to: '/article/smart-links', statusCode: 301 }
      },

      '/article/qr-code-strategy/qr-code-strategy': {
        redirect: { to: '/article/qr-code-strategy', statusCode: 301 }
      },

      '/article/music-marketing/music-marketing': {
        redirect: { to: '/article/music-marketing', statusCode: 301 }
      },

      '/article/fan-funnels/fan-funnels': {
        redirect: { to: '/article/fan-funnels', statusCode: 301 }
      },

      '/article/touring-events/touring-events': {
        redirect: { to: '/article/touring-events', statusCode: 301 }
      },
    }
  },

  plugins: [
    '~/plugins/chart.js',
    '~/plugins/fontawesome.js',
     '~/plugins/vue-echarts.client.ts'
   
  ],

  compatibilityDate: '2025-04-11',

  hooks: {
    'nitro:config': async (nitroConfig) => {
      if (process.env.NODE_ENV !== 'production') return
  
      const seoApiUrl = `${process.env.STRAPI_URL}/api/seo-pages?populate=category&pagination[pageSize]=1000`
  
      // Helper: normalize slug for SEO-safe URLs
      const normalizeSlug = (str) => {
        if (!str) return ''
        return String(str)
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/[.,!?:;/"']+$/g, '')
          .replace(/^-+|-+$/g, '')
      }

      // Helper: validate slug is valid (non-empty, not "null")
      const isValidSlug = (str) => {
        if (!str) return false
        const normalized = normalizeSlug(str)
        if (!normalized) return false
        if (normalized === 'null' || normalized === 'undefined') return false
        return true
      }

      try {
        const res = await fetch(seoApiUrl)
        const json = await res.json()
  
        const prerenderRoutes = []
        let skipped = 0
  
        for (const page of json.data) {
          const rawCategory = page.attributes.category
          const rawSlug = page.attributes.slug
          
          const category = normalizeSlug(rawCategory)
          const slug = normalizeSlug(rawSlug)
  
          if (!isValidSlug(category) || !isValidSlug(slug)) {
            console.warn(`⚠️ Skipping SEO page (invalid category or slug): ID ${page.id}, category="${rawCategory}", slug="${rawSlug}"`)
            skipped++
            continue
          }
  
          prerenderRoutes.push(`/article/${category}/${slug}`)
        }

        prerenderRoutes.push('/article')
  
        console.log(`✅ Pre-rendering ${prerenderRoutes.length} routes (${json.data.length - skipped} of ${json.data.length} articles)`)
  
        nitroConfig.prerender = nitroConfig.prerender || {}
        nitroConfig.prerender.routes = [
          ...(nitroConfig.prerender.routes || []),
          ...prerenderRoutes,
        ]
      } catch (e) {
        console.error('❌ Failed to prerender SEO pages:', e)
      }
    }
  }
  
  
  
})