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
        font-size: $detail-font-size;
        color: #8D919C;
        span {
          margin-left: 0px;
          font-size: $detail-font-size;
          font-weight: 500;
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
            .tooltip {
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
}
</style>

<template>
  <div class="page-connect-sites">
    <div class="connect-box">
      <div class="status-item">
        <Iconfont name="current" size="14" />
        <span>{{ $tt('Current Connected') }}</span>
      </div>
      <div v-if="!currentSite" class="connect-item">
        <Iconfont name="connect" size="24" />
        <p>{{ $tt('Not Connected') }}</p>
      </div>
      <div v-else class="connect-item">
        <img v-if="currentSite.icon" :src="currentSite?.icon">
        <Iconfont v-else name="connect" size="24" />
        <p>{{ substringUrl(currentSite?.origin,'agreement') }}<span>{{ substringUrl(currentSite?.origin,'domainName') }}</span></p>
      </div>
    </div>
    <div v-if="sites.length" class="await-connect-box">
      <div class="status-item">
        <Iconfont name="connected" size="14" color="#6F7684" />
        <span>{{ $tt('Connected Apps') }}</span>
      </div>
      <div v-for="site in sites" :key="site.name" class="connect-item">
        <img v-if="site.icon" :src="site?.icon">
        <Iconfont v-else name="connect" size="24" />
        <p>{{ substringUrl(site?.origin,'agreement') }}<span>{{ substringUrl(site?.origin,'domainName') }}</span></p>
        <div>
          <div class="disconnect mr-[7px]" @click="onClickDisconnect(site)">
            <img class="w-[16px] h-[16px] mt-[2px] ml-[2px]" :src="`/assets/page-home/icon-disconnect.png`">
            <Tooltip top>
              {{ $tt('Disconnect') }}
            </Tooltip>
          </div>
          <div @click="onClickPinSite(site)">
            <img class="w-[8px] h-[11px]" :src="`/assets/page-home/icon-${site.isPinned?'pined':'unpin'}.png`">
            <Tooltip top>
              {{ site.isPinned?$tt('Unpin'):$tt("Pin") }}
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import Tooltip from '~/ui/components/Tooltip.vue'
import { wallet } from '~/ui/controllers/wallet'
import type { SiteData } from '~/background/services/site'
import { substringUrl } from '~/utils'

export default {
  name: 'PageConnectSites',
  components: {
    Tooltip,
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
