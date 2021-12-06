<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <div>UniSign</div>
    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <br>
    <button class="btn mt-2" @click="lock">
      Lock
    </button>
    <button class="btn mt-2" @click="unlock">
      UnLock
    </button>
    <br>
    isLocked {{ isLocked }}
    <div class="mt-2">
      <span class="opacity-50">Storage:</span> {{ storageDemo }}
    </div>
  </main>
</template>

<script lang="ts">
import { ref } from 'vue'
import { storageDemo } from '~/utils/storage'
import { wallet } from '~/ui/controllers/wallet'

function openOptionsPage () {
  browser.runtime.openOptionsPage()
}

export default {
  setup () {
    const isLocked = ref(false)

    onBeforeMount(async () => {
      isLocked.value = await wallet.isLocked()
    })

    return {
      storageDemo,
      openOptionsPage,

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
