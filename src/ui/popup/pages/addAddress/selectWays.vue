<style lang="scss" scoped>
.page-add-address {
}
</style>

<template>
  <div class="page-add-address">
    <UniTab :title="$tt('Select Ways')" />

    <BoxList :pad-top="82">
      <BoxItem v-if="hasMnemonic" @click="onClickDeriveAddress">
        <template #head>
          <Iconfont name="create" size="17" color="#6D8AF3" />
        </template>

        {{ $tt('Derive From Mnemonic') }}
      </BoxItem>

      <BoxItem v-else to="/addAddress/createMnemonic">
        <template #head>
          <Iconfont name="create" size="17" color="#6D8AF3" />
        </template>

        {{ $tt('Create Mnemonic') }}
      </BoxItem>
    </BoxList>

    <BoxList>
      <BoxItem v-if="hasMnemonic" :to="`/import/importPrivateKey/${$route.params.key}`">
        <template #head>
          <Iconfont name="key" size="17" color="#8E98B2" />
        </template>
        {{ $tt('Import by priority key') }}
      </BoxItem>

      <BoxItem v-if="!hasMnemonic" to="/import/importMnemonic">
        <template #head>
          <Iconfont name="mnemonic" size="17" color="#B2EED7" />
        </template>
        {{ $tt('Import by Mnemonic') }}
      </BoxItem>
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
    </BoxList>
    <Ironman />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { KeyIdentifier } from '~/constants'
import { wallet } from '~/ui/controllers/wallet'
import BoxList from '~/ui/components/Box/BoxList.vue'
import BoxItem from '~/ui/components/Box/BoxItem.vue'

export default {
  name: 'PageAddAddress',
  components: {
    BoxList,
    BoxItem,
  },
  setup () {
    const hasMnemonic = ref(true)
    onMounted(async () => {
      hasMnemonic.value = await wallet.hasMnemonic()
    })

    const router = useRouter()
    const route = useRoute()
    const onClickDeriveAddress = async () => {
      await wallet.deriveNewAccountFromMnemonic(route.params.key as KeyIdentifier)
      router.push('/addAddress/addAddressSuccess?title=DeriveFromMnemonic')
    }

    return {
      hasMnemonic,

      onClickDeriveAddress,
    }
  },
}
</script>
