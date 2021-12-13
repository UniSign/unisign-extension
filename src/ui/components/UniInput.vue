<style lang="scss" scoped>
    .input-wrapper {
        width: 254px;
        height: 50px;
        input {
            width: 254px;
            height: 50px;
            padding-left: 16px;
            font-size: 16px;
            font-weight: 400;
            color: #242C3F;
            line-height: 22px;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.08);
            &:focus {
                outline:none;
                border: 1px solid #FBAF34;
            }
            &._error {
                outline:none;
                border: 1px solid #F72B35;
            }
        }
        p {
            font-size: 12px;
            font-weight: 400;
            color: #F72B35;
            line-height: 14px;
            margin-top: 2px;
        }
    }
</style>

<template>
  <div class="input-wrapper">
    <input :class="{'_error':canShowValidateText}" type="text" :value="modelValue" :placeholder="placeholder" @input="onInputChange">
    <p v-show="canShowValidateText">
      {{ validateText }}
    </p>
  </div>
</template>

<script>
import { ref, toRefs } from 'vue'

export default {
  props: {
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
