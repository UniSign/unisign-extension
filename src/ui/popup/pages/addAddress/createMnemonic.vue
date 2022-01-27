<style lang="scss" scoped>
.page-create-mnemonic {
  position: relative;
  width: 100%;
  height: 100%;
  .central-content {
    padding: 90px 18px 24px 18px;
    >h2 {
      margin-bottom: 16px;
      text-align: center;
      font-size: $title-font-size;
      font-weight: bold;
      line-height: 29px;
    }
    >p {
      margin-bottom: 32px;
      text-align: center;
      font-size: $detail-font-size;
      line-height: 16px;
      color: #6F7684;
    }
  }
  .uni-btn {
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    width: 302px;
  }
}
</style>

<template>
  <div class="page-create-mnemonic">
    <UniTab :title="$tt('Create Mnemonic')"></UniTab>
    <div class="central-content">
      <h2>{{ $tt('Keep it carefully') }}</h2>
      <p>{{ $tt('Please copy the following contents on paper in order and keep them in a safe place. Do not take screenshots or send them to others') }}</p>
      <MnemonicBox :mnemonic-arr="mnemonicArr"></MnemonicBox>
    </div>
    <UniBtn class="uni-btn" @click="$router.push(`/addAddress/chooseTheRightOrder?mnemonic=${mnemonic}`)"></UniBtn>
    <Ironman></Ironman>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import MnemonicBox from './-/MnemonicBox.vue'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageCreateMnemonic',
  components: {
    MnemonicBox,
  },
  setup () {
    const mnemonic = ref('')
    const mnemonicArr = ref<string[]>([])

    onMounted(async () => {
      mnemonic.value = await wallet.generateMnemonic()
      mnemonicArr.value = mnemonic.value.split(' ')
    })

    return {
      mnemonic,
      mnemonicArr,
    }
  },
}
</script>
