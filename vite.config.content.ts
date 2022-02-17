import fs from 'fs'
import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'
import { replaceCodePlugin } from 'vite-plugin-replace'
import { sharedConfig } from './vite.config'
import { isDev, r } from './scripts/script-utils'
import windiConfig from './windi.config'
import packageJson from './package.json'

let providerContent = ''
try {
  providerContent = fs.readFileSync('./extension/dist/content-scripts/provider.js', 'utf8')
}
catch (e) {
  console.error(e)
}
// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  build: {
    watch: isDev ? {} : undefined,
    outDir: r('extension/dist/content-scripts'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    lib: {
      entry: r('src/content-scripts/index.ts'),
      name: packageJson.name,
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'content.js',
        extend: true,
      },
    },
  },
  plugins: [
    ...sharedConfig.plugins!,
    // inject provider source code to content-scripts
    replaceCodePlugin({
      replacements: [{
        from: '_CONTENT_SCRIPT_PROVIDER_SOURCE_CODE_',
        to: JSON.stringify(providerContent),
      }],
    }),
    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      config: {
        ...windiConfig,
        // disable preflight to avoid css population
        preflight: false,
      },
    }),
  ],
})
