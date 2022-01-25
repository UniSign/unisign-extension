<style lang="scss" scoped>
    .input-wrapper {
        textarea {
          padding: 12px 16px;
          border-radius: 8px;
          font-size: $input-font-size;
          line-height: 19px;
          background: #F7F8FA;
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

<script lang="ts">
import { ref, toRefs, defineComponent } from 'vue'

export default defineComponent({
  name: 'UniTextArea',
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
  emits: ['update:modelValue'],
  setup (props, context) {
    const canShowValidateText = ref(false)
    const { validateText } = toRefs(props)
    function onInputChange (e: InputEvent) {
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
})
</script>
