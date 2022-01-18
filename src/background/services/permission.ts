import { loadDiskStore } from '~/background/tools/diskStore'

type Wildcard = '*'

export enum Permissions {
  all = '*',
}

export const WildcardConsent = {
  key: '*',
  permissions: ['*'],
}

interface Consent {
  key: string | Wildcard
  permissions: Permissions[]
}

interface SitePassport {
  origin: string
  authorities: Consent[]
}

interface PermissionStore {
  sites: SitePassport[]
}

export class PermissionService {
  store!: PermissionStore

  constructor () {
    this.init().then(() => console.log('PermissionService initialized'))
  }

  async init () {
    this.store = await loadDiskStore<PermissionStore>('permission', {
      sites: [],
    })
  }

  addPassport (passport: SitePassport) {
    this.store.sites.push(passport)
  }

  getPassport (origin: string) {
    return this.store.sites.find(site => site.origin === origin)
  }

  removePassport (origin: string) {
    const index = this.store.sites.findIndex(site => site.origin === origin)

    this.store.sites.splice(index, 1)
  }

  updatePassport (origin: string, passportDto: SitePassport) {
    const passport = this.store.sites.find(site => site.origin === origin)

    Object.assign(passport, passportDto)
  }

  clearAllPassports () {
    this.store.sites = []
  }
}

export const permissionService = new PermissionService()
