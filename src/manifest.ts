import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/script-utils'

export async function getManifest () {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    browser_action: {
      default_icon: './assets/icon-128.png',
      default_popup: './dist/ui/popup/index.html',
    },
    options_ui: {
      page: './dist/ui/options/index.html',
      open_in_tab: true,
      chrome_style: false,
    },
    background: {
      page: './dist/background/index.html',
      persistent: false,
    },
    icons: {
      16: './assets/icon-128.png',
      48: './assets/icon-128.png',
      128: './assets/icon-128.png',
    },
    permissions: [
      'tabs',
      'storage',
      'activeTab',
      'http://*/',
      'https://*/',
    ],
    content_scripts: [{
      matches: ['http://*/*', 'https://*/*'],
      js: ['./dist/content-scripts/content.js'],
    }],
    web_accessible_resources: [
      'dist/content-scripts/provider.js',
      'dist/content-scripts/style.css',
    ],
    // todo: figure out how to remove unsafe-eval which introduced by vue-i18n@next
    // todo: figure out how to remove wasm-eval which introduced by [wasm](https://stackoverflow.com/a/54033309)
    content_security_policy: `script-src \'self\' \'unsafe-eval\' \'wasm-eval\' http://localhost:${port} https://at.alicdn.com; object-src \'self\'`,
  }

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts
    manifest.permissions?.push('webNavigation')
  }

  return manifest
}
