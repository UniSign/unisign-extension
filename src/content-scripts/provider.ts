import { EventEmitter } from 'events'
import { onDomReady } from './utils'
import { messageBridge } from '~/utils/messages'

messageBridge.setNamespace()

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

    messageBridge.on('background-to-provider', (event) => {
      this._handleBackgroundMessage(event.data.event, event.data.data)
    })

    onDomReady(($) => {
      const origin = window?.location.origin
      const icon = ($('head link[rel~="icon"]') as HTMLLinkElement)?.href || ($('head meta[itemprop="image"]') as HTMLMetaElement).content

      const name = document.title || ($('head > meta[name="title"]') as HTMLMetaElement)?.content || origin

      messageBridge.send('provider-to-background', {
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
