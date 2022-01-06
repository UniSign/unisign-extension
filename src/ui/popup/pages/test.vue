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

      <div>
        <button @click="onClickGenerateMnemonic">
          generate mnemonic
        </button>: {{ mnemonic }}

        <br>
        <button @click="onClickImportMnemonic">
          import mnemonic
        </button>
      </div>

      <button @click="onClickReset">
        reset
      </button>
      isSetup: {{ isSetup }}
      <br>

      <button @click="onClickSetup">
        setup
      </button>
      <label>
        <input v-model="passwordForSetup">
        password
      </label>
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
      <legend>Chains</legend>

      <b>enabledChains:</b>
      <ul>
        <li v-for="chain in enabledChains" :key="chain.identifier">
          {{ chain.name }} {{ chain.identifier }}
        </li>
      </ul>

      <hr>
      <b>supportedChains:</b>
      <ul>
        <li v-for="chain in supportedChains" :key="chain.identifier">
          {{ chain.name }} {{ chain.identifier }}
          <button @click="onClickEnableChain(chain.identifier)">
            ✅
          </button>
          <button @click="onClickDisableChain(chain.identifier)">
            ❌
          </button>
          <button @click="onClickDeriveAddress(chain.identifier)">
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
      <input v-model="importedPrivateKey" type="text">
      <button @click="onClickImportKey">
        Import
      </button>
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
import { ChainData } from '~/background/services/chain'
import { wallet } from '~/ui/controllers/wallet'
import { ChainIdentifier, CHAINS, LocaleOptions, LOCALES } from '~/constants'
import { sleep } from '~/utils'
import { Unikey } from '~/background/services/unikey'

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
    }
    async function onClickSetup () {
      await wallet.setupWallet(passwordForSetup.value)
      isSetup.value = await wallet.isSetup()
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
    async function onClickLock () {
      await wallet.lock()
      isLocked.value = await wallet.isLocked()
    }
    async function onClickUnlock () {
      await wallet.unlock(passwordForUnlock.value)
      isLocked.value = await wallet.isLocked()
    }
    onMounted(async () => {
      isLocked.value = await wallet.isLocked()
    })

    // Chains
    const supportedChains = ref<ChainData[]>([])
    const enabledChains = ref<ChainData[]>([])
    async function onClickEnableChain (identifier: ChainIdentifier) {
      await wallet.enableChain(identifier)
      enabledChains.value = await wallet.getEnabledChains()
    }
    async function onClickDisableChain (identifier: ChainIdentifier) {
      await wallet.disabledChain(identifier)
      enabledChains.value = await wallet.getEnabledChains()
    }
    onMounted(async () => {
      supportedChains.value = await wallet.getSupportedChains()
      enabledChains.value = await wallet.getEnabledChains()
    })

    // unikey
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
    const chain = ref<ChainIdentifier>(ChainIdentifier.BTC)
    async function onClickDeriveAddress (identifier: ChainIdentifier) {
      await wallet.deriveNewAccountFromMnemonic(identifier)

      await onUnikeysChanged()
    }
    async function onClickImportKey () {
      await wallet.importPrivateKey(importedPrivateKey.value, CHAINS[chain.value].simpleKeyringType)
      await onUnikeysChanged()
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
        approvalPage: 'connect',
      })
    }
    // todo: there should be a more complex showcase
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

      // unikey
      unikeys,
      visibleUnikeys,
      currentUnikey,
      onClickGetUnikeys,
      onClickShowUnikey,
      onClickHideUnikey,
      onClickSetCurrentUnikey,
      onClickExportPrivateKey,

      // keyring
      importedPrivateKey,
      onClickDeriveAddress,
      onClickImportKey,

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
