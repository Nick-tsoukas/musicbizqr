// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

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
      script: [
        // 1) A-Frame itself
        { src: 'https://aframe.io/releases/1.4.1/aframe.min.js' },
        // 2) AR.js extension (must come after A-Frame)
        {
          src: 'https://raw.githack.com/AR-js-org/AR.js/3.4.2/aframe/build/aframe-ar.js',
          defer: true
        },
        {
          src: 'https://unpkg.com/aframe-html-shader@^1.0.0/dist/aframe-html-shader.min.js',
          defer: true,
        },
      ],
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
    "@unlok-co/nuxt-stripe"
  ],



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

  compatibilityDate: '2025-04-11'
})