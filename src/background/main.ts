import { onMessage } from 'webext-bridge'
import { walletController } from '~/background/controllers/wallet'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}
browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

// redirect all the wallet invocation from ui
onMessage('wallet-controller', async (data) => {
  // eslint-disable-next-line no-console
  const method = data.data.method
  const params = data.data.params

  // eslint-disable-next-line no-console
  console.log('background received `wallet-controller`', method, params)

  if (method) {
    return await (walletController as any)[method].apply(walletController, params)
  }
})
