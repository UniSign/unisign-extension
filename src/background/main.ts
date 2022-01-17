import './polyfill'
import browser from 'webextension-polyfill'
import { setupWalletController, walletController } from '~/background/controllers/wallet'
import { setupProviderController } from '~/background/controllers/provider'
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
