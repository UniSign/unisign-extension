import { AutoBindService } from '~/background/services/base/auto-bind'
import { loadDiskStore } from '~/background/tools/diskStore'
import { LocaleOptions, LOCALES } from '~/constants'

interface SettingsStore {
  locale: LOCALES
  antiPhishingCode: string
}

export class SettingsService extends AutoBindService {
  store!: SettingsStore

  constructor () {
    super()
    this.init().then(() => console.log('SettingsService initialized'))
  }

  async init () {
    this.store = await loadDiskStore('settings', {
      locale: await this.getAcceptLanguage(),
      antiPhishingCode: [1, 1, 1, 1].map(() => String.fromCharCode(65 + Math.random() * 26)).join(''), // generate random 4 bytes uppercase string
    })
  }

  private async getAcceptLanguage (): Promise<LOCALES> {
    const langs = (await browser.i18n.getAcceptLanguages()) as LOCALES[] || []

    const locale = langs.find(lang => LocaleOptions.some(option => option.value === lang))

    return locale || LOCALES.en
  }

  async getLocale (): Promise<LOCALES> {
    return this.store.locale
  }

  async setLocale (locale: LOCALES): Promise<LOCALES> {
    this.store.locale = locale
    return locale
  }

  async getAntiPhishingCode (): Promise<string> {
    return this.store.antiPhishingCode
  }

  async setAntiPhishingCode (code: string): Promise<string> {
    this.store.antiPhishingCode = code
    return code
  }
}

export const settingsService = new SettingsService()

