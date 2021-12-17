<style lang="scss" scoped>
.page-connect {
  position: relative;
  width: 100%;
  height: 100%;
  .top-bg {
    padding-top: 24px;
    width: 100%;
    height: 133px;
    background: #534CDD;
    h2 {
      text-align: center;
      font-size: $title-font-size;
      font-weight: bold;
      line-height: 29px;
      color: #FFFFFF;
    }
  }
  .central-content {
    padding: 0 24px;
    position: absolute;
    top: 83px;
    width: 100%;
    height: 507px;
    border-radius: 12px;
    background: #FFFFFF;
    >h2 {
      margin: 24px 0 8px;
      font-size: $detail-font-size;
      font-weight: 400;
      line-height: 16px;
      color: #6F7684;
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
  }
  .btn-box {
    padding: 12px 0;
    position: absolute;
    bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.08);
    .reject {
      margin-right: 20px;
      width: 141px;
      border: 1px solid rgba(221, 76, 76, 0.1);
      background: rgba(221, 76, 76, 0.05);
      color: #D45D5D;
    }
    .allow {
      width: 141px;
    }
  }
}
</style>

<template>
  <div class="page-connect">
    <div class="top-bg">
      <h2>Connect Request</h2>
    </div>
    <div class="central-content">
      <h2>Website</h2>
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
    </div>
    <div class="btn-box">
      <UniBtn class="reject">
        Reject
      </UniBtn>
      <UniBtn class="allow">
        Allow
      </UniBtn>
    </div>
    <Ironman></Ironman>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PageConnect',
  setup () {
    return {
    }
  },
}
</script>
