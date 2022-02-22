// generate stub index.html files for dev entry
import { execSync } from 'child_process'
import fs from 'fs-extra'
import chokidar from 'chokidar'
import { r, port, isDev, log } from './script-utils'

/**
 * Stub index.html to use Vite in development
 */
async function stubIndexHtml () {
  const views = [
    'options',
    'popup',
  ]

  for (const view of views) {
    await fs.ensureDir(r(`extension/dist/ui/${view}`))
    let data = await fs.readFile(r(`src/ui/${view}/index.html`), 'utf-8')
    data = data
      .replace('"./main.ts"', `"http://localhost:${port}/ui/${view}/main.ts"`)
      .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>')

    await fs.writeFile(r(`extension/dist/ui/${view}/index.html`), data, 'utf-8')
    log('PRE', `stub ${view}.html`)
  }
}

function writeManifest () {
  execSync('npx esno ./scripts/manifest.ts', { stdio: 'inherit' })
}

writeManifest()

if (isDev) {
  stubIndexHtml()
  chokidar.watch(r('src/**/*.html'))
    .on('change', () => {
      stubIndexHtml()
    })
  chokidar.watch([r('src/manifest.ts'), r('package.json')])
    .on('change', () => {
      writeManifest()
    })
}
