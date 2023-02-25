import { defineConfig, loadEnv } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer }		from "rollup-plugin-visualizer"
// import { dependencies } from './package.json';
import fs from 'fs'

// function renderChunks(deps) {
//   let chunks = {};
//   Object.keys(deps).forEach((key) => {
//     // if (['luxon', 'svelte-i18n', 'iconify-icon', 'svelte-local-storage-store', 'promise-batching-queue', 'hacktimer', 'bulma-slider', 'svelte-spa-router', 'svelte-spa-chunk'].includes(key)) return;
//     chunks[key] = [key];
//   });
//   return chunks;
//}

const confFolder = './src/components/blocks/configuration/';

function configChunk() {
  let files = fs.readdirSync(confFolder, {withFileTypes: true})
  .filter(item => !item.isDirectory())
  .map(item => confFolder + item.name)
  console.log(files)
 return files
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
            vendor: ['luxon', 'svelte-i18n', 'iconify-icon', 'svelte-local-storage-store', 'hacktimer'],
            components: [
              './src/components/ui/Borders.svelte',
              './src/components/ui/Button.svelte',
              './src/components/ui/Checkbox.svelte',
              './src/components/ui/IconButton.svelte',
              './src/components/ui/InputForm.svelte',
              './src/components/ui/Loader.svelte',
              './src/components/ui/RemovableTag.svelte',
              './src/components/ui/Select.svelte',
              './src/components/ui/SliderForm.svelte',
              './src/components/ui/Switch.svelte',
              './src/components/ui/Tabs.svelte',
              './src/components/blocks/main/Limit.svelte'
            ],
            config:
              configChunk(),
            // ...renderChunks(dependencies),
          },
        },
      },
    },
    resolve: {
      alias: {
        "~bulma": "bulma",
      },
    },
    plugins: [
      visualizer(),
      svelte(),
      viteCompression({deleteOriginFile: true, algorithm: "gzip",filter: /\.(js|mjs|json|css|html)$/i}),
      VitePWA({ 
        registerType: 'autoUpdate',
        injectRegister: null,
        selfDestroying: true,
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,gz}']
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