<template>
  <div class="fixed right-0 bottom-0 m-5 z-100 flex font-sans select-none leading-1em" @click="lock">
    UniSign {{ isLocked }}
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { wallet } from '~/ui/controllers/wallet'
import 'virtual:windi.css'

export default {
  setup () {
    const isLocked = ref(false)

    return {
      isLocked,

      async lock () {
        if (isLocked.value) {
          isLocked.value = await wallet.unlock()
        }
        else {
          isLocked.value = await wallet.lock()
        }
      },
    }
  },
}
</script>
