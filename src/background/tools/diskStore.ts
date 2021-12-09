import debounce from 'lodash/debounce'
import { storage } from '~/background/tools/storage'

const saveStorage = debounce(storage.set.bind(storage))

function autoSaveWithProxy<T extends object> (name: string, obj: T): T {
  return new Proxy(obj, {
    set (target, key, value) {
      (target as any)[key] = value

      saveStorage(name, target)
      return true
    },

    deleteProperty (target, key) {
      if (key in target) {
        delete (target as any)[key]

        saveStorage(name, target)
      }

      return true
    },
  })
}

/**
 * Create a persistent storage layer using `chrome.storage.local`,
 * any changes made to the data will be auto saved leveraging Proxy
 * @param name
 * @param defaultValue
 */
export async function loadDiskStore<T extends object> (
  name: string,
  defaultValue = Object.create(null),
): Promise<T> {
  const storageCache = await storage.get(name) || await storage.set(name, defaultValue)

  return autoSaveWithProxy<T>(name, storageCache)
}
