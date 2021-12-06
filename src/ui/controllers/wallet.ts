import { sendMessage } from 'webext-bridge'
import { WalletController } from '~/background/controllers/wallet'

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
