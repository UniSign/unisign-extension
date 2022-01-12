<style lang="scss" scoped>
.page-begin {
  position: relative;
  background-color: #DCE5F0;
  min-height: 630px;
  .top-bg {
    width: 100%;
    height: 201px;
    border-radius: 0px 0px 20px 20px;
    background: #534CDD;
  }
  .top-line-box {
    position: fixed;
    top: 0;
    transform: translateX(-50%);
    left: 50%;
    z-index: 999;
    width: 100%;
    height: 58px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 12px;
      background: transparent;
      &:hover {
        background: rgba(0, 0, 0, 0.06);
        .popover {
          display: block;
        }
      }
    }
  }
  .central-bg-1 {
    position: absolute;
    top: 294px;
    transform: translateX(-50%);
    left: 50%;
    width: 277px;
    height: 103px;
    box-shadow: 0px 6px 10px 0px rgba(141, 145, 156, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: #DCE5F0;
  }
  .central-bg-2 {
    position: absolute;
    top: 291px;
    transform: translateX(-50%);
    left: 50%;
    width: 295px;
    height: 103px;
    box-shadow: 0px 6px 10px 0px rgba(141, 145, 156, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: #DCE5F0;
  }
  .central-content {
    position: absolute;
    top: 122px;
    transform: translateX(-50%);
    left: 50%;
    box-shadow: 0px 6px 10px 0px rgba(141, 145, 156, 0.1);
    border-radius: 14px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    width: 310px;
    height: 267px;
    background: #E9EDF3;
    .begin-part {
      h2 {
        margin-top: 64px;
        text-align: center;
        font-size: $title-font-size;
        font-weight: 600;
        line-height: 29px;
      }
      p {
        margin-top: 16px;
        text-align: center;
        font-size: $detail-font-size;
        line-height: 16px;
        color: #8D919C;
      }
      .uni-btn {
        margin:52px auto 0;
        width: 230px;
        display: block;
      }
    }
    .address-part {
      h2 {
        margin-top: 64px;
        text-align: center;
        font-size: $detail-font-size;
        line-height: 16px;
      }
      p {
        margin: 16px auto 0;
        width: 256px;
        display: block;
        word-wrap: break-word;
        word-break: break-all;
        text-align: justify;
        font-size: $code-font-size;
        line-height: 29px;
        font-weight: 500;
        letter-spacing: 3px;
        color: #576C80;
      }
      >div {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 256px;
        height: 54px;
        display: flex;
        align-items: center;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
        .icon-wrapper {
          position: relative;
          width: 22px;
          height: 22px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 4px;
          background: #E9EDF3;
          &:hover {
            background: rgba(0, 0, 0, 0.06);
            .popover {
              display: block;
            }
          }
        }
        i {
          width: 1px;
          height: 16px;
          background: rgba(0, 0, 0, 0.06);
          border-radius: 1px;
        }
        .switch {
          margin-left: auto;
          padding: 0px 6px;
          border-radius: 4px;
          font-weight: 500;
          line-height: 22px;
          color: #6D88A1;
          background: rgba(255, 255, 255, 0.99);
          &:hover {
            background: rgba(0, 0, 0, 0.06);
          }
        }
      }
    }
  }
  .key-icon {
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    top: 74px;
    width: 100px;
    height: 100px;
  }
  .connect-box,.await-connect-box {
    position: relative;
    margin: 226px auto 0;
    display: block;
    padding: 6px;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    width: 310px;
    background: #FFFFFF;
    .status-item {
      margin-bottom: 13px;
      padding: 6px;
      display: flex;
      align-items: center;
      span {
        margin-left: 8px;
        font-size: $detail-font-size;
        color: #2ABA82;
      }
    }
    .connect-item {
      padding: 8px 6px;
      display: flex;
      align-items: center;
      border-radius: 6px;
      span {
        margin-left: 12px;
        font-size: $input-font-size;
        color: #8D919C;
      }
      >div {
        margin-left: auto;
        display: flex;
        align-items: center;
        >div {
          position: relative;
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 4px;
          cursor: pointer;
          &:hover {
            background: rgba(0, 0, 0, 0.06);
            .popover {
              display: block;
            }
          }
        }
      }
    }
  }
  .await-connect-box {
    margin: 16px auto 18px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.3);
    .status-item {
      span {
        color: #6F7684;
      }
    }
    .connect-item {
      >p {
        margin-left: 12px;
        font-size: $input-font-size;
        color: #8D919C;
        span {
          margin-left: 0px;
          color: #242C3F;
        }
      }
      &:hover {
        cursor: pointer;
        background-color: #fff;
      }
    }
  }
  >p {
    position: absolute;
    top: 577px;
    transform: translateX(-50%);
    left: 50%;
    font-size: $detail-font-size;
    line-height: 16px;
    color: #2A67C5;
    cursor: pointer;
  }
  .qr-code-box {
    padding: 24px;
    .qr-code {
      margin: 25px auto 15px;
      display: block;
      width: 206px;
      height: 206px;
    }
    .qr-code-detail {
      padding: 8px 14px;
      border: 1px solid rgba(191, 191, 191, 0.09);
      border-radius: 8px;
      font-size: $detail-font-size;
      font-weight: bold;
      text-align: center;
      line-height: 16px;
      word-wrap: break-word;
      word-break: break-all;
      background: #F9F7F6;
    }
  }
  .switch-key-box {
    padding-bottom: 61px;
    .switch-key-content {
      .derived-box,.imported-box {
        padding: 0 10px;
        margin-bottom: 8px;
        h2 {
          margin: 16px 0 8px 16px;
          font-size: $detail-font-size;
          line-height: 16px;
          color: #8D919C;
        }
        >div {
          padding: 11px 16px 11px 8px;
          display: flex;
          align-items: center;
          cursor: pointer;
          &:hover {
            background-color: #EEEEEE;
          }
          img {
            margin-right: 12px;
          }
          span {
            font-size: $detail-font-size;
            font-weight: bold;
            color: #242C3F;
            line-height: 16px;
          }
          .icon-font {
            margin-left: auto;
          }
        }
      }
    }
    .switch-key-btn-box{
      position: absolute;
      bottom: 0;
      padding: 12px;
      width: 100%;
      box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.06);
      .switch-key-btn {
        height: 37px;
      }
    }
  }
}

