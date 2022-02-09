<style lang="scss">
.page-security-and-backup {
  .box-item {
    .box-item_head {
      width: 0;
    }
  }

  .setting-anti-fishing-desc {
    margin-right: 6px;
    font-size: $input-font-size;
    vertical-align: middle;
    font-weight: 500;
    color: #8D919C;
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
    <UniMsg :visible="canShowMsg" :content="msgContent" @close="canShowMsg= false" />
    <UniTab :title="$tt('Security & Backup')" />

    <BoxList :pad-top="82">
      <BoxItem @click="isShowPhishingCodeDialog = true">
        {{ $tt('Anti-Phishing Code') }}
        <template #tail>
          <span class="setting-anti-fishing-desc">{{ antiPhishingCode }}</span>
          <Iconfont name="arrow-right" width="12" height="14" color="#D8D8D8" />
        </template>
      </BoxItem>
    </BoxList>

    <BoxList>
      <BoxItem @click="isShowTipsDialog = true">
        {{ $tt('Cancel All Authorized Permissions') }}
      </BoxItem>
    </BoxList>

    <BoxList>
      <BoxItem @click="onClickViewMnemonic">
        {{ $tt('Backup Mnemonic') }}
      </BoxItem>
    </BoxList>

    <Ironman ref="ironmanRef" />
    <UniDialog class="phishingCodeDialog" :visible="isShowPhishingCodeDialog" :title="$tt('Anti-Phishing Code')" @cancel="isShowPhishingCodeDialog = false">
      <div class="slot-container">
        <UniInput
          ref="phishingCodeRef"
          v-model="phishingCode"
          width="100%"
          background-color="#F7F8FA"
          class="uni-input mb-[58px]"
          validate-text="Supports up to 10 characters"
          :placeholder="antiPhishingCode"
        />
        <UniBtn class="uni-btn" :disabled="!phishingCode" @click="handlePhishingCodeCancel">
          {{ $tt('Save') }}
        </UniBtn>
      </div>
    </UniDialog>
    <UniDialog class="tipsDialog" :visible="isShowTipsDialog" :title="$tt('Tips')" @cancel="isShowTipsDialog = false">
      <div class="slot-container">
        <div class="text">
          {{ $tt('Are you sure cancel all authorized permissions?') }}
        </div>
        <UniBtn class="uni-btn" @click="handleTipsCancel">
          {{ $tt('I got it') }}
        </UniBtn>
      </div>
    </UniDialog>
    <KeySettingsDialog ref="keySettingsDialogRef" />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import KeySettingsDialog from './-/KeySettingsDialog.vue'
import { wallet } from '~/ui/controllers/wallet'
import type UniInput from '~/ui/components/UniInput.vue'
import type Ironman from '~/ui/components/Ironman.vue'
import BoxList from '~/ui/components/Box/BoxList.vue'
import BoxItem from '~/ui/components/Box/BoxItem.vue'

export default {
  name: 'PageSecurityAndBackup',
  components: {
    KeySettingsDialog,
    BoxList,
    BoxItem,
  },
  setup () {
    const canShowMsg = ref(false)
    const msgContent = ref('')
    const i18n = useI18n()

    // antiPhishingCode
    const antiPhishingCode = ref('')
    const phishingCode = ref('')
    const phishingCodeRef = ref<InstanceType<typeof UniInput>>()
    const isShowPhishingCodeDialog = ref(false)
    const ironmanRef = ref<InstanceType<typeof Ironman>>()
    const onPhishingCodeChanged = async () => {
      antiPhishingCode.value = await wallet.getAntiPhishingCode()
    }
    const handlePhishingCodeCancel = async () => {
      if (!phishingCode.value) return
      if (phishingCode.value.length > 10) {
        phishingCodeRef.value?.validate()
        return
      }
      await wallet.setAntiPhishingCode(phishingCode.value)
      onPhishingCodeChanged()
      ironmanRef.value?.onAntiPhishingCodeChange()
      isShowPhishingCodeDialog.value = false
      msgContent.value = i18n.$tt('Saved')
      canShowMsg.value = true
    }
    onMounted(() => {
      onPhishingCodeChanged()
    })

    // viewMnemonic
    const keySettingsDialogRef = ref<InstanceType<typeof KeySettingsDialog>>()
    const onClickViewMnemonic = () => {
      keySettingsDialogRef.value?.onClickViewMnemonic()
    }

    const isShowTipsDialog = ref(false)
    const handleTipsCancel = () => {
      isShowTipsDialog.value = false
      wallet.clearAllPermission()
      msgContent.value = i18n.$tt('Canceled')
      canShowMsg.value = true
    }

    return {
      // Msg
      canShowMsg,
      msgContent,

      // antiPhishingCode
      antiPhishingCode,
      phishingCode,
      phishingCodeRef,
      isShowPhishingCodeDialog,
      ironmanRef,
      handlePhishingCodeCancel,

      // viewMnemonic
      keySettingsDialogRef,
      onClickViewMnemonic,

      isShowTipsDialog,
      handleTipsCancel,
    }
  },
}
</script>
