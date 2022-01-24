<style lang="scss" scoped>
    .input-wrapper {
        width: 254px;
        height: 50px;
        position: relative;
        input {
          width: 254px;
          height: 50px;
          padding-left: 16px;
          border-radius: 8px;
          font-size: $input-font-size;
          line-height: 22px;
          &:focus {
              outline:none;
              border: 1px solid $input-boder-focus-color;
          }
          &._error {
              outline:none;
              border: 1px solid $input-boder-error-color;
          }
        }
        div {
          position: absolute;
          top: 5px;
          right: 5px;
          padding: 10px;
          border-radius: 4px;
          background: #FFFFFF;
          cursor: pointer;
          .icon-font{
            color:#242C3F;
          }
          &:hover {
            background: #FBAF34;
            .icon-font{
              color:#FFFFFF;
            }
          }
        }
        p {
          margin-top: 2px;
          line-height: 14px;
          color: $input-boder-error-color;
        }
    }
</style>

<template>
  <div class="input-wrapper" :style="{'width':width}">
    <input
      :style="{'width':width,'height':height,'backgroundColor':backgroundColor}"
      :class="{'_error':canShowValidateText}"
      type="text"
      :value="modelValue"
      :placeholder="$tt(placeholder)"
      @input="onInputChange"
    >
    <div v-if="showLocked" @click="triggerValidate">
      <Iconfont class="icon-font" name="arrow-enter" size="18"></Iconfont>
    </div>
    <p v-show="canShowValidateText">
      {{ $tt(validateText) }}
    </p>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

export default defineComponent({
  props: {
    width: {
      type: String,
      required: false,
      default: '254px',
    },
    height: {
      type: String,
      required: false,
      default: '50px',
    },
    backgroundColor: {
      type: String,
      required: false,
      default: 'rgba(0, 0, 0, 0.08)',
    },
    modelValue: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: false,
      default: 'Set a password',
    },
    validateText: {
      type: String,
      required: false,
      default: 'The passwords do not match',
    },
    showLocked: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['update:modelValue', 'triggerValidate'],
  setup (props, context) {
    const canShowValidateText = ref(false)
    function onInputChange (e: InputEvent) {
      canShowValidateText.value = false
      context.emit('update:modelValue', e.target.value)
    }
    const validate = () => {
      canShowValidateText.value = true
    }
    function triggerValidate (e: InputEvent) {
      context.emit('triggerValidate', e.target.value)
    }
    return {
      onInputChange,
      canShowValidateText,
      validate,
      triggerValidate,
    }
  },
})
</script>
