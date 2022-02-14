<style lang="scss" scoped>
.page-key-management {
  position: relative;
  width: 100%;
  height: 100%;
  .settings-box {
    padding: 58px 8px 81px;
    h2 {
      margin: 16px 0 8px 16px;
      font-size: $detail-font-size;
      line-height: 16px;
      color: #8D919C;
    }
    .settings-item-box {
      position: relative;
      margin-bottom: 8px;
      padding: 11px 16px 11px 8px;
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      border-radius: 8px;
      cursor: pointer;

      &:hover {
        background: #F0EDED;
      }

      &._hidden {
        .box_content {
          color: #8D919C;
        }
        .box_content_desc {
          font-size: 14px;
          font-weight: 400;
          font-family: sans-serif;
        }
      }

      .box_content {
        font-size: $input-font-size;
        font-weight: bold;
        font-family: monospace;
      }

      img {
        margin-right: 12px;
        width: 26px;
        height: 26px;
      }

      .arrow-right {
        margin-left: auto;
        width: 28px;
        height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        &:hover {
          background: rgba(36, 44, 63, 0.06);
        }
      }
      .popover {
        position: absolute;
        z-index: 1;
        top: 42px;
        right: 8px;
        padding: 4px;
        box-sizing: border-box;
        box-shadow: 0px 19px 22px 0px rgba(141, 145, 156, 0.3);
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.12);
        font-size: $input-font-size;
        background: #ffffff;
        div {
          padding: 8px;
          width: 100%;
          height: 32px;
          line-height: 16px;
          &:hover {
            background: #EEEEEE;
            border-radius: 4px;
          }
        }
      }
    }
  }
  .add-key-btn-box {
    position: fixed;
    bottom: 20px;
    padding: 12px;
    width: 100%;
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.06);
    background-color: #ffffff;
    .add-key-btn {
      height: 37px;
    }
  }
}

</style>

<template>
  <div class="page-key-management">
    <UniTab :title="$tt('Key Management')" />
    <div class="settings-box">
      <template v-if="derivedUniKeys.length">
        <h2>{{ $tt('Derived from Mnemonic') }}</h2>
        <div v-for="unikey in derivedUniKeys" :key="unikey.key" class="settings-item-box" :class="{_hidden: unikey.hidden}">
          <img :src="getImageUrl(unikey.keySymbol,unikey.hidden)">
          <span class="box_content">
            {{ substringKey(unikey.key) }}
            <div v-if="unikey.hidden" class="box_content_desc">
              {{ $tt(`Disabled`) }}
            </div>
          </span>
          <div class="arrow-right" @click="onClickSettings(unikey)">
            <Iconfont name="more" width="12" height="12" color="#6F7684" />
          </div>
          <div v-if="unikey.key === isSettingkey" v-click-outside="onClickOutside" class="popover">
            <div v-if="unikey.hidden" @click="onClickEnable(unikey)">
              {{ $tt('Enable') }}
            </div>
            <div v-else-if="!unikey.hidden && canDisabled" @click="onClickDisable(unikey)">
              {{ $tt('Disable') }}
            </div>
            <div @click="onClickViewPrivateKey(unikey)">
              {{ $tt('View Private Key') }}
            </div>
            <div @click="onClickViewMnemonic(unikey)">
              {{ $tt('View Mnemonic') }}
            </div>
          </div>
        </div>
      </template>

      <template v-if="importedUniKeys.length">
        <h2>{{ $tt('Imported') }}</h2>
        <div v-for="unikey in importedUniKeys" :key="unikey.key" class="settings-item-box">
          <img :src="getImageUrl(unikey.keySymbol)">
          <span>{{ substringKey(unikey.key) }}</span>
          <div class="arrow-right" @click="onClickSettings(unikey)">
            <Iconfont name="more" width="12" height="12" color="#6F7684" />
          </div>
          <div v-if="unikey.key === isSettingkey" v-click-outside="onClickOutside" class="popover">
            <div @click="onClickDeletePrivateKey(unikey)">
              {{ $tt('Delete') }}
            </div>
            <div @click="onClickViewPrivateKey(unikey)">
              {{ $tt('View Private Key') }}
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="add-key-btn-box">
      <UniBtn class="add-key-btn" @click="$router.push('/addAddress')">
        {{ $tt('Add Key') }}
      </UniBtn>
    </div>
    <Ironman />
    <KeySettingsDialog ref="keySettingsDialogRef" @onUnikeysChanged="onUnikeysChanged" />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import KeySettingsDialog from './-/KeySettingsDialog.vue'
import { wallet } from '~/ui/controllers/wallet'
import { HDKeyrings } from '~/constants'
import { getImageUrl, substringKey } from '~/utils'
import type { Unikey } from '~/background/services/unikey'

export default {
  name: 'PageKeyManagement',
  components: {
    KeySettingsDialog,
  },
  setup () {
    const keySettingsDialogRef = ref<InstanceType<typeof KeySettingsDialog>>()

    // unikey
    const unikeys = ref<Unikey[]>([])
    const derivedUniKeys = ref<Unikey[]>([])
    const importedUniKeys = ref<Unikey[]>([])
    const canDisabled = ref(true)
    const getkeysCategory = async () => {
      unikeys.value = await wallet.getUnikeys()
      derivedUniKeys.value = unikeys.value.filter(key => HDKeyrings.includes(key.keyringType)).sort(a => a.hidden === true ? 1 : -1)
      importedUniKeys.value = unikeys.value.filter(key => !HDKeyrings.includes(key.keyringType))
      canDisabled.value = derivedUniKeys.value.filter(key => !key.hidden).length > 1
    }
    const onUnikeysChanged = async () => {
      getkeysCategory()
    }
    onMounted(() => {
      onUnikeysChanged()
    })

    // Settings
    const isSettingkey = ref('')
    const onClickSettings = (unikey: Unikey) => {
      if (unikey.key === isSettingkey.value) {
        isSettingkey.value = ''
      }
      else {
        isSettingkey.value = unikey.key
      }
    }

    // Disable
    const onClickDisable = async (unikey: Unikey) => {
      await wallet.hideUnikey(unikey.key)
      isSettingkey.value = ''
      onUnikeysChanged()
    }

    // Enable
    const onClickEnable = async (unikey: Unikey) => {
      await wallet.showUnikey(unikey.key)
      isSettingkey.value = ''
      onUnikeysChanged()
    }

    // viewPrivateKey
    const onClickViewPrivateKey = (unikey: Unikey) => {
      isSettingkey.value = ''
      keySettingsDialogRef.value?.onClickViewPrivateKey(unikey)
    }

    // viewMnemonic
    const onClickViewMnemonic = () => {
      isSettingkey.value = ''
      keySettingsDialogRef.value?.onClickViewMnemonic()
    }

    // deletePrivateKey
    const onClickDeletePrivateKey = (unikey: Unikey) => {
      isSettingkey.value = ''
      keySettingsDialogRef.value?.onClickDeletePrivateKey(unikey)
    }

    return {
      keySettingsDialogRef,

      // unikey
      unikeys,
      derivedUniKeys,
      importedUniKeys,
      canDisabled,
      getImageUrl,
      substringKey,
      onUnikeysChanged,

      // Settings
      isSettingkey,
      onClickSettings,

      // disabled
      onClickDisable,

      // Enable
      onClickEnable,

      // viewPrivateKey
      onClickViewPrivateKey,

      // viewMnemonic
      onClickViewMnemonic,

      // deletePrivateKey
      onClickDeletePrivateKey,

      onClickOutside () {
        isSettingkey.value = ''
      },
    }
  },
}
</script>
