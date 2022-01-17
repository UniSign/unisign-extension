<style lang="scss" scoped>
.page-import-private-key {
  position: relative;
  width: 100%;
  height: 100%;
  .central-content {
    padding-top: 58px;
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
      <h2>Import {{ keyName }}</h2>
      <h2>
        Private Key
      </h2>
      <UniTextArea
        ref="privateKeyRef"
        v-model="privateKey"
        class="block mt-[32px] mx-auto"
        validate-text="Incorrect private key"
        :placeholder="`${keyName} private key`"
      ></UniTextArea>
      <UniBtn :disabled="!privateKey" class="uni-btn" @click="onClickSubmit"></UniBtn>
    </div>
    <Ironman></Ironman>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CHAINS } from '~/constants'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageImportPrivateKey',
  setup () {
    const router = useRouter()
    const route = useRoute()

    const privateKey = ref('')
    const privateKeyRef = ref(null)
    const keyName = CHAINS[route.params.key].name
    const onClickSubmit = async () => {
      if (!privateKey.value) return
      // todo:To be verified
      if (privateKey.value.length < 5) {
        privateKeyRef.value.validate()
        return
      }
      await wallet.importPrivateKey(privateKey.value, CHAINS[route.params.key].simpleKeyringType)
      router.push('/addAddressSuccess')
    }
    return {
      onClickSubmit,
      privateKey,
      privateKeyRef,
      keyName,
    }
  },
}
</script>
