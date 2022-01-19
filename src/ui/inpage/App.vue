<style>
.unisign-panel {
  background-color: red;
}
</style>
<template>
  <div class="unisign-panel" @click="lock">
    UniSign {{ isLocked }}

    <button @click="onClickGetCurrentKeyType">
      getCurrentKeyType
    </button>

    <button @click="onClickGetPermittedKeys">
      getPermittedKeys
    </button>

    <button @click="onClickRequestPermissionOfCurrentKey">
      requestPermissionOfCurrentKey
    </button>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  setup () {
    const isLocked = ref(false)

    // eslint-disable-next-line no-alert
    const alert = (res: any) => window.alert(JSON.stringify(res))

    return {
      isLocked,

      async onClickGetCurrentKeyType () {
        const res = await window.unisign.request({
          method: 'getCurrentKeyType',
        })

        alert(res)
      },

      async onClickRequestPermissionOfCurrentKey () {
        const res = await window.unisign.request({
          method: 'requestPermissionOfCurrentKey',
        })

        alert(res)
      },

      async onClickGetPermittedKeys () {
        const res = await window.unisign.request({
          method: 'getPermittedKeys',
        })
        alert(res)
      },
    }
  },
}
</script>
