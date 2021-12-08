import { createRouter, createWebHashHistory } from 'vue-router'
import LayoutDefault from './layouts/default.vue'
import PageConnect from './pages/PageConnect.vue'
import PageSignPlainMessage from './pages/PageSignPlainMessage.vue'

const routes = [{
  path: '/',
  name: 'layout-default',
  component: LayoutDefault,
  children: [{
    path: '/connect',
    component: PageConnect,
  }, {
    path: '/sign-plain-message',
    component: PageSignPlainMessage,
  }],
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
