<style lang="scss" scoped>
.page-sign-typed-message {
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
    padding: 24px 24px 0;
    position: absolute;
    top: 83px;
    width: 100%;
    height: 507px;
    border-radius: 12px;
    background: #FFFFFF;
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
  <div class="page-sign-typed-message">
    <div class="top-bg">
      <h2>Signature Request</h2>
    </div>
    <div class="central-content">
      <div class="current-key-box">
        <img src="/assets/page-addAddress/key-btc.png">
        <div>
          <p>Current Key</p>
          <span>0xe7c00a33…a09dc4f6bd</span>
        </div>
      </div>
      <div class="main-title-box">
        <h2>Sign Typed Message</h2>
        <p>View Raw</p>
      </div>
      <div class="main-message-box">
        <div class="main-message-title">
          <span>App</span>
          <h2>DAS</h2>
        </div>
        <div class="main-message-content">
          <span>Details</span>
          <h2>Transfer Owner of jack.bit to 0xE7c00a33B82AfF42C8Ea4e7B41dB1ea09Dc4f6BD</h2>
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
  name: 'PageSignTypedMessage',
  setup () {
    return {
    }
  },
}
</script>
