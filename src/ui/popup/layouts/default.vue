<style lang="scss" scoped>
.layout-default {
  width: 350px;
  height: 630px;
}
</style>

<template>
  <div class="layout-default">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'LayoutDefault',
  components: {},
  data () {
    return {}
  },
}
</script>
