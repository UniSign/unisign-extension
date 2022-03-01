import { createApp } from 'vue'
import App from '~/ui/inpage/App.vue'

if (process.env.NODE_ENV === 'development') {
  // mount component to context window
  const container = document.createElement('div')
  const root = document.createElement('div')

  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container

  shadowDOM.appendChild(root)
  document.body.appendChild(container)
  createApp(App).mount(root)
}
