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
      requestPermissionsOfCurrentKey
    </button>

    <button @click="onClickGetCurrentKey">
      onClickGetCurrentKey
    </button>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { Unikey } from '~/background/services/unikey'

export default {
  setup () {
    const isLocked = ref(false)

    // eslint-disable-next-line no-alert
    const alert = (res: any) => window.alert(JSON.stringify(res))
    const currentUnikeyType = ref<Unikey|null>(null)

    return {
      isLocked,

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
            permissions: ['getCurrentKey', 'signTypedMessage', 'signTransaction'], // 可填 “*” 表示请求所有权限
            type: 'blockchain',
            meta: {
              coinType: '0',
            },
            // todo: find out why currentUnikeyType.value will cause error
            // ...currentUnikeyType.value,
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
        const res = await window.unisign.request({
          method: 'getCurrentKey',
        })

        alert(res)
      },
    }
  },
}
</script>
