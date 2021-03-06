<style lang="scss">
.page-test {
  background-color: #fff;

  fieldset {
    margin: 5px;
    padding: 5px;
    border-width: 2px;

    legend {
      font-size: 14px;
    }
  }

  select {
    border-width: unset;
  }

  input {
    border-width: unset;
  }

  button {
    margin: 2px 4px;
    padding: 0 4px;
    border-width: unset;
    border-radius: 4px;
    background-color: #e5e5e5;
  }
}
</style>

<template>
  <div class="page-test">
    <fieldset>
      <router-link to="/">
        Home
      </router-link>
    </fieldset>

    <fieldset>
      <legend>Locale</legend>

      Current: {{ locale }}
      <select :value="locale" @change="onChangeLocale">
        <option v-for="lang in LocaleOptions" :key="lang.value" :value="lang.value">
          {{ lang.text }}
        </option>
      </select>
    </fieldset>

    <fieldset>
      <legend>Anti Phishing Code</legend>

      <input type="text" :value="antiPhishingCode" @change="onChangeAntiPhishingCode">
    </fieldset>

    <fieldset>
      <legend>Setup</legend>

      <button @click="onClickReset">
        reset
      </button>
      isSetup: {{ isSetup }}
      <br>

      <button @click="onClickSetup">
        set password
      </button>
      <label>
        <input v-model="passwordForSetup">
        password
      </label>

      <div>
        <button @click="onClickGenerateMnemonic">
          generate mnemonic
        </button>: {{ mnemonic }}

        <br>
        <button @click="onClickImportMnemonic">
          import mnemonic
        </button>
      </div>
    </fieldset>

    <fieldset>
      <legend>Lock</legend>

      isLocked: {{ isLocked }}
      <br>
      <button @click="onClickLock">
        Lock
      </button>
      <br>
      <button @click="onClickUnlock">
        Unlock
      </button>
      <label>
        <input v-model="passwordForUnlock">
        password
      </label>
    </fieldset>

    <fieldset>
      <legend>Sites</legend>

      <b>Sites</b>
      <ul>
        <li v-for="site in sites" :key="site.origin" style="display: flex">
          <img :src="site.icon" alt="">

          <div>
            <div>
              <b>{{ site.name.slice(0, 10) }}</b>
            </div>
            <div>
              <code>{{ site.origin }}</code>
            </div>
          </div>

          <div>
            <button v-if="site.isPinned" @click="onClickUnpinSite(site.origin)">
              ↓
            </button>
            <button v-if="!site.isPinned" @click="onClickPinSite(site.origin)">
              ↑
            </button>
            <button @click="onClickRemoveSite(site.origin)">
              ×
            </button>
          </div>
        </li>
      </ul>
      <b>CurrentSite</b>
      <pre>
          {{ currentSite }}
        </pre>
    </fieldset>

    <fieldset>
      <legend>Chains</legend>

      <b>enabledChains:</b>
      <ul>
        <li v-for="chain in enabledChains" :key="chain.unikeySymbol">
          {{ chain.name }} {{ chain.unikeySymbol }}
        </li>
      </ul>

      <hr>
      <b>supportedChains:</b>
      <ul>
        <li v-for="chain in supportedChains" :key="chain.unikeySymbol">
          {{ chain.name }} {{ chain.unikeySymbol }}
          <button @click="onClickEnableChain(chain.unikeySymbol)">
            ✅
          </button>
          <button @click="onClickDisableChain(chain.unikeySymbol)">
            ❌
          </button>
          <button @click="onClickDeriveAddress(chain.unikeySymbol)">
            Derive
          </button>
        </li>
      </ul>
    </fieldset>

    <fieldset>
      <legend>Personal</legend>

      currentUnikey: {{ currentUnikey?.key }}
    </fieldset>

    <fieldset>
      <legend>Unikey</legend>

      <b>visibleUnikeys</b>
      <ul>
        <li v-for="unikey in visibleUnikeys" :key="unikey.key">
          {{ unikey.key }}
        </li>
      </ul>

      <b>
        unikeys
        <button @click="onClickGetUnikeys">Get</button>
      </b>
      <ul>
        <li v-for="unikey in unikeys" :key="unikey.key">
          <button @click="onClickShowUnikey(unikey)">
            ✅
          </button>
          <button @click="onClickHideUnikey(unikey)">
            ❎
          </button>
          <button @click="onClickRemoveUnikey(unikey)">
            ❌
          </button>
          <button @click="onClickSetCurrentUnikey(unikey)">
            👁
          </button>
          <button @click="onClickExportPrivateKey(unikey)">
            🗝
          </button>
          {{ unikey.key.slice(0,20) }}...
        </li>
      </ul>
    </fieldset>

    <fieldset>
      <legend>Keyring</legend>
      <label>
        BTC PrivateKey
        <input v-model="importedPrivateKey" type="text">
      </label>
      <button @click="onClickImportKey">
        Import
      </button>
      <hr>
      <button @click="onClickShowMnemonic">
        Show Mnemonic
      </button>
      {{ importedMnemonic }}
    </fieldset>

    <fieldset>
      <legend>Approval</legend>

      <button @click="onClickRequestApproval">
        Request
      </button>
      <button @click="onClickGetApproval">
        Get
      </button>
      <button @click="onClickResolveApproval">
        Resolve
      </button>
      <button @click="onClickRejectApproval">
        Reject
      </button>
      <br>
      <b>approval</b>
      <code>
        {{ approval }}
      </code>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { ApprovalPage } from '~/background/services/approval'
