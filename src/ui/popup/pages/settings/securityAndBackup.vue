<style lang="scss" scoped>
.page-security-and-backup {
  position: relative;
  width: 100%;
  height: 100%;
  .settings-box {
    padding: 12px 16px;
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
        >span {
          margin-right: 8px;
          font-size: $input-font-size;
          font-weight: 500;
          color: #8D919C;
          line-height: 24px;
        }
      }
    }
  }
  .phishingCodeDialog {
    .slot-container {
      padding: 32px 24px 24px;
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
  <div class="page-security-and-backup">
    <UniMsg :visible="canShowMsg" :content="msgContent" @close="canShowMsg= false"></UniMsg>
    <UniTab title="Security & Backup"></UniTab>
    <div class="settings-box">
      <div class="settings-item-box" @click="isShowPhishingCodeDialog = true">
        <span>Anti-Phishing Code</span>
        <div class="arrow-right">
          <span>sea</span>
          <Iconfont name="arrow-right" width="12" height="14" color="#D8D8D8"></Iconfont>
        </div>
      </div>
      <div class="settings-item-box" @click="isShowTipsDialog = true">
        <span>Cancel All Authorized Permissions</span>
        <div class="arrow-right">
          <Iconfont name="arrow-right" width="12" height="14" color="#D8D8D8"></Iconfont>
        </div>
      </div>
      <div class="settings-item-box">
        <span>Backup Mnemonic</span>
        <div class="arrow-right">
          <Iconfont name="arrow-right" width="12" height="14" color="#D8D8D8"></Iconfont>
        </div>
      </div>
    </div>
    <Ironman></Ironman>
    <UniDialog class="phishingCodeDialog" :visible="isShowPhishingCodeDialog" title="Anti-Phishing Code" @cancel="isShowPhishingCodeDialog = false">
      <div class="slot-container">
        <UniInput
          ref="seaRef"
          v-model="sea"
          width="100%"
          background-color="#F7F8FA"
          class="uni-input mb-[58px]"
          validate-text="Supports up to 10 characters"
          placeholder="sea"
        ></UniInput>
        <UniBtn class="uni-btn" :disabled="!sea" @click="handlePhishingCodeCancel">
          Save
        </UniBtn>
      </div>
    </UniDialog>
    <UniDialog class="tipsDialog" :visible="isShowTipsDialog" title="Tips" @cancel="isShowTipsDialog = false">
      <div class="slot-container">
        <div class="text">
          Are you sure cancel all authorized permissions?
        </div>
        <UniBtn class="uni-btn" @click="handleTipsCancel">
          I got it
        </UniBtn>
      </div>
    </UniDialog>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PageSecurityAndBackup',
  setup () {
    const sea = ref('')
    const seaRef = ref(null)
    const canShowMsg = ref(false)
    const msgContent = ref('')
    const isShowPhishingCodeDialog = ref(false)
    const isShowTipsDialog = ref(false)
    const handlePhishingCodeCancel = () => {
      if (!sea.value) return
      if (sea.value.length > 10) {
        seaRef.value.validate()
        return false
      }
      isShowPhishingCodeDialog.value = false
      msgContent.value = 'Saved'
      canShowMsg.value = true
    }
    const handleTipsCancel = () => {
      isShowTipsDialog.value = false
      msgContent.value = 'Canceled'
      canShowMsg.value = true
    }
    return {
      sea,
      seaRef,
      canShowMsg,
      msgContent,
      isShowPhishingCodeDialog,
      isShowTipsDialog,
      handlePhishingCodeCancel,
      handleTipsCancel,
    }
  },
}
</script>
