<style lang="scss" scoped>
  .uni-btn-container {
    padding: 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    .reject {
      margin-right: 20px;
      border: 1px solid rgba(222, 76, 76, 0.1);
      background: rgba(221, 76, 76, 0.05);
      color: #D45D5D;

      &:hover {
        background-color: rgba(222, 76, 76, 0.15);
      }
    }
  }
</style>

<template>
  <div class="uni-btn-container">
    <UniBtn class="reject" :disabled="disabled" @click="onRejectClick">
      {{ $tt('Reject') }}
    </UniBtn>
    <UniBtn :disabled="disabled" @click="onAllowClick">
      {{ $tt('Allow') }}
    </UniBtn>
  </div>
</template>

<script lang="ts">
import { toRefs } from 'vue'
import UniBtn from '~/ui/components/UniBtn.vue'

export default {
  name: 'UniDoubleBtn',
  components: {
    UniBtn,
  },

  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['reject', 'allow'],
  setup (props, context) {
    const { disabled } = toRefs(props)
    function onRejectClick () {
      context.emit('reject')
    }
    function onAllowClick () {
      if (disabled.value) return
      context.emit('allow')
    }
    return {
      onRejectClick,
      onAllowClick,
    }
  },
}
</script>
