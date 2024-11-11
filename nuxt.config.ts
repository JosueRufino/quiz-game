// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  app: {
    head: {
      title: "Quiz Code",
      script: [
        {
          defer: true,
          tagPosition: "bodyClose",
          src: "https://cdn.jsdelivr.net/npm/bootstrap@5/dist/js/bootstrap.bundle.min.js",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/assets/puzzle.png",
        },
      ],
      meta: [{ charset: "utf-8" }],
    },
  },
  modules: ["@nuxtjs/i18n", '@pinia/nuxt', "nuxt-echarts"],
  echarts: {
    charts: ['BarChart'],
    components: ['DatasetComponent', 'GridComponent', 'TooltipComponent'],
  },
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "bootstrap-icons/font/bootstrap-icons.css",
  ],
});