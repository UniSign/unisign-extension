import { sendMessage } from 'webext-bridge'
import { WalletController } from '~/background/controllers/wallet'

// Here we use Proxy to send every invocation to background through `webext-bridge`,
// and return the Promise which will eventually resolve a data from `walletController`
export const wallet = new Proxy({}, {
  get (target: {}, key: string): any {
    return function (...params: any) {
      return sendMessage('wallet-controller', {
        method: key,
        params,
      })
    }
  },
}) as any as WalletController
