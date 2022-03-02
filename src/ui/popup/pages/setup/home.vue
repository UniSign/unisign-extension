<style lang="scss" scoped>
.page-home {
  position: relative;
  background-color: #DCE5F0;
  min-height: 600px;
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
    z-index: 9;
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
        .tooltip {
          display: block;
        }
      }
    }
  }
  .central-bg-1 {
    position: absolute;
    top: 292px;
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
    top: 289px;
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
      .address-title {
        margin-top: 64px;
        text-align: center;
        font-size: $detail-font-size;
        line-height: 16px;
        color: #6D88A1;
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
        font-family: monospace;
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
        border-top: 1px solid rgba(36, 44, 63, 0.05);
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
            .tooltip {
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
      margin: 42px auto 16px;
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

      span {
        font-size: 14px;
        font-weight: bold;
        font-family: monospace;

        &:hover {
          opacity: 0.5;
        }
      }

      &:hover {
        .tooltip {
          display: block;
        }
      }
    }
  }
}

</style>

<template>
  <div class="page-home">
    <UniMsg :visible="canShowMsg" :content="$tt('Copied')" @close="canShowMsg= false" />
    <div class="top-bg" />
    <div ref="topLineBoxRef" class="top-line-box">
      <div class="icon-wrapper cursor-pointer" @click="onClickSettings">
        <Iconfont name="settings" size="20" :color="iconFontColor" />
        <Tooltip bottom>
          {{ $tt('Settings') }}
        </Tooltip>
      </div>
      <img class="w-[134px] h-[36px]" :src="`/assets/page-home/nav-${isScroll?'logo-scroll':'logo'}.png`">
      <div class="icon-wrapper cursor-pointer" @click="onClickLock">
        <Iconfont name="lock" size="20" :color="iconFontColor" />
        <Tooltip bottom>
          {{ $tt('Lock') }}
        </Tooltip>
      </div>
    </div>
    <div class="central-bg-1" />
    <div class="central-bg-2" />
    <div class="central-content">
      <div class="address-part">
        <h2 class="address-title">
          {{ currentUnikeyName }} {{ $tt('Address') }}
        </h2>
        <p>{{ currentUnikey?.key }}</p>
        <div>
          <div class="icon-wrapper mr-[16px] cursor-pointer copy-address" :data-clipboard-text="currentUnikey?.key" @click="handleCopyAddress">
            <Iconfont name="copy" size="13" color="#6D88A1" />
            <Tooltip bottom>
              {{ $tt('Copy Address') }}
            </Tooltip>
          </div>
          <div class="icon-wrapper mr-[16px] cursor-pointer" @click="isShowQRCodeDialog = true">
            <Iconfont name="qrcode" size="13" color="#6D88A1" />
            <Tooltip bottom>
              {{ $tt('QR Code') }}
            </Tooltip>
          </div>
          <i class="mr-[16px]" />
          <div class="icon-wrapper cursor-pointer" @click="onClickTransfer">
            <Iconfont name="switch" size="13" color="#6D88A1" />
            <Tooltip bottom>
              {{ $tt('Transfer') }}
            </Tooltip>
          </div>
          <div class="switch cursor-pointer" @click="isShowSwitchKeyDialog = true">
            {{ $tt('Switch') }}
          </div>
        </div>
      </div>
    </div>
    <img class="key-icon" :src="getImageUrl(currentUnikey?.keySymbol)">
    <ConnectSites />
    <Ironman />
    <UniDialog class="qr-code-box" :title="$tt('Account Detail')" :visible="isShowQRCodeDialog" @cancel="handleQRCancel">
      <qrcode-vue class="qr-code" :value="currentUnikey?.key" :size="206" />
      <div class="qr-code-detail copy-address" :data-clipboard-text="currentUnikey?.key" @click="handleCopyAddress">
        <span>{{ currentUnikey?.key }}</span>
        <Tooltip bottom>
          {{ $tt('Copy Address') }}
        </Tooltip>
      </div>
    </UniDialog>
    <SwitchKeyDialog :visible="isShowSwitchKeyDialog" @cancel="isShowSwitchKeyDialog = false" @hasSwitch="getCurrentUnikey" />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ClipboardJS from 'clipboard'
import QrcodeVue from 'qrcode.vue'
import SwitchKeyDialog from './-/SwitchKeyDialog.vue'
import ConnectSites from './-/ConnectSites.vue'
import Tooltip from '~/ui/components/Tooltip.vue'
import { wallet } from '~/ui/controllers/wallet'
import { CHAINS } from '~/constants'
import { getImageUrl } from '~/utils'
import type { Unikey } from '~/background/services/unikey'
import { windows } from '~/background/tools/windows'

export default {
  name: 'PageHome',
  components: {
    QrcodeVue,
    SwitchKeyDialog,
    ConnectSites,
    Tooltip,
  },
  setup (props, context) {
    const router = useRouter()

    const canShowMsg = ref(false)

    // animation
    const iconFontColor = ref('#fff')
    const isScroll = ref(false)
    const topLineBoxRef = ref<HTMLDivElement | null>(null)
    const dom = document.getElementsByClassName('layout-default')[0] as HTMLDivElement
    onMounted(async () => {
      dom.onscroll = () => {
        const scrollTop = dom.scrollTop
        const transferScrollTop = scrollTop / 30
        if (scrollTop > 0) {
          isScroll.value = true
          iconFontColor.value = '#8D919C'
          topLineBoxRef.value!.style.background = `rgba(255,255,255,${transferScrollTop})`
        }
        else {
          isScroll.value = false
          iconFontColor.value = '#fff'
          topLineBoxRef.value!.style.background = 'rgba(255,255,255,0)'
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
      isLocked.value && router.push('/setup/locked')
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
    const currentUnikey = ref<Unikey| null>(null)
    const currentUnikeyName = ref('')
    async function getCurrentUnikey () {
      currentUnikey.value = await wallet.getCurrentUnikey()
      console.log(currentUnikey.value, 'currentUnikey.value')
      currentUnikeyName.value = CHAINS[currentUnikey.value!.keySymbol].name
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
      onClickTransfer () {
        windows.createNewTab('https://transfer.unisign.org')
      },

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
