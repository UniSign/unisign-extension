import { createApp } from 'vue'
import { allowWindowMessaging, setNamespace } from 'webext-bridge'
import router from './routes'
import App from './App.vue'
import '../styles'

const app = createApp(App)

app.use(router)

app.mount('#app')

allowWindowMessaging('unisign-popbox')
setNamespace('unisign-popbox')
