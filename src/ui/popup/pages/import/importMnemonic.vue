<style lang="scss" scoped>
.page-import-mnemonic {
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
  <div class="page-import-mnemonic">
    <UniTab title="Import Mnemonic"></UniTab>
    <div class="central-content">
      <h2>Import Mnemonic</h2>
      <UniTextArea
        ref="mnemonicRef"
        v-model="mnemonic"
        class="block mt-[32px] mx-auto"
        height="130px"
        validate-text="Incorrect mnemonic"
        :placeholder="`Enter mnemonic, separated by space`"
      ></UniTextArea>
      <UniBtn :disabled="!mnemonic" class="uni-btn" @click="onClickSubmit"></UniBtn>
    </div>
    <Ironman></Ironman>
  </div>
</template>

<script>
import '~/background/polyfill'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { validateMnemonic } from 'bip39'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageImportMnemonic',
  setup () {
    const router = useRouter()
    const route = useRoute()

    const mnemonic = ref('')
    const mnemonicRef = ref(null)
    const onClickSubmit = async () => {
      if (!mnemonic.value) return
      if (!validateMnemonic(mnemonic.value)) {
        mnemonicRef.value.validate()
      }
      await wallet.importMnemonic(mnemonic.value)
      router.push('/addAddressSuccess')
    }
    return {
      onClickSubmit,
      mnemonic,
      mnemonicRef,
    }
  },
}
</script>
