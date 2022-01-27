<style lang="scss" scoped>
.page-add-address-success {
  position: relative;
  width: 100%;
  height: 100%;
  .central-content {
    padding-top: 58px;
    h2 {
      font-size: 32px;
      font-weight: bold;
      line-height: 38px;
      text-align: center;
    }
  }
  .uni-btn {
    position: absolute;
    bottom: 178px;
    left: 50%;
    transform: translateX(-50%);
    width: 210px;
  }
}
</style>

<template>
  <div class="page-add-address-success">
    <UniTab :disabled="true" :title="title"></UniTab>
    <div class="central-content">
      <img class="w-[189px] h-[161px] mx-auto mt-[77px]" :src="`/assets/page-addAddress/success-bg.png`">
      <h2>{{ $tt('Success') }}</h2>
    </div>
    <UniBtn class="uni-btn" @click="$router.push(`/setup/home`)">
      {{ $tt('Start to use') }}
    </UniBtn>
    <Ironman></Ironman>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export default {
  name: 'PageAddAddressSuccess',
  setup () {
    const route = useRoute()
    const i18n = useI18n()
    const title = ref('')
    onMounted(async () => {
      if (route.query.title === 'Derive From Mnemonic') {
        title.value = i18n.$tt('Derive From Mnemonic')
      }
      else {
        title.value = i18n.$tt('Create Mnemonic')
      }
    })

    return {
      title,
    }
  },
}
</script>
