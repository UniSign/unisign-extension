<style lang="scss">
.layout-default {

}
</style>

<template>
  <div class="layout-default w-[300px] py-2 text-center">
    <h1>
      This is the header of default Popup layout
    </h1>

    <hr>

    <div>
      <router-link to="/" style="color: unset">Welcome</router-link>
      |
      <router-link to="/unlock" style="color: unset">Unlock</router-link>
    </div>

    <hr>

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
