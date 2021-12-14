<style lang="scss" scoped>
  .uni-btn {
    width: 100%;
    height: 50px;
    border-radius: 8px;
    font-size: $main-font-size;
    font-weight: 500;
    line-height: 21px;
    background: $main-btn-bg;
    color: #FFFFFF;
    opacity: 0.4;
    &._canClick {
      opacity: 1;
    }
    &:focus{
      outline: 0;
    }
  }
</style>

<template>
  <button class="uni-btn" :class="{'_canClick':canClick}" @click="onClickSubmit">
    {{ value }}
  </button>
</template>

<script>

export default {
  props: {
    canClick: {
      type: Boolean,
      required: false,
      default: true,
    },
    value: {
      type: String,
      required: false,
      default: 'Continue',
    },
  },
  emits: ['submitClick'],
  setup (props, context) {
    function onClickSubmit (e) {
      context.emit('submitClick')
    }
    return {
      onClickSubmit,
    }
  },
}
</script>
