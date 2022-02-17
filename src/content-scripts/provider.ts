import './inject-inpage-app'
import { EventEmitter } from 'events'
import { ethErrors } from 'eth-rpc-errors'
import { onDomReady } from './utils'
import type {
  PermittedKeyObjectType,
  SignPlainMessageParams,
  SignStructMessageParams,
  SignTransactionParams,
} from '~/background/controllers/provider/index'
import { messageBridge } from '~/utils/messages'

messageBridge.setNamespace()

interface JsonRpcPayload {
  method: string
  params: object
}

export class UniSignProvider extends EventEmitter {
  isUniSign = true

  private _isConnected = false
  private _isUnlocked = true

  async isConnected () {
    return this._isConnected
  }

  async isUnlocked () {
    return this._isUnlocked
  }

  constructor () {
    super()

    this.init()
  }

  private async init () {
    document.addEventListener('visibilitychange', () => {
      this._requestPromiseCheckVisibility()
    })

    messageBridge.on('background-to-provider', (event) => {
      this._handleBackgroundMessage(event.data.event, event.data.data)
    })

    onDomReady(($) => {
      const origin = window?.location.origin
      const icon = ($('head link[rel~="icon"]') as HTMLLinkElement)?.href || ($('head meta[itemprop="image"]') as HTMLMetaElement)?.content

      const name = document.title || ($('head > meta[name="title"]') as HTMLMetaElement)?.content || origin

      this.request({
        method: 'tabCheckin',
        params: {
          icon, name, origin,
        },
      })
    })

    const { isUnlocked } = await this.request({
      method: 'getProviderState',
    })

    this._isUnlocked = isUnlocked
    this._isConnected = true
  }

  private _requestPromiseCheckVisibility () {

  }

  private _handleBackgroundMessage (event: string, data: any) {
    // eslint-disable-next-line no-console
    console.log(event, data)
  }

  request (data: Partial<JsonRpcPayload>) {
    if (!data) {
      throw ethErrors.rpc.invalidRequest()
    }

    if (!data.params) {
      data.params = []
    }

    return messageBridge.send('provider-to-background', data as JsonRpcPayload, 'background')
  }

  getCurrentKeyType () {
    return this.request({
      method: 'getCurrentKeyType',
    })
  }

  getPermittedKeys () {
    return this.request({
      method: 'getPermittedKeys',
    })
  }

  requestPermissionsOfCurrentKey (params: PermittedKeyObjectType) {
    return this.request({
      method: 'requestPermissionsOfCurrentKey',
      params,
    })
  }

  getCurrentKey () {
    return this.request({
      method: 'getCurrentKey',
    })
  }

  signPlainMessage (params: SignPlainMessageParams) {
    return this.request({
      method: 'signPlainMessage',
      params,
    })
  }

  signStructMessage (params: SignStructMessageParams) {
    return this.request({
      method: 'signPlainMessage',
      params,
    })
  }

  signTransaction (params: SignTransactionParams) {
    return this.request({
      method: 'signTransaction',
      params,
    })
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
