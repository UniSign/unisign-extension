<style lang="scss" scoped>
.page-begin {
  position: relative;
  background-color: #DCE5F0;
  min-height: 630px;
  padding-bottom: 38px;
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
    margin: 16px auto 0px;
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
  .qr-code-box{
    .qr-code {
      margin: 42px auto 8px;
      display: block;
      width: 206px;
      height: 206px;
    }
    .qr-code-detail {
      margin: 0 auto 64px;
      padding: 8px 14px;
      position: relative;
      border: 1px solid rgba(191, 191, 191, 0.09);
      border-radius: 8px;
      width: 220px;
      font-size: $detail-font-size;
      font-weight: bold;
      text-align: center;
      line-height: 16px;
      word-wrap: break-word;
      word-break: break-all;
      cursor: pointer;
      background: #F9F7F6;
      &:hover {
        .popover {
          display: block;
        }
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
    <UniMsg :visible="canShowMsg" content="Copied" @close="canShowMsg= false"></UniMsg>
    <div class="top-bg"></div>
    <div ref="topLineBoxRef" class="top-line-box">
      <div class="icon-wrapper cursor-pointer" @click="onClickSettings">
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
      <div class="address-part">
        <h2>{{ currentUnikeyName }} Address</h2>
        <p>{{ currentUnikey?.key }}</p>
        <div>
          <div class="icon-wrapper mr-[16px] cursor-pointer copy-address" :data-clipboard-text="currentUnikey?.key" @click="handleCopyAddress">
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
    <img class="key-icon" :src="getImageUrl(currentUnikey?.keySymbol)">
    <div class="connect-box">
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
    <div class="await-connect-box">
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
    <Ironman></Ironman>
    <UniDialog class="qr-code-box" :visible="isShowQRCodeDialog" @cancel="handleQRCancel">
      <qrcode-vue class="qr-code" :value="currentUnikey?.key" :size="206" />
      <div class="qr-code-detail copy-address" :data-clipboard-text="currentUnikey?.key" @click="handleCopyAddress">
        {{ currentUnikey?.key }}
        <div class="popover popover-top">
          Copy Address
        </div>
      </div>
    </UniDialog>
    <switchKeyDialog v-if="isShowSwitchKeyDialog" @cancel="isShowSwitchKeyDialog = false" @hasSwitch="getCurrentUnikey"></switchKeyDialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ClipboardJS from 'clipboard'
import QrcodeVue from 'qrcode.vue'
import switchKeyDialog from './switchKeyDialog.vue'
import { wallet } from '~/ui/controllers/wallet'
import { HDKeyrings } from '~/constants'
import { CHAINS } from '~/constants'
import { getImageUrl } from '~/utils'

export default {
  name: 'PageBegin',
  components: {
    QrcodeVue,
    switchKeyDialog,
  },
  setup (props, context) {
    const router = useRouter()

    const canShowMsg = ref(false)

    // animation
    const iconFontColor = ref('#fff')
    const isScroll = ref(false)
    const topLineBoxRef = ref(null)
    onMounted(async () => {
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

    // settings
    const onClickSettings = () => {
      router.push('/settings')
    }

    // copy
    const handleCopyAddress = () => {
      const clipboard = new ClipboardJS('.copy-address')
      clipboard.on('success', (e) => {
        canShowMsg.value = true
        clipboard.destroy()
      })
      clipboard.on('error', (e) => {
        clipboard.destroy()
      })
    }

    const isShowQRCodeDialog = ref(false)
    const handleQRCancel = () => {
      isShowQRCodeDialog.value = false
    }

    // unikey
    const isShowSwitchKeyDialog = ref(false)
    const currentUnikey = ref(null)
    const currentUnikeyName = ref(null)
    async function getCurrentUnikey () {
      currentUnikey.value = await wallet.getCurrentUnikey()
      currentUnikeyName.value = CHAINS[currentUnikey.value.keySymbol].name
    }
    onMounted(async () => {
      await getCurrentUnikey()
    })

    return {
      canShowMsg,

      iconFontColor,
      isScroll,
      topLineBoxRef,

      onClickLock,
      onClickSettings,

      handleCopyAddress,

      isShowQRCodeDialog,
      handleQRCancel,

      isShowSwitchKeyDialog,
      getCurrentUnikey,
      currentUnikey,
      currentUnikeyName,
      getImageUrl,
    }
  },
}
</script>
