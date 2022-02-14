<style lang="scss">
.tooltip {
  display: none;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 7px 11px;
  box-sizing: border-box;
  box-shadow: 0px 5px 6px 0px rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  font-size: $detail-font-size;
  font-weight: 500;
  white-space: nowrap;
  background: #11142D;
  color: #FFFFFF;

  &::after {
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-style: solid;
  }

  &._bottom {
    bottom: -42px;

    &::after {
      top: -6px;
      border-width: 0 6px 6px;
      border-color: transparent transparent #0D0C49;
    }
  }

  &._top {
    top: -42px;

    &::after {
      bottom: -6px;
      border-width: 6px 6px 0px;
      border-color: #0D0C49 transparent transparent;
    }
  }
}
</style>

<template>
  <div class="tooltip" :class="{_bottom: bottom, _top: top}">
    <slot />
  </div>
</template>

<script>

export default {
  name: 'Tooltip',
  components: {},
  props: {
    bottom: Boolean,
    top: Boolean,
  },
  data () {
    return {}
  },
}
</script>
