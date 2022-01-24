<style lang="scss" scoped>
.page-settings {
  position: relative;
  width: 100%;
  height: 100%;
  .settings-box {
    padding: 70px 16px 0;
    .settings-item-box {
      width: 100%;
      height: 66px;
      margin-top: 12px;
      padding: 13px 17px 13px 24px;
      border-radius: 12px;
      border: 1px solid rgba(191, 191, 191, 0.09);
      display: flex;
      align-items: center;
      background: #F9F7F6;
      cursor: pointer;
      &:hover {
        background: #F0EDED;
      }
      span {
        font-size: $input-font-size;
        font-weight: 500;
      }
      .arrow-right {
        margin-left: auto;
      }
    }
  }
}
</style>

<template>
  <div class="page-settings">
    <UniTab title="settings"></UniTab>
    <div class="settings-box">
      <div v-for="(item,index) in settingsArr" :key="index" class="settings-item-box" @click="onClickSettingItem(item)">
        <Iconfont class="icon-key mr-[20px]" :name="item.key" width="16" height="16" :color="item.color"></Iconfont>
        <span>{{ $tt(item.value) }}</span>
        <Iconfont class="arrow-right" name="arrow-right" width="12" height="14" color="#D8D8D8"></Iconfont>
      </div>
    </div>
    <Ironman></Ironman>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { windows } from '~/background/tools/windows'

interface Setting {
  key: string
  value: string
  color: string
  router: string
}
export default {
  name: 'PageSettings',
  setup () {
    const router = useRouter()
    const settingsArr = ref<Setting[]>([
      { key: 'keys', value: 'Key Management', color: '#FFAD27', router: 'settings/keyManagement' },
      { key: 'language', value: 'Language', color: '#4190FF', router: 'settings/language' },
      { key: 'security', value: 'Security & Backup', color: '#66D5AA', router: 'settings/securityAndBackup' },
      { key: 'advanced', value: 'Advanced', color: '#66D5AA', router: 'settings/advancedReset' },
      { key: 'about', value: 'About UniSign', color: '#9094AE', router: 'about' },
    ])
    const onClickSettingItem = async (item: Setting) => {
      if (item.router === 'about') {
        await windows.createNewTab('https://unisign.org')
        return
      }
      router.push(`/${item.router}`)
    }

    return {
      settingsArr,
      onClickSettingItem,
    }
  },
}
</script>
