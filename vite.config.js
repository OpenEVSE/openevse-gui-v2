import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';



// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log('mode', { env })


  return {
    plugins: [
      svelte(),viteCompression({deleteOriginFile: false, algorithm: "gzip"}),
      VitePWA({ 
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,gz}']
        },
        useCredentials: 'true',
        devOptions: {
          enabled: true
        },
        includeAssets: ['favicon.ico', 'masked-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable.png'],
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
              target: 'http://' + env.VITE_OPENEVSEHOST + '/schedule',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/schedule/, '')
            },
            '/status': {
              target: 'http://' + env.VITE_OPENEVSEHOST + '/status',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/status/, '')
            },
            '/config': {
              target: 'http://' + env.VITE_OPENEVSEHOST + '/config',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/config/, '')
            },
            '/claims/': {
              target: 'http://' + env.VITE_OPENEVSEHOST + '/claims/',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/claims/, '')
            },
            '/override': {
              target: 'http://' + env.VITE_OPENEVSEHOST + '/override',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/override/, '')
            },
            '/shaper': {
              target: 'http://' + env.VITE_OPENEVSEHOST + '/shaper',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/shaper/, '')
            },
            '/divertmode': {
              target: 'http://' + env.VITE_OPENEVSEHOST + '/divertmode',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/divertmode/, '')
            },
            '/scan': {
              target: 'http://' + env.VITE_OPENEVSEHOST + '/scan',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/scan/, '')
            }
        }
    }
  }

});