import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(),viteCompression({deleteOriginFile: false, algorithm: "gzip"})],
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