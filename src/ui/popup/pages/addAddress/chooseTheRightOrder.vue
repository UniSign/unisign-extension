<style lang="scss" scoped>
.page-choose-the-right-order {
  position: relative;
  width: 100%;
  height: 100%;
  .central-content {
    padding: 90px 22px 24px 22px;
    >h2 {
      margin-bottom: 24px;
      text-align: center;
      font-size: $title-font-size;
      font-weight: bold;
      line-height: 29px;
    }
    .mnemonic-box,.mnemonic-choose-box {
      display: flex;
      flex-wrap: wrap;
      .mnemonic-item {
        margin: 0 8px 8px 0;
        width: 96px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid rgba(191, 191, 191, 0.09);
        display: flex;
        align-items: center;
        background: #F9F7F6;
        &:nth-child(3n) {
          margin: 0 0 8px 0;
        }
        span {
          margin: 0 11px 0 6px;
          line-height: 14px;
          color: #C9CCD3;
        }
        p {
          font-size: $detail-font-size;
          font-weight: bold;
          color: #35BC7A;
          line-height: 16px;
        }
      }
    }
    .mnemonic-choose-box {
      margin-top: 24px;
      .mnemonic-item {
        justify-content: center;
        cursor: pointer;
        &._invisible {
          border: none;
          background-color: #ffffff;
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
    <UniMsg :visible="canShowMsg" error content="Incorrect order" @close="canShowMsg= false"></UniMsg>
    <UniTab title="Create Mnemonic"></UniTab>
    <div class="central-content">
      <h2>{{ $tt('keep it carefully') }}</h2>
      <div class="mnemonic-box">
        <div v-for="(item,index) in mnemonicArr" :key="index" class="mnemonic-item">
          <span>{{ index + 1 }}</span>
          <p>{{ item }}</p>
        </div>
      </div>
      <div class="mnemonic-choose-box">
        <div v-for="(item,index) in mnemonicChooseArr" :key="index" class="mnemonic-item" :class="{'_invisible':isNullOrEmpty(item)}" @click="chooseMnemonic(index)">
          <p>{{ item }}</p>
        </div>
      </div>
    </div>
    <UniBtn class="uni-btn" :disabled="!canClickBtn" @click="onClickSubmit"></UniBtn>
    <Ironman></Ironman>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isNullOrEmpty } from '~/utils/index'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageCreateMnemonic',
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
