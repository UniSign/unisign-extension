import { loadDiskStore } from '~/background/tools/diskStore'

type Wildcard = '*'

export enum Permissions {
  all = '*',
  getCurrentKey = 'getCurrentKey',
  signPlainMessage = 'signPlainMessage',
  signStructMessage = 'signStructMessage',
  signTransaction = 'signTransaction',
}

export const WildcardConsent = {
  key: '*',
  permissions: ['*'],
}

interface KeyConsent {
  key: string | Wildcard
  permissions: Permissions[]
}

interface SitePassport {
  origin: string
  consents: KeyConsent[]
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

  addSitePassport (origin: string, keyConsent: KeyConsent) {
    const sitePassport = this.getSitePassport(origin)

    if (sitePassport) {
      const existConsent = sitePassport.consents.find(consent => consent.key === keyConsent.key)

      if (existConsent) {
        const unPermittedPermissions = keyConsent.permissions.filter(perm => !existConsent.permissions.includes(perm))

        if (unPermittedPermissions.length) {
          existConsent.permissions = existConsent.permissions.concat(unPermittedPermissions)
        }
      }
      else {
        sitePassport.consents.push(keyConsent)
      }
    }
    else {
      this.store.sites.push({
        origin,
        consents: [keyConsent],
      })
    }
  }

  getSitePassport (origin: string) {
    return this.store.sites.find(site => site.origin === origin)
  }

  removeSitePassport (origin: string) {
    const index = this.store.sites.findIndex(site => site.origin === origin)

    this.store.sites.splice(index, 1)
  }

  updateSitePassport (origin: string, passportDto: SitePassport) {
    const passport = this.store.sites.find(site => site.origin === origin)

    Object.assign(passport, passportDto)
  }

  clearAllSitePassports () {
    this.store.sites = []
  }

  hasPermission (origin: string, key: string, permission: Permissions): boolean {
    const site = this.getSitePassport(origin)

    if (site) {
      const consent = site.consents.find(auth => auth.key === key)

      if (consent) {
        return consent.permissions.includes(permission)
      }
    }

    return false
  }
}

export const permissionService = new PermissionService()
