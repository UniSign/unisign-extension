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
    font-size: $detail-font-size;
    line-height: 16px;
    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
    h2 {
      font-weight: 600;
    }
  }
  .main-message-content{
    margin: 0 12px;
    padding: 20px 0px;
    border-top: 1px solid rgba(220, 229, 240, 0.5);
    font-size: $detail-font-size;
    line-height: 16px;
    word-wrap: break-word;
    word-break: break-all;
    .item {
      display: flex;
      justify-content: space-between;
      &+.item {
        margin-top: 20px;
      }
      h2 {
        text-align: right;
        color: #FF9100;
        font-weight: 600;
      }
      >div {
        p {
          font-weight: 600;
        }
      }
    }
  }
}
.vice-message-box {
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid #E4E9F0;
  background: #F1F4F8;
  .main-message-content{
    padding: 12px;
    font-size: $detail-font-size;
    line-height: 16px;
    word-wrap: break-word;
    word-break: break-all;
    .item {
      display: flex;
      justify-content: space-between;
      h2 {
        text-align: right;
        font-weight: 600;
      }
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
  <SignWrapper :title="$tt('Signature Request')" @reject="onClickReject" @allow="onClickAllow">
    <CurrentKeyBox></CurrentKeyBox>
    <div class="main-title-box">
      <h2>{{ $tt('Sign Bitcoin Transaction') }}</h2>
      <p @click="isShowRawDialog = true">
        {{ $tt('View Raw') }}
      </p>
    </div>
    <!-- todo: Not completed -->
    <div class="main-message-box">
      <div class="main-message-title">
        <img :src="`/assets/connect/icon-btc.png`">
        <h2>{{ $tt('Send BTC') }}</h2>
      </div>
      <div class="main-message-content">
        <div class="item">
          <span>{{ $tt('Amount') }}</span>
          <h2>10 BTC</h2>
        </div>
        <div class="item">
          <span>{{ $tt('To address') }}</span>
          <div>
            <p>1Bn1n…vRUPs  8 BTC</p>
            <p>16FsD…d4z4y  2 BTC</p>
          </div>
        </div>
      </div>
    </div>
    <div class="vice-message-box">
      <div class="main-message-content">
        <div class="item">
          <span>{{ $tt('Fee') }}</span>
          <h2>0.00015 BTC</h2>
        </div>
      </div>
    </div>
  </SignWrapper>
  <UniDialog class="raw-box" :title="$tt('Message Detail')" :visible="isShowRawDialog" @cancel="handleRawCancel">
    <div class="raw-container">
      <json-viewer :value="approval?.params.message"></json-viewer>
    </div>
  </UniDialog>
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
  name: 'PageSignTransaction',
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
