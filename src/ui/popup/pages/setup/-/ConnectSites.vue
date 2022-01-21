<style lang="scss" scoped>
.page-connect-sites {
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
      >img {
        width: 24px;
        height: 24px;
      }
      >p {
        margin-left: 12px;
        font-size: $input-font-size;
        color: #8D919C;
        span {
          margin-left: 0px;
          color: #242C3F;
        }
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
      display: flex;
      align-items: center;
      >p {
        margin-left: 12px;
        font-size: $input-font-size;
        color: #8D919C;
        span {
          margin-left: 0px;
          color: #242C3F;
        }
      }
      .disconnect {
        display: none;
      }
      &:hover {
        cursor: pointer;
        background-color: #fff;
        .disconnect {
          display: block;
        }
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
  <div class="page-connect-sites">
    <div class="connect-box">
      <div class="status-item">
        <Iconfont name="current" size="14"></Iconfont>
        <span>Current connect</span>
      </div>
      <div v-if="!currentSite" class="connect-item">
        <Iconfont name="connect" size="24"></Iconfont>
        <p>No Connect</p>
      </div>
      <div v-else class="connect-item">
        <img :src="currentSite?.icon">
        <p>{{ substringUrl(currentSite?.origin,'agreement') }}<span>{{ substringUrl(currentSite?.origin,'domainName') }}</span></p>
      </div>
    </div>
    <div v-if="sites.length" class="await-connect-box">
      <div class="status-item">
        <Iconfont name="connected" size="14" color="#6F7684"></Iconfont>
        <span>Connected Apps</span>
      </div>
      <div v-for="site in sites" :key="site.name" class="connect-item">
        <img :src="site?.icon">
        <p>{{ substringUrl(site?.origin,'agreement') }}<span>{{ substringUrl(site?.origin,'domainName') }}</span></p>
        <div>
          <div class="disconnect mr-[7px]" @click="onClickDisconnect(site)">
            <img class="w-[16px] h-[16px] mt-[2px] ml-[2px]" src="/assets/page-home/icon-disconnect.png">
            <div class="popover popover-top">
              Disconnect
            </div>
          </div>
          <div @click="onClickPinSite(site)">
            <img class="w-[8px] h-[11px]" :src="`/assets/page-home/icon-${site.isPinned?'pin':'pin-true'}.png`">
            <div class="popover popover-top">
              {{ site.isPinned?'Unpin':"Pin" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { wallet } from '~/ui/controllers/wallet'
import { SiteData } from '~/background/services/site'
import { substringUrl } from '~/utils'

export default {
  name: 'PageConnectSites',
  components: {
  },
  setup (props, context) {
    const currentSite = ref<SiteData>()
    const sites = ref<SiteData[]>([])
    const onSiteChanged = async () => {
      currentSite.value = await wallet.getCurrentSite()
      sites.value = await wallet.getSitesSorted()
      console.log(currentSite.value, 'currentSite')
      console.log(sites.value, 'sites')
    }
    const onClickPinSite = async (site: SiteData) => {
      if (site.isPinned) {
        await wallet.unpinSite(site.origin)
      }
      else {
        await wallet.pinSite(site.origin)
      }
      onSiteChanged()
    }
    const onClickDisconnect = async (site: SiteData) => {
      await wallet.removeSiteAndSession(site.origin)
      onSiteChanged()
    }
    onMounted(async () => {
      onSiteChanged()
    })

    return {
      currentSite,
      sites,
      onClickPinSite,
      onClickDisconnect,
      substringUrl,
    }
  },
}
</script>
