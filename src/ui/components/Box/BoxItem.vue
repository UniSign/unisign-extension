<style lang="scss">
.box-item {
  height: 66px;
  padding: 15px 16px 15px 10px;
  display: flex;
  align-items: center;
  background: #F9F7F6;
  font-size: $input-font-size;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #F0EDED;
  }

  .box-item_head {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    margin-right: 8px;
  }

  .box-item_tail {
    margin-left: auto;
  }
}
</style>

<template>
  <div class="box-item" @click="onClick">
    <div class="box-item_head">
      <slot name="head" />
    </div>

    <slot />

    <div class="box-item_tail">
      <slot v-if="$slots.tail" name="tail" />
      <Iconfont v-else class="arrow-right" name="arrow-right" width="12" height="14" color="#D8D8D8" />
    </div>
  </div>
</template>

<script>

import { useRouter } from 'vue-router'

export default {
  name: 'BoxItem',
  components: {},
  props: {
    to: String,
  },
  setup (props) {
    const router = useRouter()

    return {
      onClick () {
        if (props.to) {
          router.push(props.to)
        }
      },
    }
  },
}
</script>
