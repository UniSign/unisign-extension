<style lang="scss" scoped>
.current-key-box {
  padding: 7px 8px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid rgba(191, 191, 191, 0.29);
  word-break: break-all;
  background: rgba(247, 245, 244, 0.9);
  >img {
    margin-right: 5px;
    width: 26px;
    height: 26px;
  }
  >div {
    >p {
      margin-bottom: 4px;
      font-size: $detail-font-size;
      line-height: 16px;
      color: #8D919C;
    }
    >span {
      font-size: $detail-font-size;
      font-weight: 600;
      font-family: monospace;
      line-height: 16px;
      color: #6F7684;
    }
  }
}
</style>

<template>
  <div class="current-key-box">
    <img :src="getImageUrl(currentUnikey?.keySymbol)">
    <div>
      <p>{{ $tt('Current Key') }}</p>
      <span>{{ substringKey(currentUnikey?.key) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { getImageUrl, substringKey } from '~/utils/index'
import { Unikey } from '~/background/services/unikey'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'CurrentKeyBox',
  setup () {
    const currentUnikey = ref<Unikey|null>()

    onMounted(async () => {
      currentUnikey.value = await wallet.getCurrentUnikey()
    })

    return {
      currentUnikey,

      getImageUrl,
      substringKey,
    }
  },
}
</script>
