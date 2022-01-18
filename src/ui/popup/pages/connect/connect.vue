<style lang="scss" scoped>
h2 {
  margin: 24px 0 8px;
  font-size: $detail-font-size;
  font-weight: 400;
  line-height: 16px;
  color: #6F7684;
  &:nth-child(1) {
    margin-top: 0px;
  }
}
.website-detail-box {
  padding: 8px 12px;
  display: flex;
  border-radius: 8px;
  border: 1px solid #E4E9F0;
  background: #F1F4F8;
  >p {
    margin-left: 12px;
    font-size: $input-font-size;
    color: #8D919C;
    span {
      margin-left: 0px;
      color: #242C3F;
    }
  }
}
.connect-address-box {
  border-radius: 8px;
  border: 1px solid #E4E9F0;
  background: #F1F4F8;
  .connect-address-title {
    padding: 15px 9px;
    display: flex;
    align-items: center;
    img {
      margin-right: 7px;
      width: 26px;
      height: 26px;
    }
    span {
      font-size: $detail-font-size;
      font-weight: 600;
      line-height: 16px;
    }
  }
  .connect-address-content {
    margin: 0 12px;
    padding: 18px 0;
    border-top: 1px solid rgba(220, 229, 240, 0.5);
    font-size: $detail-font-size;
    font-weight: 600;
    line-height: 16px;
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>

<template>
  <signWrapper title="Connect Request" @rejectClick="onRejectClick" @allowClick="onAllowClick">
    <h2>
      Website
    </h2>
    <div class="website-detail-box">
      <Iconfont name="connect" size="24"></Iconfont>
      <p>https://<span>rarible.com</span></p>
    </div>
    <h2>Connect Address</h2>
    <div class="connect-address-box">
      <div class="connect-address-title">
        <img src="/assets/page-addAddress/key-btc.png">
        <span>BTC</span>
      </div>
      <div class="connect-address-content">
        0xE7c00a33B82AfF42C8Ea4e7B41dB1ea09Dc4f6BD
      </div>
    </div>
  </signWrapper>
</template>

<script>
import { ref } from 'vue'
import signWrapper from './signWrapper.vue'

export default {
  name: 'PageConnect',
  components: {
    signWrapper,
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
