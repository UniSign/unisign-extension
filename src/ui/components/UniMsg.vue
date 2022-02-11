<style lang="scss" scoped>
.uni-msg {
  position: fixed;
  z-index: 100;
  top: 7px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.06);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $input-font-size;
  font-weight: 600;
  color: #FFFFFF;
  text-align: center;
}
.fade-enter-active, .fade-leave-active{
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <transition name="fade">
    <div v-if="visible" class="uni-msg" :style="{'width':width,'height':height,'background-color':error?'#EE5757':'#41C190'}">
      <Iconfont :name="error?'error':'checked'" size="16" color="#fff" class="mr-[8px]"></Iconfont>
      {{ content }}
    </div>
  </transition>
</template>

<script lang="ts">
import { watch } from 'vue'

export default {
  name: 'UniMsg',
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
    width: {
      type: String,
      required: false,
      default: '226px',
    },
    height: {
      type: String,
      required: false,
      default: '44px',
    },
    error: {
      type: Boolean,
      required: false,
      default: false,
    },
    content: {
      type: String,
      required: false,
      default: 'Saved',
    },
  },
  emits: ['close'],
  setup (props, context) {
    watch(() => props.visible, (newVal, oldVal) => {
      if (oldVal === true) {
        return
      }
      setTimeout(() => {
        context.emit('close')
      }, 3000)
    })
    return {
    }
  },
}
</script>
