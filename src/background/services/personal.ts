import { composeKeyObjectFromUnikey } from '~/background/controllers/provider/index'
import { Events } from '~/background/controllers/wallet'
import { AutoBindService } from '~/background/services/base/auto-bind'
import { sessionService } from '~/background/services/session'
import { Unikey, unikeyService } from '~/background/services/unikey'
import { loadDiskStore } from '~/background/tools/diskStore'

interface PersonalStore {
  currentUnikey: Unikey | null
}

export class PersonalService extends AutoBindService {
  store!: PersonalStore

  isPopupOpened = false

  constructor () {
    super()
    this.init().then(() => console.log('PersonalService initialized'))
  }

  async init () {
    this.store = await loadDiskStore<PersonalStore>('personal', {
      currentUnikey: null,
    })
  }

  getCurrentUnikey () {
    return this.store.currentUnikey
  }

  setCurrentUnikey (key: string) {
    const unikey = unikeyService.findUnikeyByKey(key)

    if (unikey) {
      this.store.currentUnikey = unikey

      // todo: maybe we should broadcast different things(with/without key/permissions) to different origin
      const currentKeyObject = composeKeyObjectFromUnikey(unikey)

      sessionService.broadcast(Events.currentKeyChanged, currentKeyObject)
    }
  }

  async resetCurrentUnikey () {
    const [unikey] = await unikeyService.getVisibleUnikeys()

    this.setCurrentUnikey(unikey.key)
  }

  getIsPopupOpened () {
    return this.isPopupOpened
  }

  setIsPopupOpened (isOpened: boolean) {
    this.isPopupOpened = isOpened
  }
}

export const personalService = new PersonalService()
