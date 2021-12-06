<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <div>UniSign Notification</div>
    <div class="mt-2">
      <span class="opacity-50">Storage:</span> {{ storageDemo }}
    </div>
  </main>
</template>

<script lang="ts">
import { storageDemo } from '~/utils/storage'

export default {
  setup() {
    return {
      storageDemo,
    }
  },
}
</script>
