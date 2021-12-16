<style lang="scss" scoped>
    .input-wrapper {
        textarea {
          padding: 12px 16px;
          border-radius: 8px;
          font-size: $input-font-size;
          font-weight: 400;
          line-height: 19px;
          background: #F7F8FA;
          color: $main-color;
          resize: none;
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
          margin-top: -4px;
          margin-left: 16px;
          font-size: $default-font-size;
          font-weight: 400;
          line-height: 14px;
          color: $input-boder-error-color;
        }
    }
</style>

<template>
  <div class="input-wrapper" :style="{'width':width}">
    <textarea
      :style="{'width':width,'height':height}"
      :class="{'_error':canShowValidateText}"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInputChange"
    >
    </textarea>
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
      default: '302px',
    },
    height: {
      type: String,
      required: false,
      default: '95px',
    },
    modelValue: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: false,
      default: 'Bitcoin private key',
    },
    validateText: {
      type: String,
      required: false,
      default: 'Incorrect private key',
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
