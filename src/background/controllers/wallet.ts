import { approvalService } from '~/background/services/approval'
import { chainService } from '~/background/services/chain'
import { keyringService } from '~/background/services/keyring'
import type { BaseHdKeyringOpts } from '~/background/services/keyring/base/base-hd-keyring'
import type { KeyringBase, KeyringHD } from '~/background/services/keyring/types'
import { KeyringType } from '~/background/services/keyring/types'
import { pageCacheService } from '~/background/services/pageCache'
import { permissionService } from '~/background/services/permission'
import { personalService } from '~/background/services/personal'
import { sessionService } from '~/background/services/session'
import { settingsService } from '~/background/services/settings'
import type { SiteData } from '~/background/services/site'
import { siteService } from '~/background/services/site'
import type { Unikey, UnikeyChainHD } from '~/background/services/unikey'
import { UnikeyType, unikeyService } from '~/background/services/unikey'
import { storage } from '~/background/tools/storage'
import { windows } from '~/background/tools/windows'
import type { UnikeySymbol } from '~/constants'
import { CHAINS } from '~/constants'
import { messageBridge } from '~/utils/messages'

export const Events = {
  lockStatusChanged: 'lockStatusChanged',
  currentKeyChanged: 'currentKeyChanged',
}

export function keyringTypeToKeySymbol (keyringType: KeyringType) {
  for (const keySymbol in CHAINS) {
    const chain = CHAINS[keySymbol as UnikeySymbol]
    if (chain.simpleKeyringType === keyringType || chain.HDKeyringType === keyringType) {
      return chain.unikeySymbol
    }
  }
}

export class WalletController {
  // ----- basic -------
  async setupWallet (password: string) {
    await keyringService.setup(password)
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
    sessionService.broadcast(Events.currentKeyChanged, null)
    sessionService.broadcast(Events.lockStatusChanged, true)
  }

  async unlock (password: string) {
    await keyringService.submitPassword(password)
    sessionService.broadcast(Events.lockStatusChanged, false)
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
  async removeUnikey (password: string, unikey: Unikey) {
    await this.verifyPassword(password)

    unikeyService.deleteUnikey(unikey.key)
    await keyringService.removeAccount(unikey.key)
  }

  // ----- chains -------
  getSupportedChains = chainService.getSupportedChains
  getEnabledChains = chainService.getEnabledChains
  enableChain = chainService.enableChain
  disabledChain = chainService.disableChain

  // ----- permission -------
  clearAllPermission () {
    permissionService.clearAllSitePassports()
    siteService.removeAllSites()
  }

  // ----- settings -------
  getLocale = settingsService.getLocale
  setLocale = settingsService.setLocale
  getAntiPhishingCode = settingsService.getAntiPhishingCode
  setAntiPhishingCode = settingsService.setAntiPhishingCode

  // ----- approval -------
  getApproval = approvalService.getApproval
  resolveApproval = approvalService.resolveApproval
  rejectApproval = approvalService.rejectApproval

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
  addSite = siteService.addSite
  pinSite = siteService.pinSite
  unpinSite = siteService.unpinSite
  getSites = siteService.getSites
  getSitesSorted = siteService.getSitesSorted
  getSitesByUnikeySymbol = siteService.getSitesByUnikeySymbol
  async getCurrentSite () {
    const currentTab = await windows.getCurrentTab()

    if (!(currentTab?.id)) return

    const session = sessionService.get(currentTab.id)
    if (!session) return

    return siteService.getSiteSilently(session.origin)
  }

  updateSiteAndSession (origin: string, data: SiteData) {
    siteService.updateSite(origin, data)
  }

  removeSiteAndSession (origin: string) {
    sessionService.broadcast(Events.currentKeyChanged, null, origin)

    siteService.removeSite(origin)
    permissionService.removeSitePassport(origin)
  }

  // ----- keyring -------
  clearKeyrings = keyringService.clearKeyrings
  generateMnemonic = keyringService.generateMnemonic
  hasMnemonic = keyringService.hasMnemonic

  private _getMnemonic (): string {
    // todo: there may be not BtcHD
    const keyring = keyringService.getKeyringByType(KeyringType.BtcHD) as KeyringHD

    return keyring.mnemonic
  }

  async getMnemonic (password: string) {
    await keyringService.verifyPassword(password)

    return this._getMnemonic()
  }

  /**
   * Import mnemonic and replace previously generated HD accounts
   * @param mnemonic
   */
  async importMnemonic (mnemonic: string) {
    await keyringService.createNewVaultAndRestore(mnemonic)

    const unikeys = await keyringService.getUnikeys()

    await unikeyService.setUnikeys(unikeys)
    // ↓ this line should be the last, otherwise there won't be any keys in unikeyService
    await personalService.setCurrentUnikey(unikeys[0].key)
  }

  async deriveNewAccountFromMnemonic (keySymbol: UnikeySymbol) {
    const chain = CHAINS[keySymbol]
    const keyringType = CHAINS[keySymbol].HDKeyringType
    let keyring = keyringService.getKeyringByType(keyringType)

    if (!keyring) {
      keyring = await keyringService.addNewKeyring(keyringType, {
        mnemonic: this._getMnemonic(),
      } as Pick<BaseHdKeyringOpts, 'mnemonic'>)
    }

    const newAccount = await keyringService.addNewAccount(keyring)

    unikeyService.addUnikey({
      key: newAccount,
      keyType: UnikeyType.blockchain,
      keyringType: keyring.type,
      nickname: '',
      hidden: false,
      keySymbol: chain.unikeySymbol,
    } as UnikeyChainHD, true)

    // this should be at the last
    await this.setCurrentUnikeyFromKeyring(keyring, -1)
  }

  async getPrivateKey (password: string, address: string, keyringType: KeyringType) {
    await keyringService.verifyPassword(password)

    return keyringService.exportAccount(address, keyringType)
  }

  async importPrivateKey (privateKey: string, keyringType: KeyringType) {
    const keyring = await keyringService.importPrivateKey(privateKey, keyringType)
    const [newAccount] = await keyring.getAccounts()
    const keySymbol = keyringTypeToKeySymbol(keyringType)

    unikeyService.addUnikey({
      key: newAccount,
      keyType: UnikeyType.blockchain,
      keyringType: keyring.type,
      nickname: 'Private Key',
      hidden: false,
      keySymbol,
    } as UnikeyChainHD, false)

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

  ;(globalThis as any).walletController = walletController
}
