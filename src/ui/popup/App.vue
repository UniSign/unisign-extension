<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <div>UniSign</div>
    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <div class="mt-2">
      <span class="opacity-50">Storage:</span> {{ storageDemo }}
    </div>
  </main>
</template>

<script lang="ts">
import { storageDemo } from '~/utils/storage'

function openOptionsPage () {
  browser.runtime.openOptionsPage()
}

export default {
  setup () {
    return {
      storageDemo,
      openOptionsPage,
    }
  },
}
</script>
