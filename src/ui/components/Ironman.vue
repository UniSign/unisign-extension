<style lang="scss" scoped>
  .ironman-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.06);
    background: #FFFFFF;
    .ironman-box {
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        width: 8px;
        height: 10px;
        margin-right: 8px;
      }
      span {
        font-weight: 600;
        line-height: 14px;
      }
    }
    .ironman-detail {
      position: absolute;
      bottom: 28px;
      transform: translateX(-50%);
      left: 50%;
      padding: 7px 12px 12px;
      box-sizing: border-box;
      box-shadow: 0px 5px 6px 0px rgba(0, 0, 0, 0.16);
      border-radius: 8px;
      font-size: $detail-font-size;
      font-weight: 500;
      background: #11142D;
      color: #FFFFFF;
    }
  }
</style>

<template>
  <div class="ironman-wrapper">
    <div class="ironman-box" @mouseover="isShowDetail = true" @mouseleave="isShowDetail = false">
      <img src="/assets/page-home/identification-icon.png">
      <span>{{ antiPhishingCode }}</span>
      <!--<router-link to="/test">test</router-link>-->
    </div>
    <div v-show="isShowDetail" class="ironman-detail">
      {{ antiPhishingCode }}
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { wallet } from '~/ui/controllers/wallet'

export default defineComponent({
  name: 'Ironman',
  setup () {
    const isShowDetail = ref(false)
    const antiPhishingCode = ref('')
    const onAntiPhishingCodeChange = async () => {
      antiPhishingCode.value = await wallet.getAntiPhishingCode()
    }
    onMounted(() => {
      onAntiPhishingCodeChange()
    })

    return {
      isShowDetail,
      antiPhishingCode,
      onAntiPhishingCodeChange,
    }
  },
})
</script>
