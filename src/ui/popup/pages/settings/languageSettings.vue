<style lang="scss" scoped>
.page-language-settings {
  position: relative;
  width: 100%;
  height: 100%;
  .settings-box {
    padding: 12px 16px;
    .settings-item-box {
      width: 100%;
      height: 66px;

      margin-top: 12px;
      padding: 13px 17px 13px 21px;
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
      .icon-font {
        margin-left: auto;
      }
    }
  }
}
</style>

<template>
  <div class="page-language-settings">
    <UniTab title="language"></UniTab>
    <div class="settings-box">
      <div v-for="(item,index) in settingsArr" :key="index" class="settings-item-box" @click="onChooseItem(index)">
        <span>{{ item.value }}</span>
        <Iconfont class="icon-font" :name="item.status?'checked':'unchecked'" size="12" :color="item.status?'#FFBC5D':'#E1E1E1'"></Iconfont>
      </div>
    </div>
    <Ironman></Ironman>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'PageSettings',
  setup () {
    const settingsArr = reactive([
      { key: 'English', value: 'English', status: true },
      { key: '简体中文', value: '简体中文', status: false },
    ])
    const onChooseItem = (index) => {
      settingsArr.map(item => item.status = false)
      settingsArr[index].status = true
    }
    return {
      settingsArr,
      onChooseItem,
    }
  },
}
</script>
