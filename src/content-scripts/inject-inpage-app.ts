import { createApp } from 'vue'
import App from '~/ui/inpage/App.vue'

// todo: only inject test component under development
// if (process.env.NODE_ENV === 'development') {
console.info('[unisign] Hello world from content script')

// mount component to context window
const container = document.createElement('div')
const root = document.createElement('div')

const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container

shadowDOM.appendChild(root)
document.body.appendChild(container)
createApp(App).mount(root)
// }
