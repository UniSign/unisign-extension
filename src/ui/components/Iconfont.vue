<template>
  <svg
    class="iconfont"
    :style="style"
    aria-hidden="true"
    v-bind="$attrs"
  >
    <use :xlink:href="'#icon-' + name" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Iconfont',
  props: {
    name: {
      type: String,
      default: '',
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
    size: {
      type: [Number, String],
      default: 24,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
  },
  setup (props) {
    const style = computed(() => {
      let style: { [key: string]: string } = {
        height: `${props.size}px`,
        width: `${props.size}px`,
      }

      if (props.color) {
        style.color = props.color
      }

      if (props.rounded && props.size) {
        style = {
          ...style,
          borderRadius: `${props.size}px`,
        }
      }
      return style
    })

    return {
      style,
    }
  },
})</script>

<style lang="scss">
.iconfont {
  display: inline-block;
  vertical-align: middle;
  fill: currentColor;
  outline: unset;
  font-size: 1px;
}
</style>
