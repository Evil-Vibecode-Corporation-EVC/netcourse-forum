export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  ssr: false,

  vite: {
    optimizeDeps: {
      include: ['lucide-vue-next']
    }
  },
  app: {
    head: {
      title: 'NetCourse/Forum - Образовательный форум',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Образовательный форум для обсуждения тем по сетям и программированию'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/netlearn.png' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api',
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY
    }
  }
})
