<style lang="scss" scoped>
.page-import-private-key {
  position: relative;
  width: 100%;
  height: 100%;
  .central-content {
    h2 {
      margin-top: 32px;
      font-size: $title-font-size;
      font-weight: bold;
      line-height: 29px;
      text-align: center;
      &:nth-child(2) {
        margin-top: 0;
      }
    }
  }
  .uni-btn {
    position: absolute;
    bottom: 44px;
    left: 50%;
    transform: translateX(-50%);
    width: 302px;
  }
}
</style>

<template>
  <div class="page-import-private-key">
    <UniTab title="Import Private Key"></UniTab>
    <div class="central-content">
      <h2>Import {{ $route.params.key }}</h2>
      <h2>
        Private Key
      </h2>
      <UniTextArea
        ref="privateKeyRef"
        v-model="privateKey"
        class="block mt-[32px] mx-auto"
        validate-text="Incorrect private key"
        :placeholder="`${$route.params.key} private key`"
      ></UniTextArea>
      <UniBtn :disabled="!privateKey" class="uni-btn" @click="onClickSubmit"></UniBtn>
    </div>
    <Ironman></Ironman>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'PageImportPrivateKey',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const privateKey = ref('')
    const privateKeyRef = ref(null)
    const onClickSubmit = () => {
      if (!privateKey.value) return
      if (privateKey.value.length < 5) {
        privateKeyRef.value.validate()
        return
      }
      router.push(`/addAddressSuccess/${route.params.key}`)
    }
    return {
      onClickSubmit,
      privateKey,
      privateKeyRef,
    }
  },
}
</script>
