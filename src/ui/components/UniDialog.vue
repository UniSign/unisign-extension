<style lang="scss" scoped>
.model {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.24);
  .dialog-wrapper{
    position: relative;
    width: 318px;
    min-height: 275px;
    max-height: 440px;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    box-shadow: 0px 19px 22px 0px rgba(141, 145, 156, 0.3);
    background: #FFFFFF;
    overflow: hidden;
    .title{
      padding: 16px 16px 16px 24px;
      display: flex;
      align-items: center;
      box-shadow: 0px 1px 0px 0px rgba(141, 145, 156, 0.12);
      h2 {
        font-size: $title-font-size;
        font-weight: bold;
        line-height: 29px;
        &._error {
          color: $error-btn-bg;
        }
      }
      .close {
        position: absolute;
        top: 12px;
        right: 16px;
        width: 36px;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        cursor: pointer;

        &:hover {
          background: rgba(0, 0, 0, 0.06);
        }
      }
    }
    .content {
      position: relative;
      min-height: 214px;
    }
  }
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
    <div v-if="visible" class="model">
      <div class="dialog-wrapper">
        <div class="title">
          <h2 :class="{'_error':error}">
            {{ title }}
          </h2>
          <div class="close" @click="cancel">
            <Iconfont name="close" size="16" color="#8D919C"></Iconfont>
          </div>
        </div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { watch } from 'vue'

export default {
  name: 'UniDialog',
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
    title: {
      type: String,
      required: false,
      default: 'Account Detail',
    },
    error: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['cancel'],
  setup (props, context) {
    const cancel = () => {
      context.emit('cancel')
    }
    watch(() => props.visible, (newVal, oldVal) => {
      const dom = document.getElementsByClassName('layout-default')[0]
      if (newVal) {
        (dom as HTMLDivElement).style.height = '600px';
        (dom as HTMLDivElement).style.overflow = 'hidden'
      }
      else {
        (dom as HTMLDivElement).style.height = '600px';
        (dom as HTMLDivElement).style.overflow = 'scroll'
      }
    })

    return {
      cancel,
    }
  },
}
</script>
