import { settingsService } from '~/background/services/settings'
import { createPopup } from '~/background/tools/popup'
import { messageBridge } from '~/utils/messages'

export class WalletController {
  private _isLocked = false
  private _isConnected = false

  async bootstrap () {

  }

  async isBooted () {

  }

  async lock (): Promise<boolean> {
    return this._isLocked = true
  }

  async unlock (): Promise<boolean> {
    return this._isLocked = false
  }

  async isLocked () {
    return this._isLocked
  }

  async connect () {
    await createPopup({
      route: 'unlock',
    })

    return new Date().toString()
  }

  async disconnect () {
    return this._isConnected = false
  }

  async signPlainMessage () {
    await createPopup({
      route: 'sign-plain-message',
    })

    return new Date().toString()
  }

  async isConnected () {
    return this._isConnected
  }

  getLocale = settingsService.getLocale

  setLocale = settingsService.setLocale
}

export const walletController = new WalletController()

// Here we receive all the method invocation from ui, and redirect them to `walletController`,
// and a Promise resolve the result of controller method invocation will be returned
export function setupWalletController () {
  messageBridge.on('wallet-controller', async (data) => {
    // eslint-disable-next-line no-console
    const method = data.data.method
    const params = data.data.params

    // eslint-disable-next-line no-console
    console.log('background received `wallet-controller`', method, params)

    if (method) {
      return await (walletController as any)[method].apply(walletController, params)
    }
  })
}
