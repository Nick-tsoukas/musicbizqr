// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['@/assets/css/tailwind.css', 'animate.css/animate.min.css', '@fortawesome/fontawesome-free/css/all.css'],
  runtimeConfig: {
    public: {
      strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337',
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
    'nuxt-headlessui',
    "@nuxtjs/tailwindcss",
    "@nuxtjs/strapi",
    '@vee-validate/nuxt',
    "@nuxt/image",
    "nuxt-particles",
    "@unlok-co/nuxt-stripe"
  ],

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
   
  ]
})