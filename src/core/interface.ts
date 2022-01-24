import { Buffer } from 'buffer'

import { CoinType, Level } from './const'
import { Keypair } from '~/btc'

export interface IKeypair {
  privateKey: Buffer,
  publicKey: Buffer,
}

export interface ILogger {
  debug: (message: any, ...args: any[]) => void,
  error: (message: any, ...args: any[]) => void,
  fatal?: (message: any, ...args: any[]) => void,
  info: (message: any, ...args: any[]) => void,
  setLevel: ({ level }: { level: Level }) => void,
  trace: (message: any, ...args: any[]) => void,
  warn: (message: any, ...args: any[]) => void,
}

export interface IStructMessage {
  chainId?: number,
  coinType?: CoinType,
  content?: any,
  dAppName?: string,
  detail?: string,
  digest?: string,
  signer?: string,
  site?: string,
  subject: string,
  version?: number,
}

/**
 * Sign Provider Interface
 */
export interface ISignProvider {
  /**
   * Set keypairs of the provider
   *
   * @param {IKeypair[]} keypairs
   */
  setKeypairs: ({ keypairs }: { keypairs: IKeypair[] }) => void,

  /**
   * Sign a plain message base on the protocol
   *
   * @param {Keypair} keypair
   * @param {string} message
   * @returns {Promise<Buffer>}
   */
  signPlainMessage: (keypair: Keypair, message: string) => Promise<Buffer>,

  /**
   * Sign a struct message base on the protocol
   *
   * @param {Keypair} keypair
   * @param {IStructMessage} message
   * @returns {Promise<Buffer>}
   */
  signStructMessage: (keypair: Keypair, message: IStructMessage) => Promise<Buffer>,

  /**
   * Sign a self-described transaction structure
   *
   * @param {string} selfDescribedTransaction
   * @returns {Promise<Buffer>}
   */
  signTransaction: (selfDescribedTransaction: string) => Promise<string>,
}
