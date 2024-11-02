export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['nuxt-electron', '@nuxtjs/i18n', '@nuxtjs/color-mode'],
  electron: {
    // Configure aqui as opções do Electron, se necessário
    // Por exemplo, se você quiser personalizar o caminho do main.js
    // main: 'diretorio/main.js', // Adicione o caminho se necessário
  },
});