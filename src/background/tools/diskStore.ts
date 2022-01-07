import { reactive } from 'vue'
import debounce from 'lodash/debounce'
import { storage } from '~/background/tools/storage'

/**
 * Create a persistent storage layer using `chrome.storage.local`,
 * any changes made to the data will be auto saved leveraging Proxy
 * @param name
 * @param defaultValue
 */
export async function loadDiskStore<T extends object> (
  name: string,
  defaultValue: T = Object.create(null),
): Promise<T> {
  const storageCache = await storage.get(name) || await storage.set(name, defaultValue)

  const reactiveValue = reactive(storageCache)

  // Every storage should have a debounced setter, they won't affect each others' debounce logic
  const saveStorage = debounce(storage.set.bind(storage))

  watch(
    () => reactiveValue,
    (state) => {
      // todo: array in proxied value will be saved as indexed object, which seems like a bug. JSON.stringify is just a workaround
      saveStorage(name, JSON.parse(JSON.stringify(state)))
    },
    { deep: true },
  )

  return reactiveValue
}
