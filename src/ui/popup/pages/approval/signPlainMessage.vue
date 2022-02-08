<style lang="scss" scoped>
h2 {
  margin:24px 0 8px;
  font-size: $detail-font-size;
  line-height: 16px;
  color: #6F7684;
}
.sign-plain-message-box {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #E4E9F0;
  background: #F1F4F8;
  font-size: $detail-font-size;
  font-weight: 500;
  line-height: 16px;
  word-wrap: break-word;
  word-break: break-all;
  color: #242C3F;
}
.tips-box {
  padding: 0 24px;
  position: fixed;
  bottom: 106px;
  display: flex;
  p {
    margin-left: 8px;
    line-height: 14px;
    color: #EE5757;
  }
}
</style>

<template>
  <SignWrapper :title="$tt('Signature Request')" @reject="onClickReject" @allow="onClickAllow">
    <CurrentKeyBox></CurrentKeyBox>
    <h2>{{ $tt('Sign Plain Message') }}</h2>
    <div class="sign-plain-message-box">
      {{ approval?.params.message }}
    </div>
    <div class="tips-box">
      <div>
        💡
      </div>
      <p>{{ $tt('DO NOT sign any plain message which you don’t know about it’s real means.') }}</p>
    </div>
  </SignWrapper>
</template>

<script lang="ts">
import { ref } from 'vue'
import SignWrapper from './-/SignWrapper.vue'
import CurrentKeyBox from './-/CurrentKeyBox.vue'
import { SignPlainMessageParams } from '~/background/controllers/provider/index'
import { ApprovalData } from '~/background/services/approval'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageSignPlainMessage',
  components: {
    SignWrapper,
    CurrentKeyBox,
  },
  setup () {
    function onClickAllow () {
      wallet.resolveApproval()
    }

    function onClickReject () {
      wallet.rejectApproval()
    }

    const approval = ref<ApprovalData<SignPlainMessageParams>|null>()

    onMounted(async () => {
      approval.value = await wallet.getApproval()
    })

    return {
      approval,

      onClickReject,
      onClickAllow,
    }
  },
}
</script>
