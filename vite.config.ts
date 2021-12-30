import { dirname, relative } from 'path'
import { defineConfig, UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import WindiCSS from 'vite-plugin-windicss'
import windiConfig from './windi.config'
import { r, port, isDev } from './scripts/script-utils'

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: {
      '~/': `${r('src')}/`,
      // some deps need `stream` in node core libs, but vite does not polyfill those libs, so we have to alias them ourselves.
      // https://github.com/vitejs/vite/issues/5398#issuecomment-950288364
      'stream': 'readable-stream',

      // todo: there may be a chance for a new package polyfills all the missing packages
      // https://github.com/vitejs/vite/issues/847
      // https://github.com/vitejs/vite/issues/728
    },
  },
  define: {
    '__DEV__': isDev,
    // since vite does not polyfill process.env, we have to define it ourselves
    'process.env': process.env,
    // readable-stream need `process.version`
    'process.version': `'${process.version}'`,
  },
  plugins: [
    Vue(),

    AutoImport({
      imports: [
        'vue',
        {
          'webextension-polyfill': [
            ['default', 'browser'],
          ],
        },
      ],
      dts: r('src/auto-imports.d.ts'),
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      dirs: [r('src/ui/components')],
      // generate `components.d.ts` for ts support with Volar
      dts: true,
      resolvers: [
        // auto import icons
        IconsResolver({
          componentPrefix: '',
        }),
      ],
    }),

    // https://github.com/antfu/unplugin-icons
    Icons(),

    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml (html, { path }) {
        return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`)
      },
    },
  ],
  optimizeDeps: {
    include: [
      'vue',
      '@vueuse/core',
      'webextension-polyfill',
    ],
    exclude: [],
  },
}

export default defineConfig(({ command }) => ({
  ...sharedConfig,
  base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
  server: {
    port,
    hmr: {
      host: 'localhost',
    },
  },
  build: {
    outDir: r('extension/dist'),
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
    },
    rollupOptions: {
      input: {
        background: r('src/background/index.html'),
        // ui
        popup: r('src/ui/popup/index.html'),
        options: r('src/ui/options/index.html'),
      },
    },
  },
  plugins: [
    ...sharedConfig.plugins!,

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      config: windiConfig,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/ui/styles/global.scss";',
      },
    },
  },
}))
