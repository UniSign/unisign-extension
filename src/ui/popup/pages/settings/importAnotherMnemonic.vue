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
      color: #242C3F;
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
    <UniTab :title="$tt('Import Mnemonic')" />
    <div class="central-content">
      <h2>{{ $tt('Import Another Mnemonic') }}</h2>
      <p>
        {{ $tt('After importing another mnemonic, your current wallet account will be permanently deleted.') }}
        <span>{{ $tt('This action cannot be undone.') }} </span>
        {{ $tt('It is recommended that you back up before doing so.') }}
      </p>
      <UniTextArea
        ref="mnemonicRef"
        v-model="mnemonic"
        class="block mt-[32px] mx-auto"
        height="130px"
        :validate-text="$tt('Error Message')"
        :placeholder="$tt('Enter mnemonic, separated by space')"
      />
      <UniBtn :disabled="!mnemonic" error class="uni-btn" @click="onClickSubmit">
        {{ $tt('Confirm') }}
      </UniBtn>
    </div>
    <Ironman />
    <UniDialog class="securityDialog" :visible="isShowSecurityDialog" :title="$tt('Security Verification')" @cancel="isShowSecurityDialog = false">
      <div class="slot-container">
        <UniInput
          ref="passwordRef"
          v-model="password"
          password
          width="100%"
          background-color="#F7F8FA"
          class="uni-input mb-[58px]"
          :placeholder="$tt('Set a password')"
          :validate-text="validateText"
          @keyup.enter="onClickContinue"
        />
        <UniBtn class="uni-btn" @click="onClickContinue" />
      </div>
    </UniDialog>
  </div>
</template>

<script lang="ts">
import '~/background/polyfill'
import { ref } from 'vue'
import { validateMnemonic } from 'bip39'
import { useRouter } from 'vue-router'
import { wallet } from '~/ui/controllers/wallet'
import type UniTextArea from '~/ui/components/UniTextArea.vue'
import type UniInput from '~/ui/components/UniInput.vue'

export default {
  name: 'PageImportAnotherMnemonic',
  setup () {
    const router = useRouter()

    const mnemonic = ref('')
    const mnemonicRef = ref<InstanceType<typeof UniTextArea>>()
    const isShowSecurityDialog = ref(false)
    const onClickSubmit = () => {
      if (!mnemonic.value) return
      if (!validateMnemonic(mnemonic.value)) {
        mnemonicRef.value?.validate()
        return
      }
      isShowSecurityDialog.value = true
    }

    const password = ref('')
    const passwordRef = ref<InstanceType<typeof UniInput>>()
    const validateText = ref('')
    const onClickContinue = async () => {
      if (!password.value) return
      await wallet.verifyPassword(password.value).catch((e) => {
        validateText.value = e
        passwordRef.value?.validate()
        throw new Error(e)
      })
      await wallet.importMnemonic(mnemonic.value)
      isShowSecurityDialog.value = false
      router.push('/addAddress/addAddressSuccess')
    }

    return {
      mnemonic,
      mnemonicRef,
      isShowSecurityDialog,
      onClickSubmit,

      password,
      passwordRef,
      validateText,
      onClickContinue,
    }
  },
}
</script>
