import { sessionService } from '~/background/services/session'
import { loadDiskStore } from '~/background/tools/diskStore'
import { Unikey, unikeyService } from '~/background/services/unikey'
import { Events } from '~/background/controllers/wallet'

interface PersonalStore {
  currentUnikey?: Unikey | null
  isPopupOpened: boolean
}

export class PersonalService {
  store!: PersonalStore

  constructor () {
    this.init().then(() => console.log('PersonalService initialized'))
  }

  async init () {
    this.store = await loadDiskStore('personal', {
      currentUnikey: null,
      isPopupOpened: false,
    })
  }

  getCurrentUniKey () {
    return this.store.currentUnikey
  }

  setCurrentUnikey (key: string) {
    const unikey = unikeyService.findUnikeyByKey(key)

    if (unikey) {
      this.store.currentUnikey = unikey

      sessionService.broadcast(Events.accountsChanged, [unikey.key])
    }
  }

  resetCurrentUnikey () {
    const [unikey] = unikeyService.getAllVisibleUnikeys()

    this.setCurrentUnikey(unikey.key)
  }

  getIsPopupOpened () {
    return this.store.isPopupOpened
  }

  setIsPopupOpened (isOpened: boolean) {
    this.store.isPopupOpened = isOpened
  }
}

export const personalService = new PersonalService()
