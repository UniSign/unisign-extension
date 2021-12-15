<style lang="scss" scoped>
.page-phishing-code {
  height: 100%;
  padding: 78px 24px 0;
  background: url("/assets/page-welcome/page-welcome-bg.png") no-repeat;
  background-size:100% 100%;
  h2 {
    font-size: $title-font-size;
    font-weight: 800;
    color: $main-color;
    line-height: 29px;
    text-align: center;
  }
  h3 {
    display: block;
    margin: 8px auto 48px;
    width: 302px;
    font-size: $detail-font-size;
    font-weight: 400;
    line-height: 16px;
    text-align: center;
    color: #6F7684;
  }
  input {
    width: 180px;
    height: 50px;
    padding: 10px 12px;
    margin:0 auto 143px;
    display: block;
    border-radius: 8px;
    font-size: $title-font-size;
    font-weight: bold;
    line-height: 50px;
    text-align: center;
    font-family: monospace;
    background: rgba(0, 0, 0, 0.08);
    color: $main-color;
    &:focus {
        outline:none;
        border: 1px solid $input-boder-focus-color;
    }
    &._error {
        outline:none;
        border: 1px solid $input-boder-error-color;
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
    <input v-model="modelValue" :class="{'_error':isError}" type="text">
    <UniBtn :disabled="!!modelValue" @click="onClickSubmit"></UniBtn>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'PagePhishingCode',
  setup (props, context) {
    const modelValue = ref('')
    const isError = ref(false)
    const router = useRouter()
    const onClickSubmit = () => {
      if (!modelValue.value) return
      if (modelValue.value.length > 10) {
        isError.value = true
        return
      }
      router.push('/begin')
    }
    const getRanNum = () => {
      const result = []
      for (let i = 0; i < 4; i++) {
        const ranNum = Math.ceil(Math.random() * 25)
        result.push(String.fromCharCode(65 + ranNum))
      }
      return result.join('')
    }
    onBeforeMount(async () => {
      modelValue.value = getRanNum()
    })
    return {
      modelValue,
      isError,
      onClickSubmit,
    }
  },
}
</script>
