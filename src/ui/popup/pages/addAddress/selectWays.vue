<style lang="scss" scoped>
.page-add-address {
  position: relative;
  width: 100%;
  height: 100%;
  .key-box {
    padding: 82px 16px;
    .key-item-box {
      width: 100%;
      height: 66px;
      padding: 15px 16px 15px 10px;
      border-radius: 12px;
      border: 1px solid rgba(191, 191, 191, 0.09);
      display: flex;
      align-items: center;
      background: #F9F7F6;
      cursor: pointer;
      &:hover {
        background: #F0EDED;
      }
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 36px;
        margin-right: 8px;
      }
      span {
        font-size: $input-font-size;
        font-weight: 500;
      }
      .arrow-right {
        margin-left: auto;
      }
    }
  }
}
</style>

<template>
  <div class="page-add-address">
    <UniTab></UniTab>
    <div class="key-box">
      <div v-if="hasMnemonic" class="key-item-box mb-[24px]" @click="onClickDeriveAddress">
        <div>
          <Iconfont name="create" size="17" color="#6D8AF3"></Iconfont>
        </div>
        <span>{{ $tt('Derive From Mnemonic') }}</span>
        <Iconfont class="arrow-right" name="arrow-right" width="12" height="14" color="#D8D8D8"></Iconfont>
      </div>
      <div v-else class="key-item-box mb-[24px]" @click="$router.push('/addAddress/createMnemonic')">
        <div>
          <Iconfont name="create" size="17" color="#6D8AF3"></Iconfont>
        </div>
        <span>{{ $tt('Create Mnemonic') }}</span>
        <Iconfont class="arrow-right" name="arrow-right" width="12" height="14" color="#D8D8D8"></Iconfont>
      </div>
      <div class="key-item-box" style="border-radius: 12px 12px 0px 0px;" @click="$router.push(`/import/importPrivateKey/${$route.params.key}`)">
        <div>
          <Iconfont name="key" size="17" color="#8E98B2"></Iconfont>
        </div>
        <span>{{ $tt('Import by priority key') }}</span>
        <Iconfont class="arrow-right" name="arrow-right" width="12" height="14" color="#D8D8D8"></Iconfont>
      </div>
      <div v-if="!hasMnemonic" class="key-item-box" style="border-radius: 0px;" @click="$router.push('/import/importMnemonic')">
        <div>
          <Iconfont name="mnemonic" size="17" color="#B2EED7"></Iconfont>
        </div>
        <span>{{ $tt('Import by Mnemonic') }}</span>
        <Iconfont class="arrow-right" name="arrow-right" width="12" height="14" color="#D8D8D8"></Iconfont>
      </div>
      <!-- <div class="key-item-box" style="border-radius: 0px 0px 12px 12px;" @click="$router.push(`/importKeystoreFile/${$route.params.key}`)">
        <div>
          <Iconfont name="keystore" size="17" color="#FFCC59"></Iconfont>
        </div>
        <span>{{ $tt('Import Keystore') }}</span>
        <Iconfont class="arrow-right" name="arrow-right" width="12" height="14" color="#D8D8D8"></Iconfont>
      </div> -->
      <!-- <div class="key-item-box mt-[24px]">
        <div>
          <Iconfont name="hardwallet" size="17" color="#9689FF"></Iconfont>
        </div>
        <span>{{ $tt('Connect hard wallet') }}</span>
        <Iconfont class="arrow-right" name="arrow-right" width="12" height="14" color="#D8D8D8"></Iconfont>
      </div> -->
    </div>
    <Ironman></Ironman>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KeyIdentifier } from '~/constants'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageAddAddress',
  setup () {
    const hasMnemonic = ref(true)
    onMounted(async () => {
      hasMnemonic.value = await wallet.hasMnemonic()
    })

    const router = useRouter()
    const route = useRoute()
    const onClickDeriveAddress = async () => {
      await wallet.deriveNewAccountFromMnemonic(route.params.key as KeyIdentifier)
      router.push('/addAddress/addAddressSuccess')
    }

    return {
      hasMnemonic,

      onClickDeriveAddress,
    }
  },
}
</script>
