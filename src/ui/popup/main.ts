import { createApp } from 'vue'
import browser from 'webextension-polyfill'
// @ts-expect-error no type
import vClickOutside from 'click-outside-vue3'
import App from './App.vue'
import router from './routes'
import { installI18n } from './i18n'
import { UIPopupName } from '~/constants'
import '../styles'

const app = createApp(App)

// @ts-expect-error can not figure out why the types do not match
app.use(router)
app.use(vClickOutside)
installI18n(app)

app.mount('#app')

// connect to background, notify it that there is a popup opened
browser.runtime.connect(undefined, { name: UIPopupName })
