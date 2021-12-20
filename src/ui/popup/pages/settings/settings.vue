<style lang="scss" scoped>
.page-settings {
  position: relative;
  width: 100%;
  height: 100%;
  .settings-box {
    padding: 12px 16px;
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
      <div v-for="(item,index) in settingsArr" :key="index" class="settings-item-box" @click="$router.push(`/${item.router}`)">
        <Iconfont class="icon-key mr-[20px]" :name="item.key" width="16" height="16" :color="item.color"></Iconfont>
        <span>{{ item.value }}</span>
        <Iconfont class="arrow-right" name="arrow-right" width="12" height="14" color="#D8D8D8"></Iconfont>
      </div>
    </div>
    <Ironman></Ironman>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PageSettings',
  setup () {
    const settingsArr = ref([
      { key: 'keys', value: 'Key Management', color: '#FFAD27', router: 'keys' },
      { key: 'language', value: 'Language', color: '#4190FF', router: 'languageSettings' },
      { key: 'security', value: 'Security & Backup', color: '#66D5AA', router: 'security' },
      { key: 'advanced', value: 'Advanced', color: '#66D5AA', router: 'advanced' },
      { key: 'about', value: 'About UniSign', color: '#9094AE', router: 'about' },
    ])
    return {
      settingsArr,
    }
  },
}
</script>
