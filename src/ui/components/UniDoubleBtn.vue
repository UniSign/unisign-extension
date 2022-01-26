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
      &._disabled {
        opacity: 0.4;
      }
    }
  }
</style>

<template>
  <div class="uni-btn-container">
    <button class="reject" @click="onRejectClick">
      <slot name="reject">
        {{ $tt('Reject') }}
      </slot>
    </button>
    <button class="allow" :class="{'_disabled':disabled}" @click="onAllowClick">
      <slot name="allow">
        {{ $tt('Allow') }}
      </slot>
    </button>
  </div>
</template>

<script lang="ts">
import { toRefs } from 'vue'

export default {
  name: 'UniDoubleBtn',
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['rejectClick', 'allowClick'],
  setup (props, context) {
    const { disabled } = toRefs(props)
    function onRejectClick (e: InputEvent) {
      context.emit('rejectClick', e.target.value)
    }
    function onAllowClick (e: InputEvent) {
      if (disabled.value) return
      context.emit('allowClick', e.target.value)
    }
    return {
      onRejectClick,
      onAllowClick,
    }
  },
}
</script>
