import './polyfill'
import browser from 'webextension-polyfill'
import { UIPopupName } from '~/constants'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}
browser.runtime.onInstalled.addListener((): void => {
  console.log('Extension installed')
})

// todo: it is weird that the `./polyfill` did not take effect before all other lib, thus Buffer did not injected, so we can only import it dynamically
Promise.all([
  import('~/background/controllers/wallet'),
  import('~/background/controllers/provider'),
]).then(([{ walletController, setupWalletController }, { setupProviderController }]) => {
  browser.runtime.onConnect.addListener((port) => {
    console.log('connected', port)

    if (port.name === UIPopupName) {
      walletController.setIsPopupOpened(true)

      port.onDisconnect.addListener(() => {
        walletController.setIsPopupOpened(false)
      })
    }
  })

  setupWalletController()
  setupProviderController()
})
