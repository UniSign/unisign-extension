import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './components/Home.vue'
import BTC from './components/BTC.vue'
import CKB from './components/CKB.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/btc', component: BTC },
  { path: '/ckb', component: CKB },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
