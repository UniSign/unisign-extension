/* eslint-disable no-console */
import { createApp } from 'vue'
import App from '../ui/inpage/App.vue'
import { messageBridge } from '~/utils/messages'
import './provider'

messageBridge.allowWindowMessaging()

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
;(() => {
  if (process.env.NODE_ENV === 'development') {
    console.info('[unisign] Hello world from content script')

    // mount component to context window
    const container = document.createElement('div')
    const root = document.createElement('div')
    const styleEl = document.createElement('link')
    const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
    styleEl.setAttribute('rel', 'stylesheet')
    styleEl.setAttribute('href', browser.runtime.getURL('dist/content-scripts/style.css'))
    shadowDOM.appendChild(styleEl)
    shadowDOM.appendChild(root)
    document.body.appendChild(container)
    createApp(App).mount(root)
  }

  // inject unisign provider
  const script = document.createElement('script')
  // @ts-ignore
  script.src = chrome.extension.getURL('dist/content-scripts/provider.js')

  ;(document.head || document.documentElement).appendChild(script)
  // remove the injecting tag when loaded
  script.onload = () => script.parentNode?.removeChild(script)
})()
