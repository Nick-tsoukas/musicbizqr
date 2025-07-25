// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

//  trigger redeploy

  router: {
    options: {
      // @ts-ignore
      scrollBehavior(to, from, savedPosition) {
        // 1) use browser’s back/forward saved position
        if (savedPosition) {
          return savedPosition
        }
        // 2) if there’s a hash, scroll to that element
        if (to.hash) {
          return {
            el: to.hash,
            behavior: 'smooth',
            // adjust this if your header height changes
            top: 90
          }
        }
        // 3) otherwise go to top
        return { top: 0 }
      }
    }
  },

  vite: {
    optimizeDeps: {
      include: ['chart.js', 'chartjs-adapter-luxon',    '@tiptap/vue-3',
        '@tiptap/starter-kit',]
    }
  },
  build: {
    transpile: ['chart.js', 'chartjs-adapter-luxon',   '@tiptap/vue-3',
      '@tiptap/starter-kit',]
  },
  css: ['@/assets/css/tailwind.css', 'animate.css/animate.min.css', '@fortawesome/fontawesome-free/css/all.css'],

  runtimeConfig: {
     // ✅ Your Stripe secret config
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeDefaultPriceId: process.env.STRIPE_DEFAULT_PRICE_ID,
    resendKey: process.env.RESEND_API_KEY,
    contactTo: process.env.CONTACT_TO,
    contactFrom: process.env.CONTACT_FROM,
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
    '@nuxtjs/seo'
  ],

  site: {
    url: 'https://musicbizqr.com',
      name: 'MusicBizQR',
  description: 'Dynamic QR codes and smart links for bands and musicians.'
  },

  sitemap: {
    credits: false,
    xsl: false,
    cacheTime: 0, // disables caching to force regeneration
    sitemapName: 'sitemap.xml',
    async urls() {
      const base = process.env.STRAPI_URL || 'http://localhost:1337';
      console.log('🧠 Rebuilding sitemap from Strapi at:', base);
  
      const res = await fetch(`${base}/api/seo-pages?populate=category&pagination[pageSize]=1000`);
      const { data } = await res.json();
  
      // 1) Build a set of unique categories
      const categories = Array.from(
        new Set(data.map((page) => page.attributes.category || 'uncategorized'))
      );
  
      // 2) Generate a URL entry for each category (pillar page)
      const categoryUrls = categories.map((cat) => ({
        loc: `/article/${cat}`,
        changefreq: 'weekly',
        priority: 0.8,
      }));
  
      // 3) Generate a URL entry for each article (cluster page)
      const articleUrls = data.map((page) => {
        const cat = page.attributes.category || 'uncategorized';
        const slug = page.attributes.slug;
        return {
          loc: `/article/${cat}/${slug}`,
          lastmod: page.attributes.updatedAt,
          changefreq: 'weekly',
          priority: 0.9,
        };
      });
  
      console.log(`✅ Sitemap includes ${categories.length} categories and ${articleUrls.length} articles`);
  
      // 4) Return the combined list
      return [
        // optional: add other static routes here
        { loc: '/', changefreq: 'daily', priority: 1.0 },
        ...categoryUrls,
        ...articleUrls,
      ];
    },
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
    offset: 120, // Offset (in px) from the original trigger point
    delay: 0, // Delay value from 0 to 3000 (in ms)
    duration: 400, // Duration value from 0 to 3000 (in ms)
    easing: 'ease', // Default easing for AOS animations
    once: false, // Whether animation should happen only once
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
  
      try {
        const res = await fetch(seoApiUrl)
        const json = await res.json()
  
        const prerenderRoutes = []
        let skipped = 0
  
        for (const page of json.data) {
          const { category, slug } = page.attributes
  
          if (!category || !slug) {
            console.warn(`⚠️ Skipping SEO page (missing category or slug): ID ${page.id}`)
            skipped++
            continue
          }
  
          prerenderRoutes.push(`/article/${category}`)
          prerenderRoutes.push(`/article/${category}/${slug}`)
        }
  
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