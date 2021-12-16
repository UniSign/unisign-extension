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
      color: $main-color;
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
      <h2>Import {{ $route.params.key }} Mnemonic</h2>
      <UniTextArea
        ref="mnemonicRef"
        v-model="mnemonic"
        class="block mt-[32px] mx-auto"
        height="130px"
        validate-text="Incorrect mnemonic"
        :placeholder="`Enter ${$route.params.key} mnemonic, separated by space`"
      ></UniTextArea>
      <UniBtn :disabled="!!mnemonic" class="uni-btn" @click="onClickSubmit"></UniBtn>
    </div>
    <Ironman></Ironman>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'PageImportMnemonic',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const mnemonic = ref('')
    const mnemonicRef = ref(null)
    const onClickSubmit = () => {
      if (!mnemonic.value) return
      if (mnemonic.value.length < 5) {
        mnemonicRef.value.validate()
        return
      }
      router.push(`/addAddressSuccess/${route.params.key}`)
    }
    return {
      onClickSubmit,
      mnemonic,
      mnemonicRef,
    }
  },
}
</script>
