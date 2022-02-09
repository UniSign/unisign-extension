<style lang="scss">
.box-list {
  margin: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(191, 191, 191, 0.09);
  overflow: hidden;
}
</style>

<template>
  <div class="box-list" :style="{marginTop: `${padTop}px`}">
    <slot />
  </div>
</template>

<script>

export default {
  name: 'BoxList',
  components: {},
  props: {
    padTop: Number,
  },
  data () {
    return {}
  },
}
</script>
