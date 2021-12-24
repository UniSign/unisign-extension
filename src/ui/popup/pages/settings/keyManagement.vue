<style lang="scss" scoped>
.page-key-management {
  position: relative;
  width: 100%;
  height: 100%;
  .settings-box {
    padding: 0 8px;
    h2 {
      margin: 16px 0 8px 16px;
      font-size: $detail-font-size;
      line-height: 16px;
      color: #8D919C;
    }
    .settings-item-box {
      position: relative;
      margin-bottom: 8px;
      padding: 11px 16px 11px 8px;
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      border-radius: 8px;
      cursor: pointer;
      img {
        margin-right: 12px;
        width: 26px;
        height: 26px;
      }
      &:hover {
        background: #F0EDED;
      }
      span {
        font-size: $input-font-size;
        font-weight: bold;
      }
      .arrow-right {
        margin-left: auto;
        width: 28px;
        height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        &:hover {
          background: rgba(36, 44, 63, 0.06);
        }
      }
      .popover {
        position: absolute;
        z-index: 1;
        top: 42px;
        right: 8px;
        padding: 4px;
        box-sizing: border-box;
        box-shadow: 0px 19px 22px 0px rgba(141, 145, 156, 0.3);
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.12);
        font-size: $input-font-size;
        background: #ffffff;
        div {
          padding: 8px;
          width: 100%;
          height: 32px;
          line-height: 16px;
          &:hover {
            background: #EEEEEE;
          }
        }
      }
    }
  }
  .dangerousDialog {
    .slot-container {
      padding: 24px;
      .text{
        margin-bottom: 48px;
        font-size: $input-font-size;
        line-height: 22px;
      }
    }
  }
  .securityDialog {
    .slot-container {
      padding: 32px 24px 24px;
    }
  }
  .privateKeyDialog {
    .slot-container {
      padding: 24px;
      .text{
        margin-bottom: 48px;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid rgba(191, 191, 191, 0.09);
        font-weight: bold;
        font-size: $input-font-size;
        line-height: 20px;
        word-wrap: break-word;
        word-break: break-all;
        background: #F9F7F6;
      }
    }
  }
  .mnemonicDialog {
    .slot-container {
      padding: 24px;
      .mnemonic-box {
        margin-bottom: 40px;
        display: flex;
        flex-wrap: wrap;
        .mnemonic-item {
          margin: 0 5px 8px 0;
          width: 86px;
          height: 32px;
          box-sizing: border-box;
          border-radius: 4px;
          border: 1px solid rgba(191, 191, 191, 0.09);
          display: flex;
          align-items: center;
          background: #F9F7F6;
          &:nth-child(3n) {
            margin: 0 0 8px 0;
          }
          span {
            margin: 0 9px 0 8px;
            line-height: 14px;
            color: #C9CCD3;
          }
          p {
            font-size: $detail-font-size;
            font-weight: bold;
            line-height: 16px;
          }
        }
      }
    }
  }
  .deleteKeyDialog {
    .slot-container {
      padding: 24px;
      >p {
        font-size: $main-font-size;
        line-height: 21px;
        &:nth-child(2) {
          margin-bottom: 16px;
        }
        >span {
          font-size: $main-font-size;
          line-height: 21px;
          color: $error-btn-bg;
        }
      }
      .uni-btn {
        ::v-deep .reject {
          border:none;
          background: #F7F8FA;
          color: #0D0C0C;
        }
        ::v-deep .allow {
          border:none;
          background: #EE5757;
        }
      }
    }
  }
}

</style>

