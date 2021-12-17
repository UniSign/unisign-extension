<style lang="scss" scoped>
.page-sign-transaction {
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
  <div class="page-sign-transaction">
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
        <h2>Sign Bitcoin Transaction</h2>
        <p>View Raw</p>
      </div>
      <div class="main-message-box">
        <div class="main-message-title">
          <img src="/assets/connect/icon-btc.png">
          <h2>Send BTC</h2>
        </div>
        <div class="main-message-content">
          <div class="item">
            <span>Amount</span>
            <h2>10 BTC</h2>
          </div>
          <div class="item">
            <span>To address</span>
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
            <span>Fee</span>
            <h2>0.00015 BTC</h2>
          </div>
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
  name: 'PageSignTransaction',
  setup () {
    return {
    }
  },
}
</script>
