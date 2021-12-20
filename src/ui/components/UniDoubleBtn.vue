<style lang="scss" scoped>
  .uni-btn-container {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $main-font-size;
    font-weight: 500;
    line-height: 21px;
    color: #FFFFFF;
    .reject,.allow {
      width: 141px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      &:focus{
        outline: 0;
      }
    }
    .reject {
      margin-right: 20px;
      border: 1px solid rgba(221, 76, 76, 0.1);
      background: rgba(221, 76, 76, 0.05);
      color: #D45D5D;
    }
    .allow {
      background: #FBAF34;
      color: #FFFFFF;
    }
  }
</style>

<template>
  <div class="uni-btn-container">
    <button class="reject" @click="onRejectClick">
      <slot name="reject">
        Reject
      </slot>
    </button>
    <button class="allow" @click="onAllowClick">
      <slot name="allow">
        Allow
      </slot>
    </button>
  </div>
</template>

<script>

export default {
  props: {
  },
  emits: ['rejectClick', 'allowClick'],
  setup (props, context) {
    function onRejectClick (e) {
      context.emit('rejectClick', e.target.value)
    }
    function onAllowClick (e) {
      context.emit('allowClick', e.target.value)
    }
    return {
      onRejectClick,
      onAllowClick,
    }
  },
}
</script>
