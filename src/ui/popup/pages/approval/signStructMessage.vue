<style lang="scss" scoped>
.main-title-box {
  margin:24px 0 8px;
  display: flex;
  justify-content: space-between;
  h2 {
    font-size: $detail-font-size;
    line-height: 16px;
    color: #6F7684;
  }
  p {
    font-size: $detail-font-size;
    line-height: 16px;
    color: #2A67C5;
    cursor: pointer;
  }
}
.main-message-box {
  border-radius: 8px;
  border: 1px solid #E4E9F0;
  background: #F1F4F8;
  .main-message-title{
    padding: 15px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: $detail-font-size;
    line-height: 16px;
    h2 {
      font-weight: 600;
    }
  }
  .main-message-content {
    margin: 0 12px;
    padding: 18px 0;
    border-top: 1px solid rgba(220, 229, 240, 0.5);
    display: flex;
    justify-content: space-between;
    font-size: $detail-font-size;
    font-weight: 600;
    line-height: 16px;
    word-wrap: break-word;
    word-break: break-all;
    h2 {
      width: 180px;
      text-align: right;
    }
  }
}
.raw-box {
  .raw-container {
    padding: 24px;
    border-radius: 8px;
    .jv-container {
      overflow: hidden;
      overflow-y: scroll;
      max-height: 244px;
      background: #F1F4F8;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>

<template>
  <div>
    <SignWrapper :title="$tt('Signature Request')" @reject="onClickReject" @allow="onClickAllow">
      <CurrentKeyBox></CurrentKeyBox>
      <div class="main-title-box">
        <h2>{{ $tt('Sign Typed Message') }}</h2>
        <p @click="isShowRawDialog = true">
          {{ $tt('View Raw') }}
        </p>
      </div>
      <div class="main-message-box">
        <div class="main-message-title">
          <span>{{ $tt('App') }}</span>
          <h2>{{ approval?.params.message.appName }}</h2>
        </div>
        <div class="main-message-content">
          <span>{{ $tt('Details') }}</span>
          <h2>{{ approval?.params.message.subject }}</h2>
        </div>
      </div>
    </SignWrapper>
    <UniDialog class="raw-box" :title="$tt('Message Detail')" :visible="isShowRawDialog" @cancel="handleRawCancel">
      <div class="raw-container">
        <json-viewer :value="approval?.params.message"></json-viewer>
      </div>
    </UniDialog>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import JsonViewer from 'vue-json-viewer'
import SignWrapper from './-/SignWrapper.vue'
import CurrentKeyBox from './-/CurrentKeyBox.vue'
import { SignStructMessageParams } from '~/background/controllers/provider/index'
import { ApprovalData } from '~/background/services/approval'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageSignTypedMessage',
  components: {
    SignWrapper,
    JsonViewer,
    CurrentKeyBox,
  },
  setup () {
    function onClickAllow () {
      wallet.resolveApproval()
    }

    function onClickReject () {
      wallet.rejectApproval()
    }

    const isShowRawDialog = ref(false)
    const handleRawCancel = () => {
      isShowRawDialog.value = false
    }
    const jsonData = ref({})
    const approval = ref<ApprovalData<SignStructMessageParams>| null>()

    onMounted(async () => {
      approval.value = await wallet.getApproval()
    })

    return {
      onClickReject,
      onClickAllow,

      isShowRawDialog,
      handleRawCancel,
      jsonData,

      approval,
    }
  },
}
</script>