.popover {
  display: none;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 7px 11px;
  box-sizing: border-box;
  box-shadow: 0px -5px 6px 0px rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  font-size: $detail-font-size;
  font-weight: 500;
  white-space: nowrap;
  background: #11142D;
  color: #FFFFFF;
}

.popover-top {
  top: -42px;
  &:after {
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px 6px 0px;
    border-style: solid;
    border-color: #0D0C49 transparent transparent;
  }
}

.popover-bottom {
  bottom: -42px;
  &:after {
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 6px 6px;
    border-style: solid;
    border-color: transparent transparent #0D0C49;
  }
}
</style>

<template>
  <div class="page-begin">
    <div class="top-bg"></div>
    <div ref="topLineBoxRef" class="top-line-box">
      <div class="icon-wrapper cursor-pointer">
        <Iconfont name="settings" size="20" :color="iconFontColor"></Iconfont>
        <div class="popover popover-bottom">
          Settings
        </div>
      </div>
      <img class="w-[134px] h-[36px]" :src="`/assets/page-begin/nav-${isScroll?'logo-scroll':'logo'}.png`">
      <div class="icon-wrapper cursor-pointer" @click="onClickLock">
        <Iconfont name="lock" size="20" :color="iconFontColor"></Iconfont>
        <div class="popover popover-bottom">
          Lock
        </div>
      </div>
    </div>
    <div class="central-bg-1"></div>
    <div class="central-bg-2"></div>
    <div class="central-content">
      <div v-if="isBegin" class="begin-part">
        <h2>Let’s begin</h2>
        <p>Create or import a key to start.</p>
        <UniBtn class="uni-btn" @click="onClickSubmit">
          Add Keys
        </UniBtn>
      </div>
      <div v-else class="address-part">
        <h2>Bitcoin Address</h2>
        <p>0x2c238D3A7cd18E698DB5A4f7d5AdbeCc22B68a0e</p>
        <div>
          <div class="icon-wrapper mr-[16px] cursor-pointer">
            <Iconfont name="copy" size="13" color="#6D88A1"></Iconfont>
            <div class="popover popover-bottom">
              Copy Address
            </div>
          </div>
          <div class="icon-wrapper mr-[16px] cursor-pointer" @click="isShowQRCodeDialog = true">
            <Iconfont name="qrcode" size="13" color="#6D88A1"></Iconfont>
            <div class="popover popover-bottom">
              QR Code
            </div>
          </div>
          <i class="mr-[16px]"></i>
          <div class="icon-wrapper cursor-pointer">
            <Iconfont name="switch" size="13" color="#6D88A1"></Iconfont>
            <div class="popover popover-bottom">
              Transfer
            </div>
          </div>
          <div class="switch cursor-pointer" @click="isShowSwitchKeyDialog = true">
            Switch
          </div>
        </div>
      </div>
    </div>
    <img class="key-icon" src="/assets/page-begin/key-icon.png">
    <div v-if="!isBegin" class="connect-box">
      <div class="status-item">
        <Iconfont name="current" size="14"></Iconfont>
        <span>Current connect</span>
      </div>
      <div class="connect-item">
        <Iconfont name="connect" size="24"></Iconfont>
        <span>No Connect</span>
        <div>
          <div>
            <img class="w-[8px] h-[11px]" src="/assets/page-begin/icon-pin-true.png">
            <div class="popover popover-top">
              Pin
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isBegin" class="await-connect-box">
      <div class="status-item">
        <Iconfont name="connected" size="14" color="#6F7684"></Iconfont>
        <span>Connected Apps</span>
      </div>
      <div class="connect-item">
        <Iconfont name="connect" size="24"></Iconfont>
        <p>https://<span>mibao.com</span></p>
        <div>
          <div class="mr-[7px]">
            <img class="w-[16px] h-[16px]" src="/assets/page-begin/icon-disconnect.png">
            <div class="popover popover-top">
              Disconnect
            </div>
          </div>
          <div>
            <img class="w-[8px] h-[11px]" src="/assets/page-begin/icon-pin.png">
            <div class="popover popover-top">
              Pin
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-if="isBegin">
      How to use?
    </p>
    <Ironman :style="{'position':isBegin?'absolute':'relative'}"></Ironman>
    <UniDialog class="qr-code-box" :visible="isShowQRCodeDialog" @cancel="handleQRCancel">
      <div class="qr-code">
      </div>
      <div class="qr-code-detail">
        0xE7c00a33B82AfF42C8Ea4e7B41dB1ea09Dc4f6BD
      </div>
    </UniDialog>
    <UniDialog class="switch-key-box" :visible="isShowSwitchKeyDialog" title="Switch Key" @cancel="handleSwitchCancel">
      <div class="switch-key-content">
        <div class="derived-box">
          <h2>Derived from Mnemonic</h2>
          <div>
            <img class="w-[26px] h-[26px]" src="/assets/page-addAddress/key-bch.png">
            <span>0xydsh…38dfsdf</span>
            <Iconfont class="icon-font" name="checked" size="12" color="#FFBC5D"></Iconfont>
          </div>
        </div>
        <div class="imported-box">
          <h2>Imported</h2>
          <div>
            <img class="w-[26px] h-[26px]" src="/assets/page-addAddress/key-bch.png">
            <span>0xydsh…38dfsdf</span>
            <Iconfont class="icon-font" name="unchecked" size="12" color="#E1E1E1"></Iconfont>
          </div>
        </div>
      </div>
      <div class="switch-key-btn-box">
        <UniBtn class="switch-key-btn" @click="isShowSwitchKeyDialog = false">
          Add Key
        </UniBtn>
      </div>
    </UniDialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageBegin',
  setup (props, context) {
    const router = useRouter()
    const isBegin = ref(true)

    const iconFontColor = ref('#fff')
    const isScroll = ref(false)
    const topLineBoxRef = ref(null)
    onMounted(() => {
      window.onscroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        const transferScrollTop = scrollTop / 30
        if (scrollTop > 0) {
          isScroll.value = true
          iconFontColor.value = '#8D919C'
          topLineBoxRef.value.style.background = `rgba(255,255,255,${transferScrollTop})`
        }
        else {
          isScroll.value = false
          iconFontColor.value = '#fff'
          topLineBoxRef.value.style.background = 'rgba(255,255,255,0)'
        }
      }
    })
    onBeforeUnmount(() => {
      window.onscroll = null
    })

    // lock
    const isLocked = ref(false)
    async function onClickLock () {
      await wallet.lock()
      isLocked.value = await wallet.isLocked()
      isLocked.value && router.push('/locked')
    }

    const onClickSubmit = () => {
      router.push('/addAddress')
    }

    const isShowQRCodeDialog = ref(false)
    const handleQRCancel = () => {
      isShowQRCodeDialog.value = false
    }

    const isShowSwitchKeyDialog = ref(false)
    const handleSwitchCancel = () => {
      isShowSwitchKeyDialog.value = false
    }
    return {
      isBegin,

      iconFontColor,
      isScroll,
      topLineBoxRef,

      onClickLock,

      onClickSubmit,

      isShowQRCodeDialog,
      handleQRCancel,

      isShowSwitchKeyDialog,
      handleSwitchCancel,
    }
  },
}
</script>
