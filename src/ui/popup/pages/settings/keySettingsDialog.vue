<style lang="scss" scoped>
.key-settings-dialog{
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
  <div class="key-settings-dialog">
    <UniDialog class="dangerousDialog" error :visible="isShowDangerousDialog" title="Dangerous Action" @cancel="isShowDangerousDialog = false">
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
          :validate-text="validataText"
        ></UniInput>
        <UniBtn class="uni-btn" :disabled="!password" @click="handleSecurityCancel">
        </UniBtn>
      </div>
    </UniDialog>
    <UniDialog class="privateKeyDialog" :visible="isShowPrivateKeyDialog" title="Private Key" @cancel="isShowPrivateKeyDialog= false">
      <div class="slot-container">
        <div class="text">
          {{ selectedprivateKey }}
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
        <UniDoubleBtn class="uni-btn" :disabled="!deleteKey" @rejectClick="isShowDeleteKeyDialog= false" @allowClick="handleDeleteKeyCancel">
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
import { ref } from 'vue'
import { wallet } from '~/ui/controllers/wallet'
import { HDKeyrings } from '~/constants'
import { getImageUrl, substringKey } from '~/utils'

export default {
  name: 'KeySettingsDialog',
  emits: ['onUnikeysChanged'],
  setup (props, context) {
    const isShowPrivateKeyDialog = ref(false)
    const isShowMnemonicDialog = ref(false)
    const isShowDeleteKeyDialog = ref(false)

    // securityDialog
    let currentEventName = null
    const currentUnikey = ref({})
    const password = ref('')
    const passwordRef = ref(null)
    const validataText = ref('')
    const isShowSecurityDialog = ref(false)
    const selectedprivateKey = ref(null)
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
    const onValidateError = (e) => {
      validataText.value = e
      passwordRef.value.validate()
      throw new Error(e)
    }
    const handleSecurityCancel = async () => {
      if (!password.value) return
      if (currentEventName === 'viewPrivateKey') {
        selectedprivateKey.value = await wallet.getPrivateKey(password.value, currentUnikey.value.key, currentUnikey.value.keyringType).catch((e) => {
          onValidateError(e)
        })
        isShowPrivateKeyDialog.value = true
      }
      else if (currentEventName === 'viewMnemonic') {
        const mnemonic = await wallet.getMnemonic(password.value).catch((e) => {
          onValidateError(e)
        })
        // Error
        console.log(mnemonic, 'mnemonic')
        mnemonicArr.value = mnemonic.split(' ')
        isShowMnemonicDialog.value = true
      }
      else if (currentEventName === 'deletePrivateKey') {
        selectedprivateKey.value = await wallet.removeUnikey(password.value, currentUnikey.value).catch((e) => {
          onValidateError(e)
        })
        context.emit('onUnikeysChanged')
      }
      currentUnikey.value = {}
      currentEventName = null
      password.value = ''
      isShowSecurityDialog.value = false
    }

    // dangerousDialog
    const isShowDangerousDialog = ref(false)
    const dangerousText = ref('Do not disclose your private key to anyone. Anyone who has your private key can steal your assets.')
    const handleDangerousCancel = () => {
      isShowDangerousDialog.value = false
      if (currentEventName === 'viewPrivateKey' || currentEventName === 'viewMnemonic') {
        isShowSecurityDialog.value = true
      }
      else if (currentEventName === 'deletePrivateKey') {
        isShowDeleteKeyDialog.value = true
      }
    }

    // viewPrivateKey
    const onClickViewPrivateKey = (unikey) => {
      currentUnikey.value = unikey
      currentEventName = 'viewPrivateKey'
      isShowDangerousDialog.value = true
    }
    const handlePrivateKeyCancel = () => {
      isShowPrivateKeyDialog.value = false
    }

    // viewMnemonic
    const onClickViewMnemonic = () => {
      currentEventName = 'viewMnemonic'
      isShowDangerousDialog.value = true
    }
    const handleMnemonicCancel = () => {
      isShowMnemonicDialog.value = false
    }

    // deletePrivateKey
    const deleteKey = ref(null)
    const deleteKeyRef = ref(null)
    const onClickDeletePrivateKey = (unikey) => {
      currentUnikey.value = unikey
      currentEventName = 'deletePrivateKey'
      dangerousText.value = 'You may lost your asset if you are not backup properly.'
      isShowDangerousDialog.value = true
    }
    const handleDeleteKeyCancel = () => {
      if (deleteKey.value.toLowerCase() !== 'delete key') {
        deleteKeyRef.value.validate()
        return
      }
      deleteKey.value = ''
      isShowDeleteKeyDialog.value = false
      isShowSecurityDialog.value = true
    }

    return {
      // securityDialog
      password,
      passwordRef,
      validataText,
      isShowSecurityDialog,
      mnemonicArr,
      handleSecurityCancel,

      // dangerousDialog
      isShowDangerousDialog,
      dangerousText,
      handleDangerousCancel,

      // viewPrivateKey
      selectedprivateKey,
      isShowPrivateKeyDialog,
      onClickViewPrivateKey,
      handlePrivateKeyCancel,

      // viewMnemonic
      isShowMnemonicDialog,
      onClickViewMnemonic,
      handleMnemonicCancel,

      // deletePrivateKey
      deleteKey,
      deleteKeyRef,
      isShowDeleteKeyDialog,
      onClickDeletePrivateKey,
      handleDeleteKeyCancel,
    }
  },
}
</script>
