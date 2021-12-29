<style lang="scss" scoped>
.page-welcome {
  height: 100%;
  background: url("/assets/page-welcome/page-welcome-bg.png") no-repeat;
  background-size:100% 100%;
  h2 {
    margin-top: 13px;
    line-height: 21px;
    text-align: center;
    font-size: $main-font-size;
    font-weight: 400;
    color: $main-color;
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
    border: 1px solid #FFFFFF;
    margin: 78px auto 0;
    padding: 32px 24px 24px;
    background: rgba(255, 255, 255, 0.45);
  }
}
</style>

<template>
  <div class="page-welcome">
    <img class="w-[350px] h-[78px]" src="/assets/page-welcome/page-welcome-top-bg.png">
    <img class="w-[96px] h-[123px] mx-auto mt-[3px]" src="/assets/page-welcome/page-welcome-logo.png">
    <h2>Bring all crypto users into<span>Web3.0</span></h2>

    <div class="input-box">
      <UniInput ref="passwordRef" v-model="password" validate-text="The passwords do not match" placeholder="Set a password"></UniInput>
      <UniInput ref="rePasswordRef" v-model="rePassword" class="mt-[32px] mb-[32px]" placeholder="Repeat"></UniInput>
      <UniBtn :disabled="!!(password && rePassword)" @click="onClickSubmit"></UniBtn>
      <router-link to="/test">test</router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'PageWelcome',
  setup (props, context) {
    const password = ref('')
    const rePassword = ref('')
    const passwordRef = ref(null)
    const rePasswordRef = ref(null)
    const router = useRouter()
    const onClickSubmit = () => {
      if (!password.value || !rePassword.value) return
      if (rePassword.value !== password.value) {
        rePasswordRef.value.validate()
        return
      }
      router.push('/phishingCode')
    }

    return {
      password,
      rePassword,
      onClickSubmit,
      passwordRef,
      rePasswordRef,
    }
  },
}
</script>
