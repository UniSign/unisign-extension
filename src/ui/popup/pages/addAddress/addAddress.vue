<style lang="scss" scoped>
.page-add-address {
  position: relative;
  width: 100%;
  height: 100%;
  .key-box {
    padding: 12px 16px;
    .key-item-box {
      width: 100%;
      height: 66px;

      margin-top: 12px;
      padding: 13px 17px 13px 10px;
      border-radius: 12px;
      border: 1px solid rgba(191, 191, 191, 0.09);
      display: flex;
      align-items: center;
      background: #F9F7F6;
      cursor: pointer;
      &:hover {
        background: #F0EDED;
      }
      img {
        width: 40px;
        height: 40px;
        margin-right: 14px;
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
  <div class="page-add-address">
    <UniTab></UniTab>
    <div class="key-box">
      <div v-for="(item,index) in keyTypes" :key="index" class="key-item-box" @click="$router.push(`/selectWays/${item.identifier}`)">
        <img :src="getImageUrl(item.logo)">
        <span>{{ item.name }}</span>
        <Iconfont class="arrow-right" name="arrow-right" width="12" height="14" color="#D8D8D8"></Iconfont>
      </div>
    </div>
    <Ironman></Ironman>
  </div>
</template>

<script>
import { CHAINS } from '~/constants'

export default {
  name: 'PageAddAddress',
  setup () {
    let keyTypes = []
    keyTypes = Object.values(CHAINS)
    const getImageUrl = (key) => {
      return `/assets/page-addAddress/${key}.png`
    }
    return {
      keyTypes,
      getImageUrl,
    }
  },
}
</script>
