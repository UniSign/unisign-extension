<style lang="scss" scoped>
.page-add-address-success {
  position: relative;
  width: 100%;
  height: 100%;
  .central-content {
    padding-top: 58px;
    h2 {
      font-size: 32px;
      font-weight: bold;
      line-height: 38px;
      text-align: center;
    }
  }
  .uni-btn {
    position: absolute;
    bottom: 178px;
    left: 50%;
    transform: translateX(-50%);
    width: 210px;
  }
}
</style>

<template>
  <div class="page-add-address-success">
    <UniTab :disabled="true" title="Create Mnemonic"></UniTab>
    <div class="central-content">
      <img class="w-[189px] h-[161px] mx-auto mt-[77px]" src="/assets/page-addAddress/success-bg.png">
      <h2>Success</h2>
    </div>
    <UniBtn class="uni-btn" @click="$router.push(`/setup/home`)">
      Start to use
    </UniBtn>
    <Ironman></Ironman>
  </div>
</template>

<script>

export default {
  name: 'PageAddAddressSuccess',
  setup () {
  },
}
</script>
