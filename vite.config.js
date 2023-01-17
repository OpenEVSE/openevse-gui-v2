import { defineConfig, loadEnv } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'
// import legacy from '@vitejs/plugin-legacy'

import { dependencies } from './package.json';
function renderChunks(deps) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    // if (['luxon', 'svelte-i18n', 'iconify-icon'].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log('mode', { env })
  
  
  return {
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [],
            ...renderChunks(dependencies),
          },
        },
      },
    },

    plugins: [
      svelte(),viteCompression({deleteOriginFile: true, algorithm: "gzip",filter: /\.(js|mjs|json|css|html)$/i}),
      // legacy({
      //   targets: ['defaults'],
      // }),
      VitePWA({ 
        registerType: 'autoUpdate',
        injectRegister: null,
        selfDestroying: true,
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,gz,woff,woff2}']
        },
        useCredentials: 'true',
        devOptions: {
          enabled: true
        },
        includeAssets: ['favicon.ico'],
        manifest: {
          name: 'OpenEVSE UI',
          short_name: 'OpenEVSE',
          description: 'OpenEVSE User Interface',
          categories: 'car,energy,electric vehicle,ev,charger',
          theme_color: 'blue',
          background_color: 'hsl(189, 53%, 47%)',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-maskable.png',
              sizes: '96x96',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
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
        '/api': {
          target: 'http://' + env.VITE_OPENEVSEHOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/ws': {
          target: 'ws://' + env.VITE_OPENEVSEHOST,
          ws: true,
        },
        '/debug/console': {
          target: 'ws://' + env.VITE_OPENEVSEHOST,
          ws: true,
        },
        '/evse/console': {
          target: 'ws://' + env.VITE_OPENEVSEHOST,
          ws: true,
        },
        '/debug': {
          target: 'http://' + env.VITE_OPENEVSEHOST,
          changeOrigin: true,
        },
        '/evse': {
          target: 'http://' + env.VITE_OPENEVSEHOST,
          changeOrigin: true,
        }
      }
    }
  }
});