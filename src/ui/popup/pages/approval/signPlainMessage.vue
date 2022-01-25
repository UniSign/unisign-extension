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
  <SignWrapper :title="$tt('Signature Request')" @reject="onRejectClick" @allow="onAllowClick">
    <div class="current-key-box">
      <img src="/assets/page-addAddress/key-btc.png">
      <div>
        <p>{{ $tt('Current Key') }}</p>
        <span>0xe7c00a33…a09dc4f6bd</span>
      </div>
    </div>
    <h2>{{ $tt('Sign Plain Message') }}</h2>
    <div class="sign-plain-message-box">
      0xE7c00a33B82AfF42C8Ea4e7B41dB1ea09Dc4f6BD
    </div>
    <div class="tips-box">
      <div>
        💡
      </div>
      <p>{{ $tt('DO NOT sign any plain message which you don’t know about it’s real means.') }}</p>
    </div>
  </SignWrapper>
</template>

<script>
import { ref } from 'vue'
import SignWrapper from './-/SignWrapper.vue'

export default {
  name: 'PageSignPlainMessage',
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
