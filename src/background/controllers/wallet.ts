export class WalletController {
  private _isLocked = false

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
}

export const walletController = new WalletController()
