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

      <button @click="onClickReset">
        reset
      </button>
      isSetup: {{ isSetup }}
      <br>

      <button @click="onClickGenerateMnemonic">
        generate
      </button>mnemonic: {{ mnemonic }}
      <br>

      <button @click="onClickSetup">
        setup
      </button>

      <label>
        <input :value="passwordForSetup" @change="onChangePasswordForSetup">
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
      <button @click="onClickUnlock">
        Unlock
      </button>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { wallet } from '~/ui/controllers/wallet'
import { LocaleOptions, LOCALES } from '~/constants'
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

    // todo: implement setup process
    // setup
    const isSetup = ref(false)
    const passwordForSetup = ref('')
    const mnemonic = ref('')
    function onChangePasswordForSetup (e: InputEvent) {
      passwordForSetup.value = e.target.value
    }
    async function onClickGenerateMnemonic () {
      mnemonic.value = await wallet.generateMnemonic()
    }

    async function onClickSetup () {
      await wallet.setup(passwordForSetup.value)
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
    const passwordForUnlock = ref('')
    async function onClickLock () {
      await wallet.lock()
      isLocked.value = await wallet.isLocked()
    }
    async function onClickUnlock () {
      await wallet.unlock(passwordForUnlock.value)
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

      // setup
      isSetup,
      mnemonic,
      passwordForSetup,
      onClickGenerateMnemonic,
      onClickSetup,
      onClickReset,

      // isLocked
      isLocked,
      passwordForUnlock,
      onChangePasswordForSetup,
      onClickLock,
      onClickUnlock,
    }
  },
}
</script>
