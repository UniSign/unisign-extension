<style lang="scss">
.page-add-address {
  .box-item {
    .box-item_head {
      width: 40px;
    }
  }
}
</style>

<template>
  <div class="page-add-address">
    <UniTab :title="$tt('Select Key Type')"></UniTab>

    <div style="margin-top: 82px"></div>

    <BoxList v-for="(item,index) in keyTypes" :key="index">
      <BoxItem class="box-item" :to="`/addAddress/selectWays/${item.unikeySymbol}`">
        <template #head>
          <img class="icon-img" :src="getImageUrl(item.unikeySymbol)">
        </template>
        {{ item.name }}
      </BoxItem>
    </BoxList>

    <Ironman></Ironman>
  </div>
</template>

<script lang="ts">
import { CHAINS } from '~/constants'
import { getImageUrl } from '~/utils'
import BoxItem from '~/ui/components/Box/BoxItem.vue'
import BoxList from '~/ui/components/Box/BoxList.vue'

export default {
  name: 'PageAddAddress',
  components: {
    BoxItem,
    BoxList,
  },
  setup () {
    const keyTypes = Object.values(CHAINS)

    return {
      keyTypes,
      getImageUrl,
    }
  },
}
</script>
