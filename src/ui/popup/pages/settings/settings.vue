<style lang="scss" scoped>
.page-settings {
}
</style>

<template>
  <div class="page-settings">
    <UniTab :title="$tt('Settings')"></UniTab>

    <div style="margin-top: 82px"></div>

    <BoxList v-for="(item,index) in settingsArr" :key="index" @click="onClickSettingItem(item)">
      <BoxItem>
        <template #head>
          <Iconfont class="icon-key" :name="item.key" width="16" height="16" :color="item.color" />
        </template>
        {{ item.value }}
      </BoxItem>
    </BoxList>
    <Ironman></Ironman>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { windows } from '~/background/tools/windows'
import BoxItem from '~/ui/components/Box/BoxItem.vue'
import BoxList from '~/ui/components/Box/BoxList.vue'

interface Setting {
  key: string
  value: string
  color: string
  router: string
}
export default {
  name: 'PageSettings',
  components: {
    BoxItem,
    BoxList,
  },
  setup () {
    const router = useRouter()
    const i18n = useI18n()

    const settingsArr = ref<Setting[]>([
      { key: 'keys', value: i18n.$tt('Key Management'), color: '#FFAD27', router: 'settings/keyManagement' },
      { key: 'language', value: i18n.$tt('Language'), color: '#4190FF', router: 'settings/language' },
      { key: 'security', value: i18n.$tt('Security & Backup'), color: '#66D5AA', router: 'settings/securityAndBackup' },
      { key: 'advanced', value: i18n.$tt('Advanced'), color: '#66D5AA', router: 'settings/advancedReset' },
      { key: 'about', value: i18n.$tt('About UniSign'), color: '#9094AE', router: 'about' },
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
