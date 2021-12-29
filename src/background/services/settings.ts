import autoBind from 'auto-bind'
import { loadDiskStore } from '~/background/tools/diskStore'
import { LOCALES } from '~/constants'

interface SettingsStore {
  locale: string
  antiPhishingCode: string
}

class AutoBindService {
  constructor () {
    autoBind(this)
  }
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

  private async getAcceptLanguage () {
    const langs = (await browser.i18n.getAcceptLanguages()) || []

    return langs.find(lang => Boolean((LOCALES as any)[lang])) || LOCALES.en
  }

  async getLocale () {
    return this.store.locale
  }

  async setLocale (locale: string) {
    this.store.locale = locale
  }

  async getAntiPhishingCode () {
    return this.store.antiPhishingCode
  }

  async setAntiPhishingCode (code: string) {
    this.store.antiPhishingCode = code
  }
}

export const settingsService = new SettingsService()
//
// console.log(`keys: ${Object.keys(settingsService)}`)
//
// for (const key in settingsService) {
//   console.log(`2222`, key)
// }
