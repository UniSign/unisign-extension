<style lang="scss" scoped>
.layout-default {
  width: 350px;
  height: 600px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>

<template>
  <div class="layout-default">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">

export default {
  name: 'LayoutDefault',
  components: {},
  data () {
    return {}
  },
}
</script>
