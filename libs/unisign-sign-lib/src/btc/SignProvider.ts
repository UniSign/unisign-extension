import { IKeypair } from '~/core'
import { getNetworkConfig } from './util'
import { BTCSignProvider } from './BTCSignProvider'
import { Keypair } from './Keypair'

export class SignProvider extends BTCSignProvider {
  readonly name: string = 'BTC'

  static create ({ keypairs }: { keypairs: IKeypair[] }): SignProvider {
    return new SignProvider({ keypairs })
  }

  getNetworkConfig = getNetworkConfig

  setKeypairs ({ keypairs }: { keypairs: IKeypair[] }): void {
    this.keypairs = keypairs.map(keypair => {
      if (keypair instanceof Keypair) {
        return keypair
      }

      return Keypair.fromBuffer(keypair.privateKey)
    })
  }
}
