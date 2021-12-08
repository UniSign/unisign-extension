<style lang="scss">
.page-sign-plain-message {

}
</style>

<template>
  <div class="page-sign-plain-message">
    SignMessage
    <br>

    <button class="btn" @click="lock">
      lock
    </button>
    <br>

    isLocked: {{ isLocked }}
  </div>
</template>

<script>

import { ref } from 'vue'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageSignPlainMessage',
  components: {},
  setup () {
    const isLocked = ref(false)

    console.log(1, isLocked)
    onBeforeMount(async () => {
      console.log(2, isLocked.value)
      isLocked.value = await wallet.isLocked()
      console.log(3, isLocked.value)
    })

    return {
      isLocked,

      async lock () {
        console.log('lock')
        isLocked.value = await wallet.lock()
      },
    }
  },
}
</script>
