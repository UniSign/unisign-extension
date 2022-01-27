<style lang="scss" scoped>
.page-choose-the-right-order {
  position: relative;
  width: 100%;
  height: 100%;
  .central-content {
    padding: 90px 18px 24px 18px;
    >h2 {
      margin-bottom: 24px;
      text-align: center;
      font-size: $title-font-size;
      font-weight: bold;
      line-height: 29px;
    }
    .mnemonics {
      :deep(.mnemonic-item) {
        p {
          color: #35BC7A;
        }
      }
    }
  }
  .uni-btn {
    position: absolute;
    bottom: 44px;
    left: 50%;
    transform: translateX(-50%);
    width: 302px;
  }
}
</style>

<template>
  <div class="page-choose-the-right-order">
    <UniMsg :visible="canShowMsg" error :content="$tt('Incorrect order')" @close="canShowMsg= false"></UniMsg>
    <UniTab :title="$tt('Create Mnemonic')"></UniTab>
    <div class="central-content">
      <h2>{{ $tt('Keep it carefully') }}</h2>
      <MnemonicBox class="mnemonics" :mnemonic-arr="mnemonicArr"></MnemonicBox>
      <MnemonicBox can-choose :mnemonic-arr="mnemonicChooseArr" @click="chooseMnemonic"></MnemonicBox>
    </div>
    <UniBtn class="uni-btn" :disabled="!canClickBtn" @click="onClickSubmit"></UniBtn>
    <Ironman></Ironman>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MnemonicBox from './-/MnemonicBox.vue'
import { isNullOrEmpty } from '~/utils/index'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageCreateMnemonic',
  components: {
    MnemonicBox,
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const canShowMsg = ref(false)
    const mnemonicArr = ref(new Array(12).fill(''))
    const mnemonicChooseArr = ref<string[]>([])
    const mnemonicCorrectArr = ref<string[]>([])
    onMounted(async () => {
      console.log(route.query.mnemonic, 'route.query.mnemonic')
      mnemonicChooseArr.value = (route.query.mnemonic as string).split(' ').sort(() => 0.5 - Math.random())
      mnemonicCorrectArr.value = (route.query.mnemonic as string).split(' ')
    })
    const chooseMnemonic = (index: number) => {
      if (isNullOrEmpty(mnemonicChooseArr.value[index])) return
      const emptyIndex = mnemonicArr.value.findIndex(item => isNullOrEmpty(item))
      if (mnemonicChooseArr.value[index] !== mnemonicCorrectArr.value[emptyIndex]) {
        canShowMsg.value = true
        return
      }
      mnemonicArr.value.splice(emptyIndex, 1, mnemonicChooseArr.value[index])
      mnemonicChooseArr.value.splice(index, 1, '')
    }
    const canClickBtn = computed(() => {
      return mnemonicArr.value.every(item => !isNullOrEmpty(item))
    })
    const onClickSubmit = async () => {
      if (!canClickBtn.value) return
      await wallet.importMnemonic(route.query.mnemonic as string)
      router.push('/addAddress/addAddressSuccess')
    }
    return {
      isNullOrEmpty,
      mnemonicArr,
      mnemonicChooseArr,
      chooseMnemonic,
      canClickBtn,
      canShowMsg,
      onClickSubmit,
    }
  },
}
</script>
