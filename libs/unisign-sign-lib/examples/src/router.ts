import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './components/Home.vue'
import BTC from './components/BTC.vue'
import CKB from './components/CKB.vue'
import DOGE from './components/DOGE.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/btc', component: BTC },
  { path: '/ckb', component: CKB },
  { path: '/doge', component: DOGE },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
