<style lang="scss" scoped>
    .input-wrapper {
        width: 254px;
        height: 50px;
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
      :placeholder="placeholder"
      @input="onInputChange"
    >
    <p v-show="canShowValidateText">
      {{ validateText }}
    </p>
  </div>
</template>

<script>
import { ref, toRefs } from 'vue'

export default {
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
  },
  setup (props, context) {
    const canShowValidateText = ref(false)
    const { validateText } = toRefs(props)
    function onInputChange (e) {
      canShowValidateText.value = false
      context.emit('update:modelValue', e.target.value)
    }
    const validate = () => {
      if (validateText.value) {
        canShowValidateText.value = true
      }
    }
    return {
      onInputChange,
      canShowValidateText,
      validate,
    }
  },
}
</script>
