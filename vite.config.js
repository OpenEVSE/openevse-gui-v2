import { defineConfig, loadEnv } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log('mode', { env })
  
  
  return {
    plugins: [
      svelte(),viteCompression({deleteOriginFile: true, algorithm: "gzip",filter: /\.(js|mjs|json|css|html|woff|ico)$/i}),

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
          name: 'OpenEVSE',
          short_name: 'OpenEVSE',
          description: 'Web UI for OpenEVSE WiFi module',
          theme_color: '#32b3d4',
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
              sizes: '96x96',
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
        '/api': {
          target: 'http://' + env.VITE_OPENEVSEHOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
});