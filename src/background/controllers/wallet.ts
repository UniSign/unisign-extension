import { approvalService } from '~/background/services/approval'
import { chainService } from '~/background/services/chain'
import { keyringService } from '~/background/services/keyring'
import { KeyringBase, KeyringHD, KeyringType } from '~/background/services/keyring/types'
import { pageCacheService } from '~/background/services/pageCache'
import { personalService } from '~/background/services/personal'
import { sessionService } from '~/background/services/session'
import { settingsService } from '~/background/services/settings'
import { SiteData, siteService } from '~/background/services/site'
import { UnikeyChainMnemonic, unikeyService, UnikeyType } from '~/background/services/unikey'
import { storage } from '~/background/tools/storage'
import { windows } from '~/background/tools/windows'
import { ChainIdentifier, CHAINS } from '~/constants'
import { messageBridge } from '~/utils/messages'

// todo: the payload of all events needs to be carefully considered
export const Events = {
  unlock: 'unlock',
  lock: 'lock',
  accountsChanged: 'accountsChanged',
  chainChanged: 'chainChanged',
}

export class WalletController {
  // ----- basic -------
  async setupWallet (password: string) {
    await keyringService.setup(password)

    const unikeys = await keyringService.getUnikeys()

    await personalService.setCurrentUnikey(unikeys[0].key)
    await unikeyService.setUnikeys(unikeys)
  }

  isSetup = keyringService.isSetup
  async reset () {
    await storage.clear()
    window.location.reload()
  }

  verifyPassword = keyringService.verifyPassword

  isLocked = keyringService.isLocked
  async lock () {
    await keyringService.setLocked()
    sessionService.broadcast(Events.accountsChanged, [])
    sessionService.broadcast(Events.lock)
  }

  async unlock (password: string) {
    await keyringService.submitPassword(password)
    sessionService.broadcast(Events.unlock)
  }

  // ----- personal -------
  getIsPopupOpened = personalService.getIsPopupOpened
  setIsPopupOpened = personalService.setIsPopupOpened

  getCurrentUnikey = personalService.getCurrentUnikey
  setCurrentUnikey = personalService.setCurrentUnikey

  /**
   * set current unikey from specific keyring
   * @param keyring
   * @param {number} index can be negative, indicating index from backwards
   * @private
   */
  private async setCurrentUnikeyFromKeyring (keyring: KeyringBase, index = 0) {
    const accounts = await keyring.getAccounts()
    const account = accounts[index < 0 ? index + accounts.length : index]

    if (!account) {
      throw new Error(`the ${index} account of ${keyring.type} does not exists`)
    }

    personalService.setCurrentUnikey(account)
  }

  // ----- unikey -------
  getUnikeys = unikeyService.getUnikeys
  getVisibleUnikeys = unikeyService.getVisibleUnikeys
  showUnikey = unikeyService.showUnikey
  hideUnikey = unikeyService.hideUnikey

  // ----- chains -------
  getSupportedChains = chainService.getSupportedChains
  getEnabledChains = chainService.getEnabledChains
  enableChain = chainService.enableChain
  disabledChain = chainService.disableChain

  // ----- settings -------
  getLocale = settingsService.getLocale
  setLocale = settingsService.setLocale
  getAntiPhishingCode = settingsService.getAntiPhishingCode
  setAntiPhishingCode = settingsService.setAntiPhishingCode

  // ----- approval -------
  getApproval = approvalService.getApproval
  resolveApproval = approvalService.resolveApproval
  rejectApproval = approvalService.rejectApproval
  // todo: this is only for showcase the usage of approval, and should not be used in production
  _mockRequestApproval = process.env.NODE_ENV === 'development' ? approvalService.requestApproval : undefined

  // ----- pageCache -------
  hasPageCache = pageCacheService.has
  setPageCache = pageCacheService.set
  clearPageCache = pageCacheService.clear
  async getPageCache () {
    if (await keyringService.isLocked()) return null
    return pageCacheService.get()
  }

  // ----- sites -------
  getSite = siteService.getSite
  pinSite = siteService.pinSite
  unpinSite = siteService.unpinSite
  getSites = siteService.getSites
  getSitesSorted = siteService.getSitesSorted
  getSitesByChain = siteService.getSitesByChainId
  async getCurrentSite () {
    const { id: tabId } = await windows.getCurrentTab()
    if (!tabId) return

    const session = sessionService.get(tabId)
    if (!session) return

    return siteService.getSiteSilently(session.origin)
  }

  updateSiteAndSession (origin: string, data: SiteData) {
    siteService.updateSite(origin, data)
    // todo: determine the payload of chainChanged event
    sessionService.broadcast(Events.chainChanged, {
      // chain: '',
      // networkVersion: '',
    }, data.origin)
  }

  removeSiteAndSession (origin: string) {
    sessionService.broadcast(Events.accountsChanged, [], origin)
    siteService.removeSite(origin)
  }

  // ----- keyring -------
  clearKeyrings = keyringService.clearKeyrings
  generateMnemonic = keyringService.generateMnemonic

  private _getMnemonic (): string {
    const keyring = keyringService.getKeyringByType(KeyringType.BtcHD) as KeyringHD

    return keyring.mnemonic
  }

  async getMnemonic (password: string) {
    await keyringService.verifyPassword(password)

    return this._getMnemonic()
  }

  hasMnemonic (): boolean {
    return Boolean(this._getMnemonic())
  }

  /**
   * Import mnemonic and replace previously generated HD accounts
   * @param mnemonic
   */
  async importMnemonic (mnemonic: string) {
    await keyringService.createNewVaultAndRestore(mnemonic)

    const unikeys = await keyringService.getUnikeys()

    await personalService.setCurrentUnikey(unikeys[0].key)
    await unikeyService.setUnikeys(unikeys)
  }

  async deriveNewAccountFromMnemonic (identifier: ChainIdentifier) {
    const type = CHAINS[identifier].HDKeyringType
    const keyring = keyringService.getKeyringByType(type)

    const newAccount = await keyringService.addNewAccount(keyring)

    unikeyService.addUnikey({
      key: newAccount,
      keyType: UnikeyType.blockchain,
      keyringType: keyring.type,
      nickname: '',
      hidden: false,
      chainId: ChainIdentifier.BTC,
    } as UnikeyChainMnemonic, true)

    // this should be at the last
    await this.setCurrentUnikeyFromKeyring(keyring, -1)
  }

  async getPrivateKey (password: string, address: string, keyringType: KeyringType) {
    await keyringService.verifyPassword(password)

    return keyringService.exportAccount(address, keyringType)
  }

  async importPrivateKey (privateKey: string, type: KeyringType) {
    const keyring = await keyringService.importPrivateKey(privateKey, type)
    const [newAccount] = await keyring.getAccounts()

    unikeyService.addUnikey({
      key: newAccount,
      keyType: UnikeyType.blockchain,
      keyringType: keyring.type,
      nickname: 'Private Key',
      hidden: false,
      chainId: ChainIdentifier.BTC,
    } as UnikeyChainMnemonic, false)

    await this.setCurrentUnikeyFromKeyring(keyring, -1)
  }

  // ----- keyring -------
}

export const walletController = new WalletController()

// Here we receive all the method invocation from ui, and redirect them to `walletController`,
// and a Promise resolve the result of controller method invocation will be returned
export function setupWalletController () {
  messageBridge.on('wallet-controller', async (data) => {
    const method = data.data.method
    const params = data.data.params

    console.log('background received `wallet-controller`', method, params)

    if (method) {
      return await (walletController as any)[method].apply(walletController, params)
    }
  })

  ;(window as any).walletController = walletController
}
