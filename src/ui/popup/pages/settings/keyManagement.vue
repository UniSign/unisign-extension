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
      img {
        margin-right: 12px;
        width: 26px;
        height: 26px;
      }
      &:hover {
        background: #F0EDED;
      }
      span {
        font-size: $input-font-size;
        font-weight: bold;
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
  .dangerousDialog {
    .slot-container {
      padding: 24px;
      .text{
        margin-bottom: 48px;
        font-size: $input-font-size;
        line-height: 22px;
      }
    }
  }
  .securityDialog {
    .slot-container {
      padding: 32px 24px 24px;
    }
  }
  .privateKeyDialog {
    .slot-container {
      padding: 24px;
      .text{
        margin-bottom: 48px;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid rgba(191, 191, 191, 0.09);
        font-weight: bold;
        font-size: $input-font-size;
        line-height: 20px;
        word-wrap: break-word;
        word-break: break-all;
        background: #F9F7F6;
      }
    }
  }
  .mnemonicDialog {
    .slot-container {
      padding: 24px;
      .mnemonic-box {
        margin-bottom: 40px;
        display: flex;
        flex-wrap: wrap;
        .mnemonic-item {
          margin: 0 5px 8px 0;
          width: 86px;
          height: 32px;
          box-sizing: border-box;
          border-radius: 4px;
          border: 1px solid rgba(191, 191, 191, 0.09);
          display: flex;
          align-items: center;
          background: #F9F7F6;
          &:nth-child(3n) {
            margin: 0 0 8px 0;
          }
          span {
            margin: 0 9px 0 8px;
            line-height: 14px;
            color: #C9CCD3;
          }
          p {
            font-size: $detail-font-size;
            font-weight: bold;
            line-height: 16px;
          }
        }
      }
    }
  }
  .deleteKeyDialog {
    .slot-container {
      padding: 24px;
      >p {
        font-size: $main-font-size;
        line-height: 21px;
        &:nth-child(2) {
          margin-bottom: 16px;
        }
        >span {
          font-size: $main-font-size;
          line-height: 21px;
          color: $error-btn-bg;
        }
      }
      .uni-btn {
        ::v-deep .reject {
          border:none;
          background: #F7F8FA;
          color: #0D0C0C;
        }
        ::v-deep .allow {
          border:none;
          background: #EE5757;
        }
      }
    }
  }
}

</style>

<template>
  <div class="page-key-management">
    <UniTab :title="$tt('Key Management')"></UniTab>
    <div class="settings-box">
      <template v-if="derivedUniKeys.length">
        <h2>{{ $tt('Derived from Mnemonic') }}</h2>
        <div v-for="unikey in derivedUniKeys" :key="unikey.key" class="settings-item-box">
          <img :src="getImageUrl(unikey.keySymbol,unikey.hidden)">
          <span>{{ substringKey(unikey.key) }}</span>
          <div class="arrow-right" @click="onClickSettings(unikey)">
            <Iconfont name="more" width="12" height="12" color="#6F7684"></Iconfont>
          </div>
          <div v-show="unikey.key === isSettingkey" class="popover">
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
            <Iconfont name="more" width="12" height="12" color="#6F7684"></Iconfont>
          </div>
          <div v-show="unikey.key === isSettingkey" class="popover">
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
    <Ironman></Ironman>
    <KeySettingsDialog ref="keySettingsDialogRef" @onUnikeysChanged="onUnikeysChanged"></KeySettingsDialog>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import KeySettingsDialog from './-/KeySettingsDialog.vue'
import { wallet } from '~/ui/controllers/wallet'
import { HDKeyrings } from '~/constants'
import { getImageUrl, substringKey } from '~/utils'
import { Unikey } from '~/background/services/unikey'

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
      console.log(unikeys.value, 'unikeys.value')
      console.log(derivedUniKeys.value, 'derivedUniKeys.value')
      console.log(importedUniKeys.value, 'importedUniKeys.value')
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
    }
  },
}
</script>
