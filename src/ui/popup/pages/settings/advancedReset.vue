<style lang="scss" scoped>
.page-advanced-reset {
  position: relative;
  width: 100%;
  height: 100%;
  .settings-box {
    padding: 70px 16px;
    .settings-item-box {
      width: 100%;
      height: 66px;
      margin-top: 12px;
      padding: 0px 17px 0px 24px;
      border-radius: 12px;
      border: 1px solid rgba(191, 191, 191, 0.09);
      display: flex;
      align-items: center;
      background: #F9F7F6;
      cursor: pointer;
      &:hover {
        background: #F0EDED;
      }
      >span {
        width: 200px;
        font-size: $input-font-size;
        font-weight: 500;
        line-height: 19px;
      }
      .arrow-right {
        margin-left: auto;
        display: flex;
        align-items: center;
      }
    }
  }
  .tipsDialog {
    .slot-container {
      padding: 24px;
      .text{
        margin-bottom: 48px;
        font-size: $input-font-size;
        line-height: 22px;
      }
    }
  }
}
</style>

<template>
  <div class="page-advanced-reset">
    <UniTab title="Advanced"></UniTab>
    <div class="settings-box">
      <div class="settings-item-box">
        <span>Import another Mnemonic</span>
        <div class="arrow-right">
          <Iconfont name="arrow-right" width="12" height="14" color="#D8D8D8"></Iconfont>
        </div>
      </div>
      <div class="settings-item-box" @click="isShowTipsDialog = true">
        <span>Reset UniSign</span>
        <div class="arrow-right">
          <Iconfont name="arrow-right" width="12" height="14" color="#D8D8D8"></Iconfont>
        </div>
      </div>
    </div>
    <Ironman></Ironman>
    <UniDialog class="tipsDialog" error :visible="isShowTipsDialog" title="Reset UniSign?" @cancel="isShowTipsDialog = false">
      <div class="slot-container">
        <div class="text">
          After resetting, UniSign will revert to its initial state and all your addresses will be deleted. Please make sure you have backed up before you reset.
        </div>
        <UniBtn class="uni-btn" error @click="handleTipsCancel">
          Confirm
        </UniBtn>
      </div>
    </UniDialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { wallet } from '~/ui/controllers/wallet'
import { sleep } from '~/utils'

export default {
  name: 'PageAdvancedReset',
  setup () {
    const isShowTipsDialog = ref(false)
    const handleTipsCancel = async () => {
      await wallet.reset()
      await sleep(1000)
      window.location.reload()
      isShowTipsDialog.value = false
    }

    return {
      isShowTipsDialog,
      handleTipsCancel,
    }
  },
}
</script>
