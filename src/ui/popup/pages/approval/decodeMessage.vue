<style lang="scss" scoped>
.current-key-box {
  padding: 7px 8px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid rgba(191, 191, 191, 0.29);
  background: rgba(247, 245, 244, 0.9) rgba(255, 255, 255, 0.9);
  >img {
    margin-right: 5px;
    width: 26px;
    height: 26px;
  }
  >div {
    >p {
      margin-bottom: 4px;
      font-size: $detail-font-size;
      line-height: 16px;
      color: #8D919C;
    }
    >span {
      font-size: $detail-font-size;
      font-weight: 600;
      line-height: 16px;
      color: #6F7684;
    }
  }
}
.main-title-box {
  margin:24px 0 8px;
  display: flex;
  justify-content: space-between;
  h2 {
    font-size: $detail-font-size;
    line-height: 16px;
    color: #6F7684;
  }
}
.main-message-box {
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid #E4E9F0;
  background: #F1F4F8;
  font-size: $detail-font-size;
  line-height: 16px;
  font-weight: 500;
  word-wrap: break-word;
  word-break: break-all;
}
</style>

<template>
  <SignWrapper :title="$tt('Signature Request')" @reject="onRejectClick" @allow="onAllowClick">
    <div class="current-key-box">
      <img src="/assets/page-addAddress/key-btc.png">
      <div>
        <p>{{ $tt('Current Key') }}</p>
        <span>0xe7c00a33…a09dc4f6bd</span>
      </div>
    </div>
    <div class="main-title-box">
      <h2>{{ $tt('Decode Message') }}</h2>
      <h2>{{ $tt('3 Messages in total') }}</h2>
    </div>
    <div class="main-message-box">
      {{ $tt('Decentralized Account Systems') }}
    </div>
    <div class="main-message-box">
      {{ $tt('A future-proof, cross-chain decentralized account system') }}
    </div>
    <div class="main-message-box">
      {{ $tt('Unlike centralized account systems, such as cell phone numbers/email/social accounts, DAS offers a decentralized and open sourced approach to account systems. DAS can be used as a digital assets collection account, as an account for accessing general Internet services.') }}
    </div>
  </SignWrapper>
</template>

<script>
import { ref } from 'vue'
import SignWrapper from './-/SignWrapper.vue'

export default {
  name: 'PageDecodeMessage',
  components: {
    SignWrapper,
  },
  setup () {
    function onRejectClick (e) {
    }
    function onAllowClick (e) {
    }

    return {
      onRejectClick,
      onAllowClick,
    }
  },
}
</script>
