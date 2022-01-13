<style lang="scss" scoped>
.page-phishing-code {
  height: 100%;
  padding: 78px 24px 0;
  background: url("/assets/page-welcome/page-welcome-bg.png") no-repeat;
  background-size:100% 100%;
  h2 {
    font-size: $title-font-size;
    font-weight: 800;
    line-height: 29px;
    text-align: center;
  }
  h3 {
    display: block;
    margin: 8px auto 48px;
    width: 302px;
    font-size: $detail-font-size;
    line-height: 16px;
    text-align: center;
    color: #6F7684;
  }
  >div {
    margin-bottom: 143px;
    position: relative;
    input {
      width: 180px;
      height: 50px;
      padding: 10px 12px;
      margin:0 auto;
      display: block;
      border-radius: 8px;
      font-size: $title-font-size;
      font-weight: bold;
      line-height: 50px;
      text-align: center;
      font-family: monospace;
      background: rgba(0, 0, 0, 0.08);
      &:focus {
          outline:none;
          border: 1px solid $input-boder-focus-color;
      }
      &._error {
          outline:none;
          border: 1px solid $input-boder-error-color;
      }
    }
    p {
      position: absolute;
      top: 56px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      line-height: 14px;
      white-space:nowrap;
      color: $input-boder-error-color;
    }
  }
}
</style>

<template>
  <div class="page-phishing-code">
    <Iconfont class="block mx-auto mb-[31px]" name="anti-phishing" width="61" height="48" color="black"></Iconfont>
    <h2>Set an</h2>
    <h2>Anti-Phishing Code</h2>
    <i class="iconfont icon-explore"></i>
    <h3>The Anti-Phishing Code is a security feature. It will be included in all windows about UniSign. This Code helping you to prevent phishing attemtps.</h3>
    <div>
      <input v-model="antiPhishingCode" :class="{'_error':isError}" type="text">
      <p v-show="isError">
        Supports up to 10 characters
      </p>
    </div>
    <UniBtn :disabled="!antiPhishingCode" @click="onClickSubmit"></UniBtn>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PagePhishingCode',
  setup (props, context) {
    const router = useRouter()

    const antiPhishingCode = ref('')
    const isError = ref(false)
    const onClickSubmit = async () => {
      if (!antiPhishingCode.value) return
      if (antiPhishingCode.value.length > 10) {
        isError.value = true
        return
      }
      await wallet.setAntiPhishingCode(antiPhishingCode.value)
      router.push('/addAddress')
    }
    onMounted(async () => {
      antiPhishingCode.value = await wallet.getAntiPhishingCode()
    })

    return {
      antiPhishingCode,
      isError,
      onClickSubmit,
    }
  },
}
</script>
