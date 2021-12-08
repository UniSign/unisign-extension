<style lang="scss">
.page-welcome {

}
</style>

<template>
  <div class="page-welcome">
    Welcome

    <br>

    <button class="btn mt-2" @click="openOptionsPage">
      Options Page
    </button>

    <button class="btn mt-2" @click="openPopup">
      Popup
    </button>
    <br>

    <div class="mt-2">
      <span class="opacity-50">PopResult:</span> {{ popResult }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { wallet } from '~/ui/controllers/wallet'

function openOptionsPage () {
  browser.runtime.openOptionsPage()
}

export default {
  name: 'PageWelcome',
  setup () {
    const popResult = ref('')

    return {
      popResult,

      openOptionsPage,
      async openPopup () {
        popResult.value = await wallet.connect()
      },
    }
  },
}
</script>
