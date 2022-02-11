<style lang="scss" scoped>
.page-locked {
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 122px;

  >h2 {
    margin-top: 16px;
    font-size: $title-font-size;
    font-weight: 600;
    line-height: 29px;
    text-align: center;
  }
  .uni-input{
    margin: 32px auto 0;
    display: block;
  }
  .locked-help {
    position: absolute;
    bottom: 36px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: $detail-font-size;
    color: #2A67C5;
    cursor: pointer;
  }
}
</style>

<template>
  <div class="page-locked">
    <img class="w-[122px] h-[122px] mx-auto" :src="`/assets/page-setup/locked-logo.png`">
    <h2>{{ $tt('Welcome Back') }}</h2>
    <UniInput
      ref="passwordRef"
      v-model="password"
      password
      show-locked
      class="uni-input"
      :validate-text="validataText"
      :placeholder="$tt('Enter password')"
      @keyup.enter="triggerValidate"
      @triggerValidate="triggerValidate"
    />
    <!--todo: add link-->
    <a class="locked-help">
      {{ $tt('Need Help?') }}
    </a>
    <Ironman />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { wallet } from '~/ui/controllers/wallet'
import type UniInput from '~/ui/components/UniInput.vue'

export default {
  name: 'PageLocked',
  setup () {
    const router = useRouter()
    const i18n = useI18n()

    const passwordRef = ref<InstanceType<typeof UniInput>>()
    const password = ref('')
    const validataText = ref('')
    const isLocked = ref(false)
    const triggerValidate = async () => {
      if (!password.value) {
        validataText.value = i18n.$tt('Please enter password')
        passwordRef.value?.validate()
        return
      }
      await wallet.unlock(password.value).catch((e) => {
        validataText.value = e
        passwordRef.value?.validate()
        throw new Error(e)
      })
      isLocked.value = await wallet.isLocked()

      if (!isLocked.value) {
        const approval = await wallet.getApproval()
        if (approval) {
          await wallet.resolveApproval()
        }
        await router.replace('/')
      }
    }

    return {
      passwordRef,
      password,
      validataText,
      isLocked,
      triggerValidate,
    }
  },
}
</script>
