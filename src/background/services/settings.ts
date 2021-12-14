import { loadDiskStore } from '~/background/tools/diskStore'
import { LOCALES } from '~/constants'

interface SettingsStore {
  locale: string
}

export class SettingsService {
  store!: SettingsStore
  constructor () {
    this.init().then(() => console.log('SettingsService initialized'))
  }

  async init () {
    this.store = await loadDiskStore('settings', {
      locale: LOCALES.en,
    })
  }

  async getLocale () {
    return this.store.locale
  }

  async setLocale (locale: string) {
    this.store.locale = locale
  }
}

export const settingsService = new SettingsService()
