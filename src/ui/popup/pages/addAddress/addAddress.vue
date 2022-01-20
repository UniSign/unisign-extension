<style lang="scss" scoped>
.page-add-address {
  position: relative;
  width: 100%;
  height: 100%;
  .key-box {
    padding: 70px 16px;
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
      <div v-for="(item,index) in keyTypes" :key="index" class="key-item-box" @click="$router.push(`/addAddress/selectWays/${item.unikeySymbol}`)">
        <img :src="getImageUrl(item.unikeySymbol)">
        <span>{{ item.name }}</span>
        <Iconfont class="arrow-right" name="arrow-right" width="12" height="14" color="#D8D8D8"></Iconfont>
      </div>
    </div>
    <Ironman></Ironman>
  </div>
</template>

<script lang="ts">
import { CHAINS } from '~/constants'
import { getImageUrl } from '~/utils'

export default {
  name: 'PageAddAddress',
  setup () {
    const keyTypes = Object.values(CHAINS)

    return {
      keyTypes,
      getImageUrl,
    }
  },
}
</script>
