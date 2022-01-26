<style lang="scss" scoped>
.switch-key-box {
  .switch-key-content {
    overflow: hidden;
    overflow-y: scroll;
    max-height: 290px;
    &::-webkit-scrollbar {
      display: none;
    }
    padding-bottom: 61px;
    .derived-box,.imported-box {
      padding: 0 10px;
      margin-bottom: 8px;
      h2 {
        margin: 16px 0 8px 16px;
        font-size: $detail-font-size;
        line-height: 16px;
        color: #8D919C;
      }
      >div {
        padding: 11px 16px 11px 8px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        cursor: pointer;
        &:hover {
          background-color: #EEEEEE;
        }
        img {
          margin-right: 12px;
        }
        span {
          font-size: $detail-font-size;
          font-weight: bold;
          font-family: monospace;
          color: #242C3F;
          line-height: 16px;
        }
        .icon-font {
          margin-left: auto;
        }
      }
    }
  }
  .switch-key-btn-box{
    position: absolute;
    bottom: 0;
    padding: 12px;
    width: 100%;
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.06);
    background-color: #ffffff;
    .switch-key-btn {
      height: 37px;
    }
  }
}
</style>

<template>
  <UniDialog class="switch-key-box" :visible="visible" :title="$tt('Switch Key')" @cancel="handleSwitchCancel">
    <div class="switch-key-content">
      <div v-if="derivedUniKeys.length" class="derived-box">
        <h2>{{ $tt('Derived from Mnemonic') }}</h2>
        <div v-for="unikey in derivedUniKeys" :key="unikey.key" @click="onClickSetCurrentUnikey(unikey)">
          <img class="w-[26px] h-[26px]" :src="getImageUrl(unikey.keySymbol)">
          <span>{{ substringKey(unikey.key) }}</span>
          <Iconfont class="icon-font" :name="unikey.key == currentUnikey.key?'checked':'unchecked'" size="12" :color="unikey.key == currentUnikey.key?'#FFBC5D':'#E1E1E1'"></Iconfont>
        </div>
      </div>
      <div v-if="importedUniKeys.length" class="imported-box">
        <h2>{{ $tt('Imported') }}</h2>
        <div v-for="unikey in importedUniKeys" :key="unikey.key" @click="onClickSetCurrentUnikey(unikey)">
          <img class="w-[26px] h-[26px]" :src="getImageUrl(unikey.keySymbol)">
          <span>{{ substringKey(unikey.key) }}</span>
          <Iconfont class="icon-font" :name="unikey.key == currentUnikey.key?'checked':'unchecked'" size="12" :color="unikey.key == currentUnikey.key?'#FFBC5D':'#E1E1E1'"></Iconfont>
        </div>
      </div>
    </div>
    <div class="switch-key-btn-box">
      <UniBtn class="switch-key-btn" @click="$router.push('/addAddress')">
        {{ $tt('Add Key') }}
      </UniBtn>
    </div>
  </UniDialog>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { wallet } from '~/ui/controllers/wallet'
import { HDKeyrings } from '~/constants'
import { getImageUrl, substringKey } from '~/utils'

export default {
  name: 'SwitchKeyDialog',
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['cancel', 'hasSwitch'],
  setup (props, context) {
    const router = useRouter()

    const handleSwitchCancel = () => {
      context.emit('cancel')
    }

    const currentUnikey = ref(null)
    const visibleUnikeys = ref([])
    const derivedUniKeys = ref([])
    const importedUniKeys = ref([])
    onMounted(async () => {
      currentUnikey.value = await wallet.getCurrentUnikey()
      visibleUnikeys.value = await wallet.getVisibleUnikeys()
      derivedUniKeys.value = visibleUnikeys.value.filter(key => HDKeyrings.includes(key.keyringType))
      importedUniKeys.value = visibleUnikeys.value.filter(key => !HDKeyrings.includes(key.keyringType))
      console.log(currentUnikey.value, 'currentUnikey.value')
      console.log(visibleUnikeys.value, 'visibleUnikeys.value')
      console.log(derivedUniKeys.value, 'derivedUniKeys.value')
    })
    async function onClickSetCurrentUnikey (unikey) {
      await wallet.setCurrentUnikey(unikey.key)
      currentUnikey.value = await wallet.getCurrentUnikey()
      context.emit('hasSwitch')
      context.emit('cancel')
    }

    return {
      handleSwitchCancel,
      currentUnikey,
      visibleUnikeys,
      derivedUniKeys,
      importedUniKeys,
      substringKey,
      getImageUrl,
      onClickSetCurrentUnikey,
    }
  },
}
</script>
