<style lang="scss" scoped>
.wrapper-sign {
  width: 350px;
  height: 630px;
  .page-connect {
    position: relative;
    width: 100%;
    height: 100%;
    .top-bg {
      padding-top: 24px;
      width: 100%;
      height: 133px;
      background: #534CDD;
      h2 {
        text-align: center;
        font-size: $title-font-size;
        font-weight: bold;
        line-height: 29px;
        color: #FFFFFF;
      }
    }
    .central-content {
      padding: 24px 24px 100px;
      position: absolute;
      top: 83px;
      box-sizing: border-box;
      width: 100%;
      min-height: 511px;
      border-radius: 12px;
      background: #FFFFFF;
    }
    .btn-box {
      padding: 12px 0;
      position: fixed;
      bottom: 20px;
      width: 100%;
      box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.08);
      background: #FFFFFF;
    }
  }
}
</style>

<template>
  <div class="wrapper-sign">
    <div class="page-connect">
      <div class="top-bg">
        <h2>{{ $tt(title) }}</h2>
      </div>
      <div class="central-content">
        <slot></slot>
      </div>
      <div class="btn-box">
        <UniDoubleBtn @rejectClick="onRejectClick" @allowClick="onAllowClick"></UniDoubleBtn>
      </div>
      <Ironman></Ironman>
    </div>
  </div>
</template>

<script>

export default {
  name: 'WrapperSign',
  props: {
    title: {
      type: String,
      required: false,
      default: 'Signature Request',
    },
  },
  emits: ['reject', 'allow'],
  setup (props, context) {
    function onRejectClick (e) {
      context.emit('reject', e)
    }
    function onAllowClick (e) {
      context.emit('allow', e)
    }
    return {
      onRejectClick,
      onAllowClick,
    }
  },
}
</script>
