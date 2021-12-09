import browser from 'webextension-polyfill'

const _cache = new Map()

/**
 * A wrapper of chrome.storage.local
 */
export const storage = {
  async get (key: string) {
    if (_cache.has(key)) {
      return _cache.get(key)
    }

    const value = await browser.storage.local.get(key)

    _cache.set(key, value)

    return value
  },

  async set (key: string, value: object): Promise<object> {
    await browser.storage.local.set({
      [key]: value,
    })
    _cache.set(key, value)

    return value
  },

  async clear () {
    await browser.storage.local.clear()
    _cache.clear()
  },
}
