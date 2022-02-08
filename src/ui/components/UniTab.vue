<style lang="scss" scoped>
    .tab-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 8;
      width: 100%;
      height: 58px;
      box-shadow: 0px 1px 0px 0px rgba(141, 145, 156, 0.12);
      background: #FFFFFF;
      div {
        position: absolute;
        left: 11px;
        top: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: #FFFFFF;
        cursor: pointer;
        &:hover {
          background: rgba(0, 0, 0, 0.06);
        }
      }
      p {
        text-align: center;
        font-size: $input-font-size;
        font-weight: bold;
        line-height: 58px;
      }
    }
</style>

<template>
  <div class="tab-wrapper">
    <div v-if="!disabled" @click="onClickLeft">
      <Iconfont name="arrow-left" width="14" height="12" color="#0C0D0D"></Iconfont>
    </div>
    <p>{{ title }}</p>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'

export default {
  name: 'UniTab',
  props: {
    title: {
      type: String,
      required: false,
      default: 'Select Key Type',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup (props, context) {
    const router = useRouter()
    const onClickLeft = () => {
      router.go(-1)
    }
    return {
      onClickLeft,
    }
  },
}
</script>
