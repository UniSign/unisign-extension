import browser from 'webextension-polyfill'
import { messageBridge } from '~/utils/messages'

messageBridge.allowWindowMessaging()

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
;(() => {
  // inject unisign provider
  const script = document.createElement('script')
  // @ts-expect-error replaced by vite.config.provider.ts
  script.textContent = _CONTENT_SCRIPT_PROVIDER_SOURCE_CODE_

  ;(document.head || document.documentElement).appendChild(script)
  // remove the injecting tag when loaded
  script.onload = () => script.parentNode?.removeChild(script)

  if (process.env.NODE_ENV === 'development') {
    // inject inpage-app css when development
    const styleEl = document.createElement('link')
    styleEl.setAttribute('rel', 'stylesheet')
    styleEl.setAttribute('href', browser.runtime.getURL('dist/content-scripts/style.css'))
    ;(document.head || document.documentElement).appendChild(styleEl)
  }
})()
