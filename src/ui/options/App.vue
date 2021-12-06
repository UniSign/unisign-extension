<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    <div>UniSign Options</div>
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
