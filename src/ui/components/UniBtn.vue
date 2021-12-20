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
    opacity: 1;
    &._disabled {
      opacity: 0.4;
    }
    &._error {
      background: $error-btn-bg;
    }
    &:focus{
      outline: 0;
    }
  }
</style>

<template>
  <button class="uni-btn" :class="{'_disabled':disabled,'_error':error}" @click="click">
    <slot>Continue</slot>
  </button>
</template>

<script>
import { toRefs } from 'vue'

export default {
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    error: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['click'],
  setup (props, context) {
    const { disabled } = toRefs(props)
    function click (e) {
      if (disabled.value) return
      context.emit('click', e.target.value)
    }
    return {
      click,
    }
  },
}
</script>
