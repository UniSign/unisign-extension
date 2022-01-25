<style lang="scss" scoped>
.page-import-keystore-file {
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
  <div class="page-import-keystore-file">
    <UniTab :title="$tt('Import Keystore File')"></UniTab>
    <div class="central-content">
      <h2>{{ $tt('Import Keystore') }}</h2>
      <UniTextArea
        ref="keystoreRef"
        v-model="keystore"
        class="block mt-[32px] mx-auto"
        height="188px"
        :validate-text="$tt('Incorrect keystore')"
        :placeholder="$tt('Enter Keystore')"
      ></UniTextArea>
      <UniInput
        ref="passwordRef"
        v-model="password"
        class="mt-[32px] block mx-auto"
        width="302px"
        background-color="#F7F8FA"
        :validate-text="$tt('Incorrect password')"
        :placeholder="$tt('Password of the keystore file')"
      ></UniInput>
      <UniBtn :disabled="!!(!keystore || !password)" class="uni-btn" @click="onClickSubmit"></UniBtn>
    </div>
    <Ironman></Ironman>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UniTextArea from '~/ui/components/UniTextArea.vue'
import UniInput from '~/ui/components/UniInput.vue'

export default {
  name: 'PageImportKeystoreFile',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const keystore = ref('')
    const password = ref('')
    const keystoreRef = ref<InstanceType<typeof UniTextArea>>()
    const passwordRef = ref<InstanceType<typeof UniInput>>()
    const onClickSubmit = () => {
      if (!keystore.value || !password.value) return
      if (keystore.value.length < 5) {
        keystoreRef.value?.validate()
        return
      }
      if (password.value.length < 5) {
        passwordRef.value?.validate()
        return
      }
      router.push(`/addAddress/addAddressSuccess/${route.params.key}`)
    }
    return {
      onClickSubmit,
      keystore,
      keystoreRef,
      password,
      passwordRef,
    }
  },
}
</script>
