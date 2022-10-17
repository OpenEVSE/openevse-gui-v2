import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import Icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),viteCompression({deleteOriginFile: false, algorithm: "gzip"}),
    Icons({
      // experimental
      autoInstall: true,
    }),
    VitePWA({ 
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,gz}']
      },
      useCredentials: 'true',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'masked-icon.png'],
      manifest: {
        name: 'OpenEVSE Wifi UI',
        short_name: 'OpenEVSE',
        description: 'Web UI for OpenEVSE WiFi module',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }]
        }
      })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/variables.scss" as *;',
      },
    },
  },
  base: './',


  server: {
      host: "0.0.0.0",
      proxy: {
          '/schedule': {
            target: 'http://openevse.local/schedule',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/schedule/, '')
          },
          '/status': {
            target: 'http://openevse.local/status',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/status/, '')
          },
          '/config': {
            target: 'http://openevse.local/config',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/config/, '')
          },
          '/claims/': {
            target: 'http://openevse.local/claims/',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/claims/, '')
          },
          '/override': {
            target: 'http://openevse.local/override',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/override/, '')
          }
      },
  }

});