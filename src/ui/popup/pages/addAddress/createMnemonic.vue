<style lang="scss" scoped>
.page-create-mnemonic {
  position: relative;
  width: 100%;
  height: 100%;
  .central-content {
    padding: 32px 22px 24px 22px;
    >h2 {
      margin-bottom: 16px;
      text-align: center;
      font-size: $title-font-size;
      font-weight: bold;
      line-height: 29px;
      color: $main-color;
    }
    >p {
      margin-bottom: 32px;
      text-align: center;
      font-size: $detail-font-size;
      font-weight: 400;
      line-height: 16px;
      color: #6F7684;
    }
    .mnemonic-box {
      display: flex;
      flex-wrap: wrap;
      .mnemonic-item {
        margin: 0 8px 8px 0;
        width: 96px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid rgba(191, 191, 191, 0.09);
        display: flex;
        align-items: center;
        background: #F9F7F6;
        &:nth-child(3n) {
          margin: 0 0 8px 0;
        }
        span {
          margin: 0 11px 0 6px;
          font-size: $default-font-size;
          font-weight: 400;
          line-height: 14px;
          color: #C9CCD3;
        }
        p {
          font-size: $detail-font-size;
          font-weight: bold;
          color: $main-color;
          line-height: 16px;
        }
      }
    }
  }
  .uni-btn {
    position: absolute;
    bottom: 44px;
    left: 50%;
    transform: translateX(-50%);
    width: 302px;
  }
}
</style>

<template>
  <div class="page-create-mnemonic">
    <UniTab title="Create Mnemonic"></UniTab>
    <div class="central-content">
      <h2>Keep it carefully</h2>
      <p>please copy the following contents on paper in order and keep them in a safe place. Do not take screenshots or send them to others</p>
      <div class="mnemonic-box">
        <div v-for="(item,index) in mnemonicArr" :key="index" class="mnemonic-item">
          <span>{{ index }}</span>
          <p>{{ item }}</p>
        </div>
      </div>
    </div>
    <UniBtn class="uni-btn" @submit-click="$router.push(`/chooseTheRightOrder/${$route.params.key}`)"></UniBtn>
    <Ironman></Ironman>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PageCreateMnemonic',
  setup () {
    const mnemonicArr = ref([
      'defense',
      'light',
      'accident',
      'opinion',
      'benefit',
      'match',
      'trim',
      'slogan',
      'festival',
      'during',
      'cheap',
      'mix',
    ])
    return {
      mnemonicArr,
    }
  },
}
</script>
