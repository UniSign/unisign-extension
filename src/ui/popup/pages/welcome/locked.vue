<style lang="scss" scoped>
.page-locked {
  position: relative;
  width: 100%;
  height: 100%;
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
  >p {
    position: absolute;
    top: 577px;
    transform: translateX(-50%);
    left: 50%;
    font-size: $detail-font-size;
    line-height: 16px;
    color: #2A67C5;
    cursor: pointer;
  }
}
</style>

<template>
  <div class="page-locked">
    <img class="w-[122px] h-[122px] mx-auto mt-[119px]" src="/assets/page-welcome/locked-logo.png">
    <h2>Welcome Back</h2>
    <UniInput
      ref="passwordRef"
      v-model="password"
      :show-locked="true"
      class="uni-input"
      :validate-text="validataText"
      placeholder="Enter password"
      @triggerValidate="triggerValidate"
    ></UniInput>
    <p>
      Need Help?
    </p>
    <Ironman></Ironman>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PageLocked',
  setup () {
    const passwordRef = ref('')
    const password = ref('')
    const validataText = ref('')
    const triggerValidate = () => {
      if (password.value) {
        validataText.value = 'Incorrect password'
        passwordRef.value.validate()
      }
      else {
        validataText.value = 'Please enter password'
        passwordRef.value.validate()
        return false
      }
    }
    return {
      passwordRef,
      password,
      triggerValidate,
      validataText,
    }
  },
}
</script>
