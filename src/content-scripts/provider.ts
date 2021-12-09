import { EventEmitter } from 'events'
import CrxBridge from 'crx-bridge'
import { onDomReady } from './utils'

// we can only use crx-bridge@2.2 now, as there is bug with crx-bridge@3.0 and webext-bridge according to the issue below
// https://github.com/zikaari/crx-bridge/issues/11
CrxBridge.setNamespace('unisign-extension-provider')

export class UniSignProvider extends EventEmitter {
  isUniSign = true

  private _isConnected = false
  // private _isInitialized = false
  private _isUnlocked = false

  isConnected () {
    return this._isConnected
  }

  async isUnlocked () {
    return this._isUnlocked
  }

  constructor () {
    super()

    this.init()
  }

  private init () {
    document.addEventListener('visibilitychange', () => {
      this._requestPromiseCheckVisibility()
    })

    CrxBridge.onMessage('background-to-provider', (event) => {
      this._handleBackgroundMessage(event.data.event, event.data.data)
    })

    onDomReady(($) => {
      const origin = window?.location.origin
      const icon = ($('head link[rel~="icon"]') as HTMLLinkElement)?.href || ($('head meta[itemprop="image"]') as HTMLMetaElement).content

      const name = document.title || ($('head > meta[name="title"]') as HTMLMetaElement)?.content || origin

      CrxBridge.sendMessage('provider-to-background', {
        method: 'new_tab',
        params: {
          icon, name, origin,
        },
      }, 'background')
    })
  }

  private _requestPromiseCheckVisibility () {

  }

  private _handleBackgroundMessage (event: string, data: any) {
    // eslint-disable-next-line no-console
    console.log(event, data)
  }

  request (data: any) {
    // eslint-disable-next-line no-console
    console.log(data)
  }
}

declare global {
  interface Window {
    unisign: UniSignProvider
  }
}

const provider = new UniSignProvider()

window.unisign = provider

// used on mobile wallet to notify dapp asynchronously
window.dispatchEvent(new Event('unisign#initialized'))
