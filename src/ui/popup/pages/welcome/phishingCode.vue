<style lang="scss" scoped>
.page-phishing-code {
  background: url("/assets/page-welcome/page-welcome-bg.png") no-repeat;
  background-size:100% 100%;
  padding: 78px 24px 0;
  h2 {
    font-size: 24px;
    font-weight: 800;
    color: #242C3F;
    line-height: 29px;
    text-align: center;
  }
  h3 {
    width: 302px;
    display: block;
    margin: 8px auto 48px;
    font-size: 14px;
    font-weight: 400;
    color: #6F7684;
    line-height: 16px;
    text-align: center;
  }
  input {
    width: 180px;
    height: 50px;
    font-size: 24px;
    font-weight: bold;
    color: #242C3F;
    line-height: 50px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.08);
    padding: 10px 12px;
    text-align: center;
    display: block;
    margin:0 auto 143px;
    font-family: monospace;
    &:focus {
        outline:none;
        border: 1px solid #FBAF34;
    }
    &._error {
        outline:none;
        border: 1px solid #F72B35;
    }
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
  <div class="page-phishing-code main-container">
    <Iconfont class="block mx-auto mb-[31px]" name="anti-phishing" width="61" height="48" color="black"></Iconfont>
    <h2>Set an</h2>
    <h2>Anti-Phishing Code</h2>
    <i class="iconfont icon-explore"></i>
    <h3>The Anti-Phishing Code is a security feature. It will be included in all windows about UniSign. This Code helping you to prevent phishing attemtps.</h3>
    <input v-model="modelValue" :class="{'_error':isError}" type="text">
    <button class="uni-btn" :class="{'_canClick':modelValue}" @click="onClickSubmit">
      Continue
    </button>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Iconfont from '~/ui/components/Iconfont.vue'
export default {
  name: 'PagePhishingCode',
  components: {
    Iconfont,
  },
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
