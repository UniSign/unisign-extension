import { createRouter, createWebHashHistory } from 'vue-router'
import LayoutDefault from './layouts/default.vue'
import PageWelcome from './pages/welcome/welcome.vue'
import PageUnlock from './pages/unlock.vue'
import PagePhishingCode from './pages/welcome/phishingCode.vue'
import PageBegin from './pages/welcome/begin.vue'
import PageAddAddress from './pages/addAddress/addAddress.vue'
import PageSelectWays from './pages/addAddress/selectWays.vue'
import PageCreateMnemonic from './pages/addAddress/createMnemonic.vue'
import PageChooseTheRightOrder from './pages/addAddress/chooseTheRightOrder.vue'
import PageAddAddressSuccess from './pages/addAddress/addAddressSuccess.vue'
import PageImportPrivateKey from './pages/import/importPrivateKey.vue'
import PageImportMnemonic from './pages/import/importMnemonic.vue'
import PageImportKeystoreFile from './pages/import/importKeystoreFile.vue'
import PageLocked from './pages/welcome/locked.vue'
import PageSettings from './pages/settings/settings.vue'
import PageLanguageSettings from './pages/settings/languageSettings.vue'
import PageConnect from './pages/connect/connect.vue'
import PageSignPlainMessage from './pages/connect/signPlainMessage.vue'
import PageSignTypedMessage from './pages/connect/signTypedMessage.vue'
import PageSignTransaction from './pages/connect/signTransaction.vue'
import PageDecodeMessage from './pages/connect/decodeMessage.vue'

const routes = [{
  path: '/',
  name: 'layout-default',
  component: LayoutDefault,
  children: [{
    path: '/',
    component: PageWelcome,
  }, {
    path: '/unlock',
    component: PageUnlock,
  }, {
    path: '/phishingCode',
    component: PagePhishingCode,
  }, {
    path: '/begin',
    component: PageBegin,
  }, {
    path: '/addAddress',
    component: PageAddAddress,
  }, {
    path: '/selectWays/:key',
    component: PageSelectWays,
  }, {
    path: '/createMnemonic/:key',
    component: PageCreateMnemonic,
  }, {
    path: '/chooseTheRightOrder/:key',
    component: PageChooseTheRightOrder,
  }, {
    path: '/addAddressSuccess/:key',
    component: PageAddAddressSuccess,
  }, {
    path: '/importPrivateKey/:key',
    component: PageImportPrivateKey,
  }, {
    path: '/importMnemonic/:key',
    component: PageImportMnemonic,
  }, {
    path: '/importKeystoreFile/:key',
    component: PageImportKeystoreFile,
  }, {
    path: '/locked',
    component: PageLocked,
  }, {
    path: '/settings',
    component: PageSettings,
  }, {
    path: '/languageSettings',
    component: PageLanguageSettings,
  }, {
    path: '/connect',
    component: PageConnect,
  }, {
    path: '/signPlainMessage',
    component: PageSignPlainMessage,
  }, {
    path: '/signTypedMessage',
    component: PageSignTypedMessage,
  }, {
    path: '/signTransaction',
    component: PageSignTransaction,
  }, {
    path: '/decodeMessage',
    component: PageDecodeMessage,
  }],
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
