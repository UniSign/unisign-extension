import { createRouter, createWebHashHistory } from 'vue-router'
import LayoutDefault from './layouts/default.vue'
import PageWelcome from './pages/welcome/welcome.vue'
import PageUnlock from './pages/unlock.vue'
import PagePhishingCode from './pages/welcome/phishingCode.vue'
import PageBegin from './pages/welcome/begin.vue'

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
  }],
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
