import { createRouter, createWebHashHistory } from 'vue-router'
import LayoutDefault from './layouts/default.vue'
import PageWelcome from './pages/PageWelcome.vue'
import PageUnlock from './pages/PageUnlock.vue'

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
  }],
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
