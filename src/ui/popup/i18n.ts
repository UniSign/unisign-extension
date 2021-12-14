import { App } from 'vue'
import { createI18n } from 'vue-i18n'
// @ts-ignore
import { crc16 } from 'js-crc'
import { LOCALES } from '~/constants'
import { wallet } from '~/ui/controllers/wallet'

declare module 'vue-i18n' {
  interface VueI18n {
    tt: typeof tt
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomOptions {
    $tt: typeof tt
  }
}

const i18n = createI18n({
  fallbackLocale: LOCALES.en,
})

/**
 * this is a function from 'i18n-abc', to generate same key with 'i18n-abc'
 * @param key
 * @return {string}
 */
function makeCrcKey (key: string) {
  return key.length > 8 ? `${key.slice(0, 8)}_${crc16(key).slice(0, 3)}` : key
}

/**
 * our custom i18n method, we should stick to use $tt/tt instead of $t/t.
 * @param key
 * @param params
 */
function tt (key: string, params?: any) {
  key = makeCrcKey(key)

  return i18n.global.t(key, params)
}

export async function setLocale (locale: string) {
  if (!i18n.global.availableLocales.includes(locale)) {
    const messages = await import(`../../locales/${locale}.json`)

    i18n.global.setLocaleMessage(locale, messages.default)
  }

  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  }
  else {
    // @ts-ignore
    i18n.global.locale.value = locale
  }

  wallet.setLocale(locale)

  return locale
}

export function installI18n (app: App) {
  app.use(i18n)

  app.config.globalProperties.$tt = tt

  i18n.global.tt = tt

  wallet.getLocale().then(setLocale).then(locale => console.log(`Locale ${locale} loaded`))
}
