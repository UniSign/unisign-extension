<style lang="scss">
.page-welcome {

}
</style>

<template>
  <div class="page-welcome">
    Welcome

    <button class="btn mt-2" @click="openOptionsPage">
      Open Options Page
    </button>
    <br>

    <div class="mt-2">
      <span class="opacity-50">Storage:</span> {{ storageDemo }}
    </div>
  </div>
</template>

<script>
import { storageDemo } from '~/utils/storage'

function openOptionsPage () {
  browser.runtime.openOptionsPage()
}

export default {
  name: 'PageWelcome',
  setup () {
    return {
      openOptionsPage,

      storageDemo,
    }
  },
}
</script>
