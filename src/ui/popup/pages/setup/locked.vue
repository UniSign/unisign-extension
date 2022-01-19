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
    <img class="w-[122px] h-[122px] mx-auto mt-[119px]" src="/assets/page-setup/locked-logo.png">
    <h2>Welcome Back</h2>
    <UniInput
      ref="passwordRef"
      v-model="password"
      show-locked
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
import { useRouter } from 'vue-router'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageLocked',
  setup () {
    const router = useRouter()

    const passwordRef = ref('')
    const password = ref('')
    const validataText = ref('')
    const isLocked = ref(false)
    const triggerValidate = async () => {
      if (!password.value) {
        validataText.value = 'Please enter password'
        passwordRef.value.validate()
        return
      }
      await wallet.unlock(password.value).catch((e) => {
        validataText.value = e
        passwordRef.value.validate()
        throw new Error(e)
      })
      isLocked.value = await wallet.isLocked()
      if (!isLocked.value) {
        router.push('/')
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
