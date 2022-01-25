<style lang="scss" scoped>
.page-language-settings {
  position: relative;
  width: 100%;
  height: 100%;
  .settings-box {
    padding: 70px 16px 12px;
    .settings-item-box {
      width: 100%;
      height: 66px;

      margin-top: 12px;
      padding: 13px 17px 13px 21px;
      border-radius: 12px;
      border: 1px solid rgba(191, 191, 191, 0.09);
      display: flex;
      align-items: center;
      background: #F9F7F6;
      cursor: pointer;
      &:hover {
        background: #F0EDED;
      }
      span {
        font-size: $input-font-size;
        font-weight: 500;
      }
      .icon-font {
        margin-left: auto;
      }
    }
  }
}
</style>

<template>
  <div class="page-language-settings">
    <UniTab :title="$tt('language')"></UniTab>
    <div class="settings-box">
      <div v-for="lang in LocaleOptions" :key="lang.value" class="settings-item-box" @click="onChangeLocale(lang.value)">
        <span>{{ lang.text }}</span>
        <Iconfont class="icon-font" :name="lang.value==locale?'checked':'unchecked'" size="12" :color="lang.value==locale?'#FFBC5D':'#E1E1E1'"></Iconfont>
      </div>
    </div>
    <Ironman></Ironman>
  </div>
</template>

<script lang="ts">
import { wallet } from '~/ui/controllers/wallet'
import { LocaleOptions, LOCALES } from '~/constants'

export default {
  name: 'PageSettings',
  setup () {
    const locale = ref('')
    async function onChangeLocale (value: LOCALES) {
      locale.value = await wallet.setLocale(value)
    }
    onMounted(async () => {
      locale.value = await wallet.getLocale()
    })

    return {
      locale,
      LOCALES,
      LocaleOptions,
      onChangeLocale,
    }
  },
}
</script>
