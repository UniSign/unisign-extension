<style lang="scss" scoped>
.page-begin {
  width: 350px;
  height: 629px;
  background-color: #DCE5F0;
  position: relative;
  .top-bg {
    width: 100%;
    height: 201px;
    background: #534CDD;
    border-radius: 0px 0px 20px 20px;
  }
  .top-line-box {
    width: 100%;
    height: 58px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    left: 50%;
  }
  .central-content {
    width: 310px;
    height: 267px;
    background: #E9EDF3;
    box-shadow: 0px 6px 10px 0px rgba(141, 145, 156, 0.1);
    border-radius: 14px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    position: absolute;
    top: 122px;
    transform: translateX(-50%);
    left: 50%;
    h2 {
      margin-top: 64px;
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      color: #242C3F;
      line-height: 29px;
    }
    p {
      font-size: 14px;
      font-weight: 400;
      color: #8D919C;
      line-height: 16px;
      text-align: center;
      margin-top: 16px;
    }
    .uni-btn {
      width: 230px;
      height: 50px;
      background: #FBAF34;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 21px;
      opacity: 1;
      margin:52px auto 0;
      display: block;
      &:focus{
        outline: 0;
      }
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
    font-size: 14px;
    font-weight: 400;
    color: #2A67C5;
    line-height: 16px;
    position: absolute;
    top: 577px;
    transform: translateX(-50%);
    left: 50%;
    cursor: pointer;
  }
  .foot-box {
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
    left: 0;
    background: #FFFFFF;
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.08);
    img {
      width: 8px;
      height: 10px;
      margin-right: 8px;
      cursor: pointer;
    }
    span {
      font-size: 12px;
      font-weight: 600;
      color: #242C3F;
      line-height: 14px;
      cursor: pointer;
    }
  }
}
</style>

<template>
  <div class="page-begin main-container">
    <div class="top-bg"></div>
    <div class="top-line-box">
      <img class="w-[134px] h-[36px]" src="/assets/page-begin/nav-logo.png">
    </div>
    <div class="central-content">
      <h2>Let’s begin</h2>
      <p>Create or import a key to start.</p>
      <button class="uni-btn" @click="onClickSubmit">
        Add Keys
      </button>
    </div>
    <img class="key-icon" src="/assets/page-begin/key-icon.png">
    <p>How to use?</p>
    <div class="foot-box">
      <img src="/assets/page-begin/identification-icon.png">
      <span>Ironman</span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'PageBegin',
  setup (props, context) {
    const onClickSubmit = () => {
    }
    return {
      onClickSubmit,
    }
  },
}
</script>
