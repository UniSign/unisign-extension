<style>
.unisign-panel {
  background-color: red;
}
</style>
<template>
  <div class="unisign-panel" @click="lock">
    UniSign {{ isLocked }}

    <button @click="onClickConnect">
      connect
    </button>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  setup () {
    const isLocked = ref(false)
    return {
      isLocked,

      async onClickConnect () {
        const res = await window.unisign.request({
          method: 'getCurrentKeyType',
        })

        // eslint-disable-next-line no-alert
        window.alert(res)
      },
    }
  },
}
</script>
