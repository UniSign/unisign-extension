<style lang="scss" scoped>
.page-setup {
  height: 100%;
  background: url("/assets/page-setup/page-setup-bg.png") no-repeat;
  background-size:100% 100%;
  h2 {
    margin-top: 13px;
    line-height: 21px;
    text-align: center;
    font-size: $main-font-size;
    span {
      margin-left: 1px;
      padding: 2px 4px;
      display: inline-block;
      box-sizing: border-box;
      font-size: $detail-font-size;
      font-weight: 600;
      line-height: 16px;
      border-radius: 4px;
      background: $main-color;
      color: #FFFFFF;
    }
  }
  .input-box {
    width: 302px;
    height: 270px;
    box-shadow: 0px 9px 12px 0px rgba(141, 145, 156, 0.2);
    border-radius: 22px;
    margin: 78px auto 0;
    padding: 32px 24px 24px;
    background: rgba(255, 255, 255, 0.45);
  }
}
</style>

<template>
  <div class="page-setup">
    <img class="w-[350px] h-[78px]" src="/assets/page-setup/page-setup-top-bg.png">
    <img class="w-[96px] h-[123px] mx-auto mt-[3px]" src="/assets/page-setup/page-setup-logo.png">
    <h2>{{ $tt('Bring all crypto users into') }}<span>{{ $tt('Web3.0') }}</span></h2>

    <div class="input-box">
      <UniInput ref="passwordRef" v-model="password" :placeholder="$tt('Set a password')"></UniInput>
      <UniInput ref="rePasswordRef" v-model="rePassword" :validate-text="validataText" class="mt-[32px] mb-[32px]" :placeholder="$tt('Repeat')"></UniInput>
      <UniBtn :disabled="!!(!password || !rePassword)" @click="onClickSetup"></UniBtn>
      <!--<router-link to="/test">test</router-link>-->
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { wallet } from '~/ui/controllers/wallet'
import UniInput from '~/ui/components/UniInput.vue'

export default {
  name: 'PageSetup',
  setup (props, context) {
    const router = useRouter()
    const i18n = useI18n()

    const password = ref('')
    const rePassword = ref('')
    const passwordRef = ref(null)
    const rePasswordRef = ref<InstanceType<typeof UniInput>>()
    const validataText = ref('')
    const onClickSetup = async () => {
      if (!password.value || !rePassword.value) return
      if (rePassword.value !== password.value) {
        validataText.value = i18n.$tt('The passwords do not match')
        rePasswordRef.value?.validate()
        return
      }
      await wallet.setupWallet(password.value).catch((e) => {
        validataText.value = e
        rePasswordRef.value?.validate()
        throw new Error(e)
      })
      router.push('/setup/phishingCode')
    }

    return {
      password,
      rePassword,
      passwordRef,
      rePasswordRef,
      validataText,
      onClickSetup,
    }
  },
}
</script>
