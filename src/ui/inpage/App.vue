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

    <button @click="onClickSignStructMessage">
      signStructMessage
    </button>

    <button @click="onClickSignTransaction">
      SignTransaction
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
          params: {
            // postMessage doesn't accept proxied value, so we should extract the raw value.
            ...toRaw(currentUnikeyType.value),
            permissions: ['getCurrentKey', 'signTypedMessage', 'signTransaction'], // 可填 “*” 表示请求所有权限
          },
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
          params: {
            key: toRaw(currentKey.value),
            message: 'unisign',
          },
        })

        alert(res)
      },

      async onClickSignStructMessage () {
        const res = await window.unisign.request({
          method: 'signStructMessage',
          params: {
            key: toRaw(currentKey.value),
            message: {
              protocolVersion: '1.0',
              signFrom: 'test.unisign.org',
              appName: 'Test Unisign',
              subject: 'Demonstrate the ability to sign a struct message',
              signer: 'unisign',
              digest: '0x1234',
              content: {
                year: 2021,
                chain: 'CKB',
              },
            },
          },
        })

        alert(res)
      },

      async onClickSignTransaction () {
        const res = await window.unisign.request({
          method: 'signTransaction',
          params: {
            key: toRaw(currentKey.value),
            message: '70736274ff0100c2020000000291d7a6b2d9ae4578d779cbdd6e3fe491c6eeb62493d02c194c7bd15dbac75e270100000000ffffffffeea611cba1982c614829436b2570f89b80d6af29ca4e26f78996f8f2102737cc0000000000ffffffff03289a0100000000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acd0070000000000001976a9140f9eed4333a8438f90e958a012d51a5ccea2f11088acd0070000000000001976a91497697908b1f81654b2aab68f77525538890216e788ac000000000001011fa0860100000000001600140f9eed4333a8438f90e958a012d51a5ccea2f1100001011f102700000000000016001497697908b1f81654b2aab68f77525538890216e700000000',
          },
        })

        alert(res)
      },
    }
  },
}
</script>
