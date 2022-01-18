import { createApp } from 'vue'
import browser from 'webextension-polyfill'
import App from './App.vue'
import router from './routes'
import { installI18n } from './i18n'
import { UIPopupName } from '~/constants'
import '../styles'

const app = createApp(App)

app.use(router)
installI18n(app)

app.mount('#app')

// connect to background, notify it that there is a popup opened
browser.runtime.connect(undefined, { name: UIPopupName })
