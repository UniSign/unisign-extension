<style lang="scss" scoped>
.page-begin {
  position: relative;
  height: 100%;
  background-color: #DCE5F0;
  .top-bg {
    width: 100%;
    height: 201px;
    border-radius: 0px 0px 20px 20px;
    background: #534CDD;
  }
  .top-line-box {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    left: 50%;
    width: 100%;
    height: 58px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.1);
    }
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
    h2 {
      margin-top: 64px;
      text-align: center;
      font-size: $title-font-size;
      font-weight: 600;
      line-height: 29px;
      color: $main-color;
    }
    p {
      margin-top: 16px;
      text-align: center;
      font-size: $detail-font-size;
      font-weight: 400;
      line-height: 16px;
      color: #8D919C;
    }
    .uni-btn {
      margin:52px auto 0;
      width: 230px;
      display: block;
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
    font-weight: 400;
    line-height: 16px;
    color: #2A67C5;
    cursor: pointer;
  }
}
</style>

<template>
  <div class="page-begin">
    <div class="top-bg"></div>
    <div class="top-line-box">
      <div class="icon-wrapper cursor-pointer">
        <Iconfont name="settings" size="20" color="#fff"></Iconfont>
      </div>
      <img class="w-[134px] h-[36px]" src="/assets/page-begin/nav-logo.png">
      <div class="icon-wrapper cursor-pointer">
        <Iconfont name="lock" size="20" color="#fff"></Iconfont>
      </div>
    </div>
    <div class="central-content">
      <h2>Let’s begin</h2>
      <p>Create or import a key to start.</p>
      <UniBtn class="uni-btn" value="Add Keys" @submit-click="onClickSubmit"></UniBtn>
    </div>
    <img class="key-icon" src="/assets/page-begin/key-icon.png">
    <p>How to use?</p>
    <Ironman></Ironman>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'PageBegin',
  setup (props, context) {
    const router = useRouter()
    const onClickSubmit = () => {
      router.push('/addAddress')
    }
    return {
      onClickSubmit,
    }
  },
}
</script>
