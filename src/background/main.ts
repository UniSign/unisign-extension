import './polyfill'
import { setupWalletController, walletController } from '~/background/controllers/wallet'
import { setupProviderController } from '~/background/controllers/provider'
import { sessionService } from '~/background/services/session'
import { UIPopupName, UITabName } from '~/constants'

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

  if (port.name === UITabName) {
    const sessionId = port?.sender?.tab?.id

    if (sessionId) {
      sessionService.getOrCreate(sessionId)
    }
  }
})

setupWalletController()
setupProviderController()
