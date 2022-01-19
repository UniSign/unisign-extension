import LRU from 'lru-cache'
import { loadDiskStore } from '~/background/tools/diskStore'
import { KeyIdentifier, UNISIGN_ORIGIN } from '~/constants'

export interface SiteData {
  origin: string
  name: string
  icon: string

  unikeySymbol: KeyIdentifier

  isPinned: boolean
  hasSigned: boolean
}

interface SiteStore {
  lruDumped: ReadonlyArray<LRU.Entry<string, SiteData>>
}

/**
 * Used to manage every connected site, identified by origin
 */
export class SiteService {
  private lrcCache = new LRU<string, SiteData>()
  private store!: SiteStore

  constructor () {
    this.init().then(() => console.log('SiteService initialized'))
  }

  async init () {
    this.store = await loadDiskStore<SiteStore>('site', {
      lruDumped: [],
    })

    const cache = this.store.lruDumped.map(item => ({
      k: item.k,
      v: item.v,
      e: 0,
    }))

    this.lrcCache.load(cache)
  }

  /**
   * sync storage back to persistent storage
   */
  private sync () {
    this.store.lruDumped = this.lrcCache.dump()
  }

  isInternalOrigin (origin: string) {
    return origin === UNISIGN_ORIGIN
  }

  hasBeenConnected (origin: string): boolean {
    if (this.isInternalOrigin(origin)) return true

    return this.lrcCache.has(origin)
  }

  addSite (site: Pick<SiteData, 'name'|'icon'|'origin'|'unikeySymbol'>) {
    this.lrcCache.set(origin, {
      ...site,
      isPinned: false,
      hasSigned: false,
    })

    this.sync()
  }

  getSite (origin: string) {
    return this.lrcCache.get(origin)
  }

  /**
   * get a site without updating the sequence
   * @param origin
   */
  getSiteSilently (origin: string) {
    return this.lrcCache.peek(origin)
  }

  /**
   * visit the site data in lrc cache to promote the site
   */
  touchSite (origin: string) {
    if (this.isInternalOrigin(origin)) return

    this.lrcCache.get(origin)

    this.sync()
  }

  updateSite (origin: string, value: Partial<SiteData>) {
    if (!this.lrcCache.has(origin)) return
    if (this.isInternalOrigin(origin)) return

    const originValue = this.lrcCache.get(origin)
    this.lrcCache.set(origin, Object.assign(originValue, value))

    this.sync()
  }

  /**
   * move site to the top
   * @param origin
   */
  pinSite (origin: string) {
    const site = this.getSite(origin)
    if (!site) return
    this.updateSite(origin, {
      ...site,
      isPinned: true,
    })
  }

  unpinSite (origin: string) {
    const site = this.getSite(origin)
    if (!site) return
    this.updateSite(origin, {
      ...site,
      isPinned: false,
    })
  }

  removeSite (origin: string) {
    this.lrcCache.del(origin)

    this.sync()
  }

  removeAllSites () {
    this.lrcCache.reset()
    this.sync()
  }

  getSites () {
    return this.lrcCache.values()
  }

  getSitesSorted () {
    const weight = (site: SiteData) => Number(site.isPinned) * 10 + Number(site.hasSigned)
    return this.lrcCache.values().sort((a, b) => weight(a) - weight(b))
  }

  getSitesByUnikeySymbol (unikeySymbol: string) {
    return this.lrcCache.values().filter(site => site.unikeySymbol === unikeySymbol)
  }
}

export const siteService = new SiteService()
