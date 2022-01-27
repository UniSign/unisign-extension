import { createRouter, createWebHashHistory } from 'vue-router'
import LayoutDefault from './layouts/default.vue'
import PageIndex from './pages/index.vue'
import PageSetup from './pages/setup/setup.vue'
import PagePhishingCode from './pages/setup/phishingCode.vue'
import PageHome from './pages/setup/home.vue'
import PageLocked from './pages/setup/locked.vue'
import PageAddAddress from './pages/addAddress/addAddress.vue'
import PageSelectWays from './pages/addAddress/selectWays.vue'
import PageCreateMnemonic from './pages/addAddress/createMnemonic.vue'
import PageChooseTheRightOrder from './pages/addAddress/chooseTheRightOrder.vue'
import PageAddAddressSuccess from './pages/addAddress/addAddressSuccess.vue'
import PageImportPrivateKey from './pages/import/importPrivateKey.vue'
import PageImportMnemonic from './pages/import/importMnemonic.vue'
import PageImportKeystoreFile from './pages/import/importKeystoreFile.vue'
import PageSettings from './pages/settings/settings.vue'
import PageLanguageSettings from './pages/settings/languageSettings.vue'
import PageKeyManagement from './pages/settings/keyManagement.vue'
import PageSecurityAndBackup from './pages/settings/securityAndBackup.vue'
import PageAdvancedReset from './pages/settings/advancedReset.vue'
import PageImportAnotherMnemonic from './pages/settings/importAnotherMnemonic.vue'
import PageRequestPermission from './pages/approval/requestPermission.vue'
import PageSignPlainMessage from './pages/approval/signPlainMessage.vue'
import PageSignStructMessage from './pages/approval/signStructMessage.vue'
import PageSignTransaction from './pages/approval/signTransaction.vue'
import PageDecodeMessage from './pages/approval/decodeMessage.vue'
import PageTest from './pages/test.vue'

const routes = [{
  path: '/',
  name: 'layout-default',
  component: LayoutDefault,
  children: [{
    path: '/',
    component: PageIndex,
  }, {
    path: '/test',
    component: PageTest,
  }, {
    path: '/setup',
    component: PageSetup,
  }, {
    path: '/setup/phishingCode',
    component: PagePhishingCode,
  }, {
    path: '/setup/home',
    component: PageHome,
  }, {
    path: '/setup/locked',
    component: PageLocked,
  }, {
    path: '/addAddress',
    component: PageAddAddress,
  }, {
    path: '/addAddress/selectWays/:key',
    component: PageSelectWays,
  }, {
    path: '/addAddress/createMnemonic',
    component: PageCreateMnemonic,
  }, {
    path: '/addAddress/chooseTheRightOrder',
    component: PageChooseTheRightOrder,
  }, {
    path: '/addAddress/addAddressSuccess',
    component: PageAddAddressSuccess,
  }, {
    path: '/import/importPrivateKey/:key',
    component: PageImportPrivateKey,
  }, {
    path: '/import/importMnemonic',
    component: PageImportMnemonic,
  }, {
    path: '/import/importKeystoreFile/:key',
    component: PageImportKeystoreFile,
  }, {
    path: '/settings',
    component: PageSettings,
  }, {
    path: '/settings/language',
    component: PageLanguageSettings,
  }, {
    path: '/settings/keyManagement',
    component: PageKeyManagement,
  }, {
    path: '/settings/securityAndBackup',
    component: PageSecurityAndBackup,
  }, {
    path: '/settings/advancedReset',
    component: PageAdvancedReset,
  }, {
    path: '/settings/importAnotherMnemonic',
    component: PageImportAnotherMnemonic,
  }, {
    path: '/approval/requestPermission',
    component: PageRequestPermission,
  }, {
    path: '/approval/signPlainMessage',
    component: PageSignPlainMessage,
  }, {
    path: '/approval/signStructMessage',
    component: PageSignStructMessage,
  }, {
    path: '/approval/signTransaction',
    component: PageSignTransaction,
  }, {
    path: '/approval/decodeMessage',
    component: PageDecodeMessage,
  }],
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