<template>
  <div class="page-key-management">
    <UniTab title="Key Management"></UniTab>
    <div class="settings-box">
      <h2>Derived from Mnemonic</h2>
      <div v-for="(item,index) in derivedMnemonicArr" :key="index" class="settings-item-box">
        <img src="/assets/page-addAddress/key-btc.png">
        <span>{{ item.value }}</span>
        <div class="arrow-right" @click="item.isSetting = !item.isSetting">
          <Iconfont name="more" width="12" height="12" color="#6F7684"></Iconfont>
        </div>
        <div v-show="item.isSetting" class="popover">
          <div>Disabled</div>
          <div @click="isShowPrivateKeyDialog = true;item.isSetting = false">
            View  Private Key
          </div>
          <div @click="isShowMnemonicDialog = true;item.isSetting = false">
            View Mnemonic
          </div>
        </div>
      </div>
      <h2>Imported</h2>
      <div v-for="(item,index) in importedArr" :key="index" class="settings-item-box">
        <img src="/assets/page-addAddress/key-btc.png">
        <span>{{ item.value }}</span>
        <div class="arrow-right" @click="item.isSetting = !item.isSetting">
          <Iconfont name="more" width="12" height="12" color="#6F7684"></Iconfont>
        </div>
        <div v-show="item.isSetting" class="popover">
          <div @click="isShowDeleteKeyDialog = true;item.isSetting = false">
            Delete
          </div>
          <div @click="isShowPrivateKeyDialog = true;item.isSetting = false">
            View  Private Key
          </div>
        </div>
      </div>
    </div>
    <Ironman></Ironman>
    <UniDialog class="dangerousDialog" error :visible="isShowDangerousDialog" title="Dangerous Action" @cancel="handleDangerousCancel">
      <div class="slot-container">
        <div class="text">
          {{ dangerousText }}
        </div>
        <UniBtn class="uni-btn" error @click="handleDangerousCancel">
          I got it
        </UniBtn>
      </div>
    </UniDialog>
    <UniDialog class="securityDialog" :visible="isShowSecurityDialog" title="Security Verification" @cancel="isShowSecurityDialog = false">
      <div class="slot-container">
        <UniInput
          ref="passwordRef"
          v-model="password"
          width="100%"
          background-color="#F7F8FA"
          class="uni-input mb-[58px]"
          validate-text="Incorrect password"
        ></UniInput>
        <UniBtn class="uni-btn" @click="handleSecurityCancel">
        </UniBtn>
      </div>
    </UniDialog>
    <UniDialog class="privateKeyDialog" :visible="isShowPrivateKeyDialog" title="Private Key" @cancel="isShowPrivateKeyDialog= false">
      <div class="slot-container">
        <div class="text">
          aff3fa04927b6c2e5d45e04a2e98ebi16b6680dbb84a7faf470fcd4e88079fa7
        </div>
        <UniBtn class="uni-btn" @click="handlePrivateKeyCancel">
          OK
        </UniBtn>
      </div>
    </UniDialog>
    <UniDialog class="mnemonicDialog" :visible="isShowMnemonicDialog" title="Mnemonic" @cancel="isShowMnemonicDialog= false">
      <div class="slot-container">
        <div class="mnemonic-box">
          <div v-for="(item,index) in mnemonicArr" :key="index" class="mnemonic-item">
            <span>{{ index+1 }}</span>
            <p>{{ item }}</p>
          </div>
        </div>
        <UniBtn class="uni-btn" @click="handleMnemonicCancel">
          OK
        </UniBtn>
      </div>
    </UniDialog>
    <UniDialog class="deleteKeyDialog" error :visible="isShowDeleteKeyDialog" title="Delete Key" @cancel="isShowDeleteKeyDialog= false">
      <div class="slot-container">
        <p>Confirm to delete,</p>
        <p>enter <span>Delete Key</span> below.</p>
        <UniInput
          ref="deleteKeyRef"
          v-model="deleteKey"
          width="100%"
          background-color="#F7F8FA"
          class="uni-input mb-[48px]"
          placeholder="Please enter Delete Key"
          validate-text="Incorrect input"
        ></UniInput>
        <UniDoubleBtn class="uni-btn" :disabled="!deleteKey">
          <template #reject>
            Cancle
          </template>
          <template #allow>
            Delete
          </template>
        </UniDoubleBtn>
      </div>
    </UniDialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'PageKeyManagement',
  setup () {
    const password = ref('')
    const passwordRef = ref(null)
    const deleteKey = ref(null)
    const deleteKeyRef = ref(null)
    const derivedMnemonicArr = reactive([
      { key: 'keys', value: '0xydsh…38dfsdf', status: 'disabled', isSetting: false },
      { key: 'keys', value: '0xydsh…38dfsdf', status: 'disabled', isSetting: false },
      { key: 'keys', value: '0xydsh…38dfsdf', status: 'disabled', isSetting: false },
    ])
    const importedArr = reactive([
      { key: 'keys', value: '0xydsh…38dfsdf', status: 'disabled', isSetting: false },
      { key: 'keys', value: '0xydsh…38dfsdf', status: 'disabled', isSetting: false },
      { key: 'keys', value: '0xydsh…38dfsdf', status: 'disabled', isSetting: false },
    ])
    const mnemonicArr = ref([
      'defense',
      'light',
      'accident',
      'opinion',
      'benefit',
      'match',
      'trim',
      'slogan',
      'festival',
      'during',
      'cheap',
      'mix',
    ])
    const isShowDangerousDialog = ref(false)
    const isShowSecurityDialog = ref(false)
    const isShowPrivateKeyDialog = ref(false)
    const isShowMnemonicDialog = ref(false)
    const isShowDeleteKeyDialog = ref(false)
    const dangerousText = ref('Do not disclose your private key to anyone. Anyone who has your private key can steal your assets.')
    dangerousText.value = 'You may lost your asset if you are not backup properly.'
    const handleDangerousCancel = () => {
      isShowDangerousDialog.value = false
    }
    const handleSecurityCancel = () => {
      if (!password.value) return
      if (password.value !== 1) {
        passwordRef.value.validate()
      }
      isShowSecurityDialog.value = false
    }
    const handlePrivateKeyCancel = () => {
      isShowPrivateKeyDialog.value = false
    }
    const handleMnemonicCancel = () => {
      isShowMnemonicDialog.value = false
    }
    return {
      password,
      passwordRef,
      deleteKey,
      deleteKeyRef,
      derivedMnemonicArr,
      importedArr,
      isShowDangerousDialog,
      isShowSecurityDialog,
      isShowPrivateKeyDialog,
      isShowMnemonicDialog,
      isShowDeleteKeyDialog,
      handleDangerousCancel,
      handleSecurityCancel,
      handlePrivateKeyCancel,
      handleMnemonicCancel,
      mnemonicArr,
      dangerousText,
    }
  },
}
</script>
