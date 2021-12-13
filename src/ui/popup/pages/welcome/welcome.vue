<style lang="scss" scoped>
.page-welcome {
  background: url("/assets/page-welcome/page-welcome-bg.png") no-repeat;
  background-size:100% 100%;
  h2 {
    font-size: 18px;
    font-weight: 400;
    color: #242C3F;
    line-height: 21px;
    text-align: center;
    margin-top: 13px;
    span {
      margin-left: 1px;
      display: inline-block;
      background:#242C3F;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 16px;
      padding: 2px 4px;
      box-sizing: border-box;
    }
  }
  .input-box {
    width: 302px;
    height: 270px;
    background: rgba(255, 255, 255, 0.45);
    box-shadow: 0px 9px 12px 0px rgba(141, 145, 156, 0.2);
    border-radius: 22px;
    border: 1px solid #FFFFFF;
    margin: 78px auto 0;
    padding: 32px 24px 24px;
  }
  .uni-btn {
    width: 100%;
    height: 50px;
    background: #FBAF34;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 21px;
    opacity: 0.4;
    &._canClick {
      opacity: 1;
    }
    &:focus{
      outline: 0;
    }
  }
}
</style>

<template>
  <div class="page-welcome main-container">
    <img class="w-[350px] h-[78px]" src="/assets/page-welcome/page-welcome-top-bg.png">
    <img class="w-[96px] h-[123px] mx-auto mt-[3px]" src="/assets/page-welcome/page-welcome-logo.png">
    <h2>Bring all crypto users into<span>Web3.0</span></h2>
    <div class="input-box">
      <uni-input ref="passwordRef" v-model="password" validate-text="The passwords do not match" placeholder="Set a password"></uni-input>
      <uni-input ref="rePasswordRef" v-model="rePassword" class="mt-[32px] mb-[32px]" placeholder="Repeat"></uni-input>
      <button class="uni-btn" :class="{'_canClick':password && rePassword}" @click="onClickSubmit">
        Continue
      </button>
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
      // if (!password.value || !passwordRef.value) return
      // if (rePassword.value !== password.value) {
      //   rePasswordRef.value.validate()
      //   return
      // }
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
