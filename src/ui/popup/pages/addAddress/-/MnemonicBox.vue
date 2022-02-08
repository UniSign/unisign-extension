<style lang="scss" scoped>
.mnemonic-box {
  display: flex;
  flex-wrap: wrap;
  .mnemonic-item {
    margin: 0 8px 8px 0;
    width: 99px;
    height: 32px;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid rgba(191, 191, 191, 0.09);
    display: flex;
    align-items: center;
    background: #F9F7F6;
    &:nth-child(3n) {
      margin: 0 0 8px 0 !important;
    }
    span {
      margin: 0 8px 0 5px;
      line-height: 14px;
      color: #C9CCD3;
    }
    p {
      font-size: $detail-font-size;
      font-weight: bold;
      line-height: 16px;
    }
  }
}

.can-choose {
  margin-top: 24px;
  .mnemonic-item {
    justify-content: center;
    cursor: pointer;
    &._invisible {
      border: none;
      background-color: #ffffff;
    }
  }
}
</style>

<template>
  <div class="mnemonic-box" :class="{'can-choose':canChoose}">
    <div v-for="(item,index) in mnemonicArr" :key="index" :class="{'_invisible': isNullOrEmpty(item)}" class="mnemonic-item" @click="click(index)">
      <span v-if="!canChoose">{{ index+1 }}</span>
      <p>{{ item }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { toRefs } from 'vue'
import { isNullOrEmpty } from '~/utils/index'

export default {
  name: 'MnemonicBox',
  props: {
    canChoose: {
      type: Boolean,
      required: false,
      default: false,
    },
    mnemonicArr: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  emits: ['click'],
  setup (props, context) {
    const { canChoose } = toRefs(props)
    function click (index: number) {
      if (!canChoose.value) return
      context.emit('click', index)
    }
    return {
      isNullOrEmpty,
      click,
    }
  },
}
</script>
