<style lang="scss">
.page-unlock {

}
</style>

<template>
  <div class="page-unlock">
    Unlock

    <div>
      <button class="btn mt-2" @click="lock">
        Lock
      </button>
      <button class="btn mt-2" @click="unlock">
        UnLock
      </button>
    </div>

    Wallet isLocked: {{ isLocked }}
  </div>
</template>

<script>

import { ref } from 'vue'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageUnlock',
  setup () {
    const isLocked = ref(false)

    onBeforeMount(async () => {
      isLocked.value = await wallet.isLocked()
    })

    return {
      isLocked,
      async lock () {
        isLocked.value = await wallet.lock()
      },
      async unlock () {
        isLocked.value = await wallet.unlock()
      },
    }
  },
}
</script>
