import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import * as url from 'url'

const ROOT_DIR = path.dirname(url.fileURLToPath(import.meta.url))
const SIGN_DIST_DIR = path.join(path.dirname(ROOT_DIR), 'dist')

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    fs: {
      allow: [
        ROOT_DIR,
        SIGN_DIST_DIR
      ]
    }
  },
  publicDir: path.join(SIGN_DIST_DIR, 'dist'),
  resolve: {
    alias: {
      'sign.mjs': path.resolve(SIGN_DIST_DIR, 'sign.mjs')
    }
  },
  optimizeDeps: {
    exclude: ['sign.mjs']
  },
  plugins: [vue()]
})
