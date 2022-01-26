<style>
.unisign-panel {
  background-color: red;
}
</style>
<template>
  <div class="unisign-panel">
    UniSign Buttons

    <button @click="onClickGetPermittedKeys">
      getPermittedKeys
    </button>
    |
    <button @click="onClickGetCurrentKeyType">
      getCurrentKeyType
    </button>

    <button @click="onClickRequestPermissionOfCurrentKey">
      requestPermissionsOfCurrentKey
    </button>
    |
    <button @click="onClickGetCurrentKey">
      getCurrentKey
    </button>

    <button @click="onClickSignPlainMessage">
      signPlainMessage
    </button>
  </div>
</template>

<script lang="ts">
import { ref, toRaw } from 'vue'
import { KeyObject, KeyObjectType } from '~/background/controllers/provider/index'

export default {
  setup () {
    // eslint-disable-next-line no-alert
    const alert = (res: any) => window.alert(JSON.stringify(res))
    const currentUnikeyType = ref<KeyObjectType|null>(null)
    const currentKey = ref<KeyObject>()

    return {
      async onClickGetCurrentKeyType () {
        currentUnikeyType.value = await window.unisign.request({
          method: 'getCurrentKeyType',
        })

        alert(currentUnikeyType.value)
      },

      async onClickRequestPermissionOfCurrentKey () {
        const res = await window.unisign.request({
          method: 'requestPermissionsOfCurrentKey',
          params: [{
            // postMessage doesn't accept proxied value, so we should extract the raw value.
            ...toRaw(currentUnikeyType.value),
            permissions: ['getCurrentKey', 'signTypedMessage', 'signTransaction'], // 可填 “*” 表示请求所有权限
          }],
        })

        alert(res)
      },

      async onClickGetPermittedKeys () {
        const res = await window.unisign.request({
          method: 'getPermittedKeys',
        })
        alert(res)
      },

      async onClickGetCurrentKey () {
        currentKey.value = await window.unisign.request({
          method: 'getCurrentKey',
        })

        alert(currentKey.value)
      },

      async onClickSignPlainMessage () {
        const res = await window.unisign.request({
          method: 'signPlainMessage',
          params: [{
            key: toRaw(currentKey.value),
            message: 'unisign',
          }],
        })

        alert(res)
      },
    }
  },
}
</script>
