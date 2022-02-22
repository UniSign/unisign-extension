import { defineConfig } from 'tsup'
import NodeModulesPolyfills from '@esbuild-plugins/node-modules-polyfill'
import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill'
import { isDev } from './scripts/script-utils'

export default defineConfig(() => ({
  entry: {
    'background/index': './src/background/main.ts',
  },
  outDir: 'extension/dist',
  format: ['iife'],
  splitting: false,
  sourcemap: isDev ? 'inline' : false,
  define: {
    '__DEV__': JSON.stringify(isDev),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  minifyWhitespace: !isDev,
  minifySyntax: !isDev,
  esbuildPlugins: [
    NodeModulesPolyfills.NodeModulesPolyfillPlugin(),
    GlobalsPolyfills.NodeGlobalsPolyfillPlugin({
      process: true,
    }),
  ],
}))
