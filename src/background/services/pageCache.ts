import { loadDiskStore } from '~/background/tools/diskStore'

interface PageCacheData {
  path: string
  params: Record<string, string>
  states: Record<string, any>
}

interface PageCacheStore {
  cache: PageCacheData | null
}

export class PageCacheService {
  store!: PageCacheStore

  constructor () {
    this.init().then(() => console.log('PageCacheService initialized'))
  }

  async init () {
    this.store = await loadDiskStore<PageCacheStore>('pageCache')
  }

  has () {
    return !!this.store.cache
  }

  get () {
    return this.store.cache
  }

  set (cache: PageCacheData) {
    this.store.cache = cache
  }

  clear () {
    this.store.cache = null
  }
}

export const pageCacheService = new PageCacheService()
