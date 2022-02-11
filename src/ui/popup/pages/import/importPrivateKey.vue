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
    <UniTab :title="$tt('Import Private Key')" />
    <div class="central-content">
      <h2>{{ $tt('Import') }} {{ keyName }}</h2>
      <h2>
        {{ $tt('Private Key') }}
      </h2>
      <UniTextArea
        ref="privateKeyRef"
        v-model="privateKey"
        class="block mt-[32px] mx-auto"
        :validate-text="validataText"
        :placeholder="`${keyName} ${$tt('private key')}`"
      />
      <UniBtn :disabled="!privateKey" class="uni-btn" @click="onClickSubmit" />
    </div>
    <Ironman />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { UnikeySymbol } from '~/constants'
import { CHAINS } from '~/constants'
import { wallet } from '~/ui/controllers/wallet'
import type UniTextArea from '~/ui/components/UniTextArea.vue'

export default {
  name: 'PageImportPrivateKey',
  setup () {
    const router = useRouter()
    const route = useRoute()

    const privateKey = ref('')
    const privateKeyRef = ref<InstanceType<typeof UniTextArea>>()
    const validataText = ref('')
    const keyName = CHAINS[route.params.key as UnikeySymbol].name
    const onClickSubmit = async () => {
      if (!privateKey.value) return
      await wallet.importPrivateKey(privateKey.value, CHAINS[route.params.key as UnikeySymbol].simpleKeyringType).catch((e) => {
        validataText.value = e
        privateKeyRef.value?.validate()
        throw new Error(e)
      })
      router.push('/addAddress/addAddressSuccess')
    }
    return {
      onClickSubmit,
      privateKey,
      privateKeyRef,
      validataText,
      keyName,
    }
  },
}
</script>
