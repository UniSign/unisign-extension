<style lang="scss" scoped>
  .uni-msg {
    position: fixed;
    z-index: 1000;
    top: 7px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.06);
    border-radius: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $input-font-size;
    font-weight: 600;
    color: #FFFFFF;
    text-align: center;
  }
</style>

<template>
  <div class="uni-msg" :style="{'width':width,'height':height,'background-color':type==='success'?'#41C190':'#EE5757'}">
    <Iconfont :name="type==='success'?'checked':'error'" size="16" color="#fff" class="mr-[8px]"></Iconfont>
    {{ content }}
  </div>
</template>

<script>

export default {
  props: {
    width: {
      type: String,
      required: false,
      default: '226px',
    },
    height: {
      type: String,
      required: false,
      default: '44px',
    },
    type: {
      type: String,
      required: false,
      default: 'error',
    },
    content: {
      type: String,
      required: false,
      default: 'Incorrect order',
    },
  },
  emits: ['closeMsg'],
  setup (props, context) {
    onMounted(() => {
      setTimeout(() => {
        context.emit('closeMsg')
      }, 3000)
    })
    return {
    }
  },
}
</script>
