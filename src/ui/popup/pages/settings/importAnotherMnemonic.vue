<style lang="scss" scoped>
.page-import-another-mnemonic {
  position: relative;
  width: 100%;
  height: 100%;
  .central-content {
    padding: 58px 24px 0;
    h2 {
      margin-top: 32px;
      font-size: $title-font-size;
      font-weight: bold;
      line-height: 29px;
      text-align: center;
    }
    p {
      margin-top: 16px;
      font-size: $detail-font-size;
      line-height: 16px;
      text-align: center;
      color: #6F7684;
      span {
        color: #EE5757;
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
  .securityDialog {
    .slot-container {
      padding: 32px 24px 24px;
    }
  }
}
</style>

<template>
  <div class="page-import-another-mnemonic">
    <UniTab title="Import Mnemonic"></UniTab>
    <div class="central-content">
      <h2>Import another Mnemonic</h2>
      <p>After importing another helper phrase, your current wallet account will be permanently deleted. <span>This action cannot be undone</span>. It is recommended that you back up before doing so.</p>
      <UniTextArea
        ref="mnemonicRef"
        v-model="mnemonic"
        class="block mt-[32px] mx-auto"
        height="130px"
        validate-text="Error Message"
        placeholder="Enter mnemonic, separated by space"
      ></UniTextArea>
      <UniBtn :disabled="!mnemonic" error class="uni-btn" @click="onClickSubmit">
        Confirm
      </UniBtn>
    </div>
    <Ironman></Ironman>
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
        <UniBtn class="uni-btn" @click="handleSecurityCancel">
        </UniBtn>
      </div>
    </UniDialog>
  </div>
</template>

<script>
import '~/background/polyfill'
import { ref } from 'vue'
import { validateMnemonic } from 'bip39'
import { useRouter } from 'vue-router'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageImportAnotherMnemonic',
  setup () {
    const router = useRouter()

    const mnemonic = ref('')
    const mnemonicRef = ref(null)
    const isShowSecurityDialog = ref(false)
    const onClickSubmit = () => {
      if (!mnemonic.value) return
      if (!validateMnemonic(mnemonic.value)) {
        mnemonicRef.value.validate()
        return
      }
      isShowSecurityDialog.value = true
    }

    const password = ref('')
    const passwordRef = ref(null)
    const validataText = ref('')
    const handleSecurityCancel = async () => {
      if (!password.value) return
      await wallet.verifyPassword(password.value).catch((e) => {
        validataText.value = e
        passwordRef.value.validate()
        throw new Error(e)
      })
      await wallet.importMnemonic(mnemonic.value)
      isShowSecurityDialog.value = false
      router.push('/addAddressSuccess')
    }

    return {
      mnemonic,
      mnemonicRef,
      isShowSecurityDialog,
      onClickSubmit,

      password,
      passwordRef,
      validataText,
      handleSecurityCancel,
    }
  },
}
</script>
