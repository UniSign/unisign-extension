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
    :deep(.slot-container) {
      padding: 22px;
      .mnemonics {
        margin-bottom: 40px;
        .mnemonic-item {
          margin: 0 5px 8px 0;
          width: 86px;
          span {
            margin: 0 8px 0 5px;
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
        :deep(.reject) {
          border:none;
          background: #F7F8FA;
          color: #0D0C0C;
        }
        :deep(.allow) {
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
    <UniDialog class="dangerousDialog" error :visible="isShowDangerousDialog" :title="$tt('Dangerous Action')" @cancel="isShowDangerousDialog = false">
      <div class="slot-container">
        <div class="text">
          {{ dangerousText }}
        </div>
        <UniBtn class="uni-btn" error @click="handleDangerousCancel">
          {{ $tt('I got it') }}
        </UniBtn>
      </div>
    </UniDialog>

    <UniDialog class="securityDialog" :visible="isShowSecurityDialog" :title="$tt('Security Verification')" @cancel="isShowSecurityDialog = false">
      <div class="slot-container">
        <UniInput
          ref="passwordRef"
          v-model="password"
          password
          width="100%"
          background-color="#F7F8FA"
          class="uni-input mb-[58px]"
          :validate-text="validataText"
          :placeholder="$tt('Enter password')"
          @keyup.enter="onClickConfirmPassword"
        />
        <UniBtn class="uni-btn" :disabled="!password" @click="onClickConfirmPassword" />
      </div>
    </UniDialog>

    <UniDialog class="privateKeyDialog" :visible="isShowPrivateKeyDialog" :title="$tt('Private Key')" @cancel="isShowPrivateKeyDialog= false">
      <div class="slot-container">
        <div class="text">
          {{ selectedprivateKey }}
        </div>
        <UniBtn class="uni-btn" @click="handlePrivateKeyCancel">
          {{ $tt('OK') }}
        </UniBtn>
      </div>
    </UniDialog>

    <UniDialog class="mnemonicDialog" :visible="isShowMnemonicDialog" :title="$tt('Mnemonic')" @cancel="isShowMnemonicDialog= false">
      <div class="slot-container">
        <MnemonicBox class="mnemonics" :mnemonic-arr="mnemonicArr" />
        <UniBtn class="uni-btn" @click="handleMnemonicCancel">
          {{ $tt('OK') }}
        </UniBtn>
      </div>
    </UniDialog>

    <UniDialog class="deleteKeyDialog" error :visible="isShowDeleteKeyDialog" :title="$tt('Delete Key')" @cancel="isShowDeleteKeyDialog= false">
      <div class="slot-container">
        <p>{{ $tt('Confirm to delete,') }}</p>
        <p>{{ $tt('enter') }} <span>{{ $tt('Delete Key') }}</span> {{ $tt('below.') }}</p>
        <UniInput
          ref="deleteKeyRef"
          v-model="deleteKey"
          width="100%"
          background-color="#F7F8FA"
          class="uni-input mb-[48px]"
          :placeholder="$tt('Please enter Delete Key')"
          :validate-text="$tt('Incorrect input')"
        />
        <UniDoubleBtn class="uni-btn" :disabled="!deleteKey" @reject="isShowDeleteKeyDialog= false" @allow="handleDeleteKeyCancel">
          <template #reject>
            {{ $tt('Cancle') }}
          </template>
          <template #allow>
            {{ $tt('Delete') }}
          </template>
        </UniDoubleBtn>
      </div>
    </UniDialog>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MnemonicBox from '../../addAddress/-/MnemonicBox.vue'
import { wallet } from '~/ui/controllers/wallet'
import type UniInput from '~/ui/components/UniInput.vue'
import type { Unikey } from '~/background/services/unikey'

type CurrentEventName ='viewPrivateKey' | 'viewMnemonic' | 'deletePrivateKey' | null

export default {
  name: 'KeySettingsDialog',
  components: {
    MnemonicBox,
  },
  emits: ['onUnikeysChanged'],
  setup (props, context) {
    const isShowPrivateKeyDialog = ref(false)
    const isShowMnemonicDialog = ref(false)
    const isShowDeleteKeyDialog = ref(false)
    const i18n = useI18n()

    // securityDialog
    let currentEventName: CurrentEventName = null
    const currentUnikey = ref<Unikey | null>(null)
    const password = ref('')
    const passwordRef = ref<InstanceType<typeof UniInput>>()
    const validataText = ref('')
    const isShowSecurityDialog = ref(false)
    const selectedprivateKey = ref('')
    const mnemonicArr = ref<string[]>([])
    const onValidateError = (e: any) => {
      validataText.value = e
      passwordRef.value?.validate()
      throw new Error(e)
    }
    const onClickConfirmPassword = async () => {
      if (!password.value) return
      if (currentEventName === 'viewPrivateKey') {
        try {
          selectedprivateKey.value = await wallet.getPrivateKey(password.value, currentUnikey.value!.key, currentUnikey.value!.keyringType)
        }
        catch (e: any) {
          onValidateError(e)
        }
        isShowPrivateKeyDialog.value = true
      }
      else if (currentEventName === 'viewMnemonic') {
        let mnemonic = ''
        try {
          mnemonic = await wallet.getMnemonic(password.value)
        }
        catch (e: any) {
          onValidateError(e)
        }
        mnemonicArr.value = mnemonic.split(' ')
        isShowMnemonicDialog.value = true
      }
      else if (currentEventName === 'deletePrivateKey') {
        await wallet.removeUnikey(password.value, currentUnikey.value!).catch((e) => {
          onValidateError(e)
        })
        context.emit('onUnikeysChanged')
      }
      currentUnikey.value = null
      currentEventName = null
      password.value = ''
      isShowSecurityDialog.value = false
    }

    // dangerousDialog
    const isShowDangerousDialog = ref(false)
    const dangerousText = ref('')
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
    const onClickViewPrivateKey = (unikey: Unikey) => {
      currentUnikey.value = unikey
      currentEventName = 'viewPrivateKey'
      dangerousText.value = i18n.$tt('Do not disclose your private key to anyone. Anyone who has your private key can steal your assets.')
      isShowDangerousDialog.value = true
    }
    const handlePrivateKeyCancel = () => {
      isShowPrivateKeyDialog.value = false
    }

    // viewMnemonic
    const onClickViewMnemonic = () => {
      currentEventName = 'viewMnemonic'
      dangerousText.value = i18n.$tt('Do not disclose your mnemonic to anyone. Anyone who has your private key can steal your assets.')
      isShowDangerousDialog.value = true
    }
    const handleMnemonicCancel = () => {
      isShowMnemonicDialog.value = false
    }

    // deletePrivateKey
    const deleteKey = ref('')
    const deleteKeyRef = ref<InstanceType<typeof UniInput>>()
    const onClickDeletePrivateKey = (unikey: Unikey) => {
      currentUnikey.value = unikey
      currentEventName = 'deletePrivateKey'
      dangerousText.value = i18n.$tt('You may lost your asset if you are not backup properly.')
      isShowDangerousDialog.value = true
    }
    const handleDeleteKeyCancel = () => {
      if (deleteKey.value.toLowerCase() !== 'delete key') {
        deleteKeyRef.value?.validate()
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
      onClickConfirmPassword,

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
