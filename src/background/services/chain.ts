import { loadDiskStore } from '~/background/tools/diskStore'
import { CHAIN_IDENTIFIER, CHAINS } from '~/constants'

interface ChainStore {
  enabledChains: CHAIN_IDENTIFIER[]
}

export interface ChainData {
  name: string // Bitcoin BSC
  identifier: CHAIN_IDENTIFIER // BTC BSC
  tokenSymbol: string // BTC BNB
  tokenLogo: string
  coinType: number // based on slip-44 https://github.com/satoshilabs/slips/blob/master/slip-0044.md
  chainId?: string // based on eip-155, mainly used for Ethereum https://chainlist.org/
  logo: string
}

export class ChainService {
  private supportedChains: ChainData[] = []
  private store!: ChainStore

  constructor () {
    this.init().then(() => console.log('ChainService initialized'))
  }

  async init () {
    const supportedChains = Object.values(CHAIN_IDENTIFIER)

    this.store = await loadDiskStore<ChainStore>('chains', {
      enabledChains: supportedChains,
    })

    this.supportedChains = supportedChains.map(chain => CHAINS[chain])
  }

  getSupportedChains (): ChainData[] {
    return this.supportedChains
  }

  getEnabledChains (): ChainData[] {
    return this.store.enabledChains.map(chainEnum => this.supportedChains.find(chain => chain.identifier === chainEnum)!)
  }

  enableChain (id: CHAIN_IDENTIFIER): void {
    if (!this.store.enabledChains.includes(id)) {
      // todo: this may not be able to invoke the auto save process.
      this.store.enabledChains.push(id)
    }
  }

  disableChain (id: CHAIN_IDENTIFIER) {
    this.store.enabledChains = this.store.enabledChains.filter(chain => chain !== id)
  }
}

export const chainService = new ChainService()
