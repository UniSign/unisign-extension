import { AutoBindService } from '~/background/services/base/auto-bind'
import { KeyringType } from '~/background/services/keyring/types'
import { loadDiskStore } from '~/background/tools/diskStore'
import { KeyIdentifier, CHAINS } from '~/constants'

interface ChainStore {
  enabledChains: KeyIdentifier[]
}

export interface ChainData {
  name: string // Bitcoin BSC
  unikeySymbol: KeyIdentifier // BTC BSC
  tokenSymbol: string // BTC BNB
  tokenLogo: string
  coinType: string // based on slip-44 https://github.com/satoshilabs/slips/blob/master/slip-0044.md
  chainId?: string // based on eip-155, mainly used for Ethereum https://chainlist.org/
  logo: string
  HDKeyringType: KeyringType
  simpleKeyringType: KeyringType
}

export class ChainService extends AutoBindService {
  private supportedChains: ChainData[] = []
  private store!: ChainStore

  constructor () {
    super()
    this.init().then(() => console.log('ChainService initialized'))
  }

  async init () {
    const supportedChains = Object.values(KeyIdentifier)

    this.store = await loadDiskStore<ChainStore>('chains', {
      enabledChains: supportedChains,
    })

    this.supportedChains = supportedChains.map(chain => CHAINS[chain])
  }

  async getSupportedChains (): Promise<ChainData[]> {
    return this.supportedChains
  }

  async getEnabledChains (): Promise<ChainData[]> {
    return this.store.enabledChains.map(chainEnum => this.supportedChains.find(chain => chain.unikeySymbol === chainEnum)!)
  }

  async enableChain (id: KeyIdentifier): Promise<void> {
    if (!this.store.enabledChains.includes(id)) {
      this.store.enabledChains.push(id)
    }
  }

  async disableChain (id: KeyIdentifier): Promise<void> {
    this.store.enabledChains = this.store.enabledChains.filter(chain => chain !== id)
  }
}

export const chainService = new ChainService()
