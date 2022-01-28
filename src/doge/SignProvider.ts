import { Psbt } from 'bitcoinjs-lib'
import { ECPairFactory } from 'ecpair'
import * as ecc from 'tiny-secp256k1'

import {
  IKeypair,
  ParamError,
  ParamErrorCode,
  util
} from '~/core'
import { BTCSignProvider } from '~/btc'
import { getNetworkConfig } from './util'
import { Keypair } from './Keypair'

const ECPair = ECPairFactory(ecc)

export class SignProvider extends BTCSignProvider {
  readonly name: string = 'DOGE'

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

  async signTransaction (psbtHex: string, returnRawTransaction = false): Promise<string> {
    const networkConfig = getNetworkConfig(this.network)
    const psbtBuf = util.hexToBuffer(psbtHex)
    // CAREFUL Dogecoin has a much higher transaction fee rate than Bitcoin.
    const psbt = Psbt.fromBuffer(psbtBuf, { network: networkConfig, maximumFeeRate: 10000000 })

    // Try to sign the with every keypair.
    for (const keypair of this.keypairs) {
      const ecpair = ECPair.fromPrivateKey(keypair.privateKey)
      try {
        psbt.signAllInputs(ecpair)
      }
      catch (e: any) {
        // Skip the keypairs which can not sign any of the inputs.
        if (!e.toString().includes('No inputs were signed')) {
          throw e
        }
      }
    }

    if (psbt.inputCount <= 0) {
      throw ParamError.fromCode(ParamErrorCode.TransactionHasNoInputs, 'psbtHex')
    }

    for (const i of util.range(psbt.inputCount)) {
      try {
        psbt.finalizeInput(i)
      }
      catch (e: any) {
        if (e.toString().includes('Can not finalize')) {
          throw ParamError.fromCode(ParamErrorCode.TransactionSignFailed, 'psbtHex')
        }
        else {
          throw e
        }
      }
    }

    const buf = returnRawTransaction ? psbt.extractTransaction().toBuffer() : psbt.toBuffer()
    return '0x' + buf.toString('hex')
  }
}