import type { ChainData } from '~/background/services/chain'
import type { SiteData } from '~/background/services/site'
import type { Unikey } from '~/background/services/unikey'
import { CHAINS, UnikeySymbol, LOCALES, LocaleOptions } from '~/constants'
import { wallet } from '~/ui/controllers/wallet'
import { sleep } from '~/utils'

export default {
  name: 'PageTest',
  components: {},
  setup () {
    // locale
    const locale = ref('')
    async function onChangeLocale (e: InputEvent) {
      const value = e.target.value as LOCALES
      locale.value = await wallet.setLocale(value)
    }
    onMounted(async () => {
      locale.value = await wallet.getLocale()
    })

    // AntiPhishingCode
    const antiPhishingCode = ref('')
    async function onChangeAntiPhishingCode (e: InputEvent) {
      antiPhishingCode.value = await wallet.setAntiPhishingCode(e.target.value)
    }
    onMounted(async () => {
      antiPhishingCode.value = await wallet.getAntiPhishingCode()
    })

    // setup
    const isSetup = ref(false)
    const passwordForSetup = ref('11111111')
    const mnemonic = ref('')
    async function onClickGenerateMnemonic () {
      mnemonic.value = await wallet.generateMnemonic()
    }
    async function onClickImportMnemonic () {
      await wallet.importMnemonic(mnemonic.value)
      await onUnikeysChanged()
      isSetup.value = await wallet.isSetup()
    }
    async function onClickSetup () {
      await wallet.setupWallet(passwordForSetup.value)
    }
    async function onClickReset () {
      await wallet.reset()
      await sleep(1000) // wait for background fully reloaded
      window.location.reload()
    }
    onMounted(async () => {
      isSetup.value = await wallet.isSetup()
    })

    // lock
    const isLocked = ref(false)
    const passwordForUnlock = ref('11111111')
    const hasMnemonic = ref(false)
    async function onClickLock () {
      await wallet.lock()
      isLocked.value = await wallet.isLocked()
    }
    async function onClickUnlock () {
      await wallet.unlock(passwordForUnlock.value)
      isLocked.value = await wallet.isLocked()
      hasMnemonic.value = await wallet.hasMnemonic()
    }
    onMounted(async () => {
      isLocked.value = await wallet.isLocked()
    })

    // Sites
    const sites = ref<SiteData[]>([])
    const currentSite = ref<SiteData>()
    async function onClickPinSite (origin: string) {
      await wallet.pinSite(origin)
      await onSitesDataChanged()
    }
    async function onClickUnpinSite (origin: string) {
      await wallet.unpinSite(origin)
      await onSitesDataChanged()
    }
    async function onClickRemoveSite (origin: string) {
      await wallet.removeSiteAndSession(origin)
      await onSitesDataChanged()
    }
    async function onSitesDataChanged () {
      sites.value = await wallet.getSitesSorted()
      currentSite.value = await wallet.getCurrentSite()
    }
    onMounted(onSitesDataChanged)

    // Chains
    const supportedChains = ref<ChainData[]>([])
    const enabledChains = ref<ChainData[]>([])
    async function onClickEnableChain (keySymbol: UnikeySymbol) {
      await wallet.enableChain(keySymbol)
      enabledChains.value = await wallet.getEnabledChains()
    }
    async function onClickDisableChain (keySymbol: UnikeySymbol) {
      await wallet.disabledChain(keySymbol)
      enabledChains.value = await wallet.getEnabledChains()
    }
    onMounted(async () => {
      supportedChains.value = await wallet.getSupportedChains()
      enabledChains.value = await wallet.getEnabledChains()
    })

    // unikey/addresses
    const unikeys = ref<Unikey[]>([])
    const visibleUnikeys = ref<Unikey[]>([])
    const currentUnikey = ref<Unikey| null>(null)
    async function onClickGetUnikeys () {
      unikeys.value = await wallet.getUnikeys()
    }
    async function onClickShowUnikey (unikey: Unikey) {
      await wallet.showUnikey(unikey.key)
      visibleUnikeys.value = await wallet.getVisibleUnikeys()
    }
    async function onClickHideUnikey (unikey: Unikey) {
      await wallet.hideUnikey(unikey.key)
      visibleUnikeys.value = await wallet.getVisibleUnikeys()
      currentUnikey.value = await wallet.getCurrentUnikey()
    }
    async function onClickRemoveUnikey (unikey: Unikey) {
      await wallet.removeUnikey(passwordForUnlock.value, unikey)
      await onUnikeysChanged()
    }
    async function onClickSetCurrentUnikey (unikey: Unikey) {
      await wallet.setCurrentUnikey(unikey.key)
      currentUnikey.value = await wallet.getCurrentUnikey()
    }
    async function onUnikeysChanged () {
      unikeys.value = await wallet.getUnikeys()
      visibleUnikeys.value = await wallet.getVisibleUnikeys()
      currentUnikey.value = await wallet.getCurrentUnikey()
    }
    async function onClickExportPrivateKey (unikey: Unikey) {
      // eslint-disable-next-line no-alert
      window.alert(await wallet.getPrivateKey(passwordForUnlock.value, unikey.key, unikey.keyringType))
    }
    onMounted(onUnikeysChanged)

    // keyring
    const importedPrivateKey = ref('')
    const importedMnemonic = ref('')
    const chain = ref<UnikeySymbol>(UnikeySymbol.BTC)
    async function onClickDeriveAddress (keySymbol: UnikeySymbol) {
      await wallet.deriveNewAccountFromMnemonic(keySymbol)

      await onUnikeysChanged()
    }
    async function onClickImportKey () {
      await wallet.importPrivateKey(importedPrivateKey.value, CHAINS[chain.value].simpleKeyringType)
      await onUnikeysChanged()
    }
    async function onClickShowMnemonic () {
      importedMnemonic.value = await wallet.getMnemonic(passwordForUnlock.value)
    }

    // Approval
    const approval = ref(null)
    async function onClickRequestApproval () {
      const mockApproval = {
        name: 'mockApproval',
        time: new Date().toString(),
      }

      await wallet._mockRequestApproval!({
        params: mockApproval,
        origin: 'unisign.org',
        approvalPage: ApprovalPage.requestPermission,
      })
    }
    async function onClickGetApproval () {
      approval.value = (await wallet.getApproval())?.params
    }
    async function onClickResolveApproval () {
      await wallet.resolveApproval({ success: true })
    }
    async function onClickRejectApproval () {
      await wallet.rejectApproval('rejected by user')
    }

    return {
      // locale
      locale,
      LOCALES,
      LocaleOptions,
      onChangeLocale,

      // antiPhishingCode
      antiPhishingCode,
      onChangeAntiPhishingCode,

      // Setup
      isSetup,
      mnemonic,
      passwordForSetup,
      onClickGenerateMnemonic,
      onClickImportMnemonic,
      onClickSetup,
      onClickReset,

      // Lock
      isLocked,
      passwordForUnlock,
      onClickLock,
      onClickUnlock,

      // Chains
      supportedChains,
      enabledChains,
      onClickEnableChain,
      onClickDisableChain,

      // Sites
      sites,
      currentSite,
      onClickPinSite,
      onClickUnpinSite,
      onClickRemoveSite,

      // unikey
      unikeys,
      visibleUnikeys,
      currentUnikey,
      onClickGetUnikeys,
      onClickShowUnikey,
      onClickHideUnikey,
      onClickRemoveUnikey,
      onClickSetCurrentUnikey,
      onClickExportPrivateKey,

      // keyring
      importedPrivateKey,
      importedMnemonic,
      onClickDeriveAddress,
      onClickImportKey,
      onClickShowMnemonic,

      // Approval
      approval,
      onClickRequestApproval,
      onClickGetApproval,
      onClickResolveApproval,
      onClickRejectApproval,
    }
  },
}
</script>
