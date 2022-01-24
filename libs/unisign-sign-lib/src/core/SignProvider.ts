import { Buffer } from 'buffer'
import { IKeypair, ISignProvider, IStructMessage } from './interface'

export abstract class SignProvider implements ISignProvider {
  protected keypairs: IKeypair[]

  protected constructor ({ keypairs }: { keypairs: IKeypair[] }) {
    this.keypairs = []
    this.setKeypairs({ keypairs })
  }

  abstract setKeypairs ({ keypairs }: { keypairs: IKeypair[] }): void
  abstract signPlainMessage (keypair: IKeypair, message: string): Promise<Buffer>
  abstract signStructMessage (keypair: IKeypair, message: IStructMessage): Promise<Buffer>
  abstract signTransaction (selfDescribedTransaction: string): Promise<string>
}
