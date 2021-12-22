import { approvalService } from '~/background/services/approval'
import { chainService } from '~/background/services/chain'
// import { keyringService } from '~/background/services/keyring'
import { pageCacheService } from '~/background/services/pageCache'
import { personalService } from '~/background/services/personal'
import { sessionService } from '~/background/services/session'
import { settingsService } from '~/background/services/settings'
import { SiteData, siteService } from '~/background/services/site'
import { unikeyService } from '~/background/services/unikey'
import { windows } from '~/background/tools/windows'
import { messageBridge } from '~/utils/messages'

// todo: the payload of all events needs to be carefully considered
export const Events = {
  unlock: 'unlock',
  lock: 'lock',
  accountsChanged: 'accountsChanged',
  chainChanged: 'chainChanged',
}

export class WalletController {
  async bootstrap () {
  }

  async isBootstrapped () {
  }

  async lock () {
    // await keyringService.setLocked()
    sessionService.broadcast(Events.accountsChanged, [])
    sessionService.broadcast(Events.lock)
  }

  async unlock (password: string) {
    // await keyringService.submitPassword(password)
    sessionService.broadcast(Events.unlock)
  }

  // isLocked = keyringService.isLocked
  isLocked = () => false

  // ----- personal -------
  getIsPopupOpened = personalService.getIsPopupOpened
  setIsPopupOpened = personalService.setIsPopupOpened
  resetCurrentUnikey = personalService.resetCurrentUnikey
  setCurrentUnikey = personalService.setCurrentUnikey

  // ----- keyring -------
  getAllVisibleUnikeys = unikeyService.getAllVisibleUnikeys
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

  // ----- approval -------
  getApproval = approvalService.getApproval
  resolveApproval = approvalService.resolveApproval
  rejectApproval = approvalService.rejectApproval

  // ----- pageCache -------
  hasPageCache = pageCacheService.has
  setPageCache = pageCacheService.set
  clearPageCache = pageCacheService.clear
  getPageCache () {
    if (this.isLocked()) return null
    return pageCacheService.get()
  }

  // sites
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
  // ----- todo -------
  // ----- keyring -------
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
