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
    <UniTab title="Key Management"></UniTab>
    <div class="settings-box">
      <template v-if="derivedUniKeys.length">
        <h2>Derived from Mnemonic</h2>
        <div v-for="unikey in derivedUniKeys" :key="unikey.key" class="settings-item-box">
          <img :src="getImageUrl(unikey.keySymbol)">
          <span>{{ substringKey(unikey.key) }}</span>
          <div class="arrow-right" @click="onClickSettings(unikey)">
            <Iconfont name="more" width="12" height="12" color="#6F7684"></Iconfont>
          </div>
          <div v-show="unikey.isSetting" class="popover">
            <div @click="onClickDisabled(unikey)">
              Disabled
            </div>
            <div @click="onClickViewPrivateKey(unikey)">
              View Private Key
            </div>
            <div @click="onClickViewMnemonic(unikey)">
              View Mnemonic
            </div>
          </div>
        </div>
      </template>
      <template v-if="importedUniKeys.length">
        <h2>Imported</h2>
        <div v-for="unikey in importedUniKeys" :key="unikey.key" class="settings-item-box">
          <img :src="getImageUrl(unikey.keySymbol)">
          <span>{{ substringKey(unikey.key) }}</span>
          <div class="arrow-right" @click="onClickSettings(unikey)">
            <Iconfont name="more" width="12" height="12" color="#6F7684"></Iconfont>
          </div>
          <div v-show="unikey.isSetting" class="popover">
            <div @click="onClickDeletePrivateKey(unikey)">
              Delete
            </div>
            <div @click="onClickViewPrivateKey(unikey)">
              View Private Key
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="add-key-btn-box">
      <UniBtn class="add-key-btn" @click="$router.push('/addAddress')">
        Add Key
      </UniBtn>
    </div>
    <Ironman></Ironman>
    <UniDialog class="dangerousDialog" error :visible="isShowDangerousDialog" title="Dangerous Action" @cancel="isShowDangerousDialog = false">
      <div class="slot-container">
        <div class="text">
          {{ dangerousText }}
        </div>
        <UniBtn class="uni-btn" error @click="handleDangerousCancel">
          I got it
        </UniBtn>
      </div>
    </UniDialog>
    <UniDialog class="securityDialog" :visible="isShowSecurityDialog" title="Security Verification" @cancel="isShowSecurityDialog = false">
      <div class="slot-container">
        <UniInput
          ref="passwordRef"
          v-model="password"
          width="100%"
          background-color="#F7F8FA"
          class="uni-input mb-[58px]"
          :validate-text="validataText"
        ></UniInput>
        <UniBtn class="uni-btn" :disabled="!password" @click="handleSecurityCancel">
        </UniBtn>
      </div>
    </UniDialog>
    <UniDialog class="privateKeyDialog" :visible="isShowPrivateKeyDialog" title="Private Key" @cancel="isShowPrivateKeyDialog= false">
      <div class="slot-container">
        <div class="text">
          {{ selectedprivateKey }}
        </div>
        <UniBtn class="uni-btn" @click="handlePrivateKeyCancel">
          OK
        </UniBtn>
      </div>
    </UniDialog>
    <UniDialog class="mnemonicDialog" :visible="isShowMnemonicDialog" title="Mnemonic" @cancel="isShowMnemonicDialog= false">
      <div class="slot-container">
        <div class="mnemonic-box">
          <div v-for="(item,index) in mnemonicArr" :key="index" class="mnemonic-item">
            <span>{{ index+1 }}</span>
            <p>{{ item }}</p>
          </div>
        </div>
        <UniBtn class="uni-btn" @click="handleMnemonicCancel">
          OK
        </UniBtn>
      </div>
    </UniDialog>
    <UniDialog class="deleteKeyDialog" error :visible="isShowDeleteKeyDialog" title="Delete Key" @cancel="isShowDeleteKeyDialog= false">
      <div class="slot-container">
        <p>Confirm to delete,</p>
        <p>enter <span>Delete Key</span> below.</p>
        <UniInput
          ref="deleteKeyRef"
          v-model="deleteKey"
          width="100%"
          background-color="#F7F8FA"
          class="uni-input mb-[48px]"
          placeholder="Please enter Delete Key"
          validate-text="Incorrect input"
        ></UniInput>
        <UniDoubleBtn class="uni-btn" :disabled="!deleteKey" @rejectClick="isShowDeleteKeyDialog= false" @allowClick="handleDeleteKeyCancel">
          <template #reject>
            Cancle
          </template>
          <template #allow>
            Delete
          </template>
        </UniDoubleBtn>
      </div>
    </UniDialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { wallet } from '~/ui/controllers/wallet'
import { HDKeyrings } from '~/constants'
import { getImageUrl,substringKey } from '~/utils'

export default {
  name: 'PageKeyManagement',
  setup () {
    // unikey
    const unikeys = ref([])
    const derivedUniKeys = ref([])
    const importedUniKeys = ref([])
    const getkeysCategory = () => {
      derivedUniKeys.value = unikeys.value.filter(key => HDKeyrings.includes(key.keyringType))
      importedUniKeys.value = unikeys.value.filter(key => !HDKeyrings.includes(key.keyringType))
    }
    const onUnikeysChanged = async() => {
      unikeys.value = await wallet.getUnikeys()
      unikeys.value = unikeys.value.map(key=>{
        return {
          ...key,
          isSetting:false
        }
      })
      getkeysCategory()
      console.log(unikeys.value, 'unikeys.value')
      console.log(derivedUniKeys.value, 'derivedUniKeys.value')
      console.log(importedUniKeys.value, 'importedUniKeys.value')
    }
    onMounted(() => {
      onUnikeysChanged()
    })

    // Settings
    const onClickSettings = (unikey) =>{
      if(!unikey.isSetting) {
        unikeys.value = unikeys.value.map(key=>{
          return {
            ...key,
            isSetting:key.key == unikey.key
          }
        })
        getkeysCategory()
      }else {
        unikey.isSetting = false
      }
    }

    // securityDialog
    let currentEventName = null
    let currentUnikey = {}
    const password = ref('')
    const passwordRef = ref(null)
    const validataText = ref('')
    const isShowSecurityDialog = ref(false)
    const mnemonicArr = ref([
      'defense',
      'light',
      'accident',
      'opinion',
      'benefit',
      'match',
      'trim',
      'slogan',
      'festival',
      'during',
      'cheap',
      'mix',
    ])
    const onValidateError = () => {
      validataText.value = e
      passwordRef.value.validate()
      throw new Error(e)
    } 
    const handleSecurityCancel = async() => {
      if (!password.value) return
      if(currentEventName == 'viewPrivateKey') {
        selectedprivateKey.value = await wallet.getPrivateKey(password.value, currentUnikey.key, currentUnikey.keyringType).catch((e) => {
          onValidateError()
        })
        isShowPrivateKeyDialog.value = true
      }else if(currentEventName == 'viewMnemonic') {
        let mnemonic = await wallet.getMnemonic(password.value).catch((e) => {
          onValidateError()
        })
        // Error
        console.log(mnemonic,'mnemonic')
        mnemonicArr.value = mnemonic.split(' ')
        isShowMnemonicDialog.value = true
      }else if (currentEventName == 'deletePrivateKey') {
        console.log(currentUnikey,'unikey');
        selectedprivateKey.value = await wallet.removeUnikey(password.value, currentUnikey).catch((e) => {
          onValidateError()
        })
      }
      currentUnikey = {}
      currentEventName = null
      password.value = ''
      isShowSecurityDialog.value = false
      onUnikeysChanged()
    }

    // dangerousDialog
    const isShowDangerousDialog = ref(false)
    const dangerousText = ref('Do not disclose your private key to anyone. Anyone who has your private key can steal your assets.')
    const handleDangerousCancel = () => {
      isShowDangerousDialog.value = false
      if(currentEventName == 'viewPrivateKey' || currentEventName == 'viewMnemonic') {
        isShowSecurityDialog.value = true
      }else if (currentEventName == 'deletePrivateKey') {
        isShowDeleteKeyDialog.value = true
      }
    }

    // disabled
    const onClickDisabled = async(unikey) => {
      await wallet.hideUnikey(unikey.key)
      unikey.isSetting = false
    }
                                                      
    // viewPrivateKey
    const selectedprivateKey = ref(null)
    const isShowPrivateKeyDialog = ref(false)
    const onClickViewPrivateKey = (unikey) => {
      unikey.isSetting = false
      currentUnikey = unikey
      currentEventName = 'viewPrivateKey'
      isShowDangerousDialog.value = true
    }
    const handlePrivateKeyCancel = () => {
      isShowPrivateKeyDialog.value = false
    }

    // viewMnemonic
    const isShowMnemonicDialog = ref(false)
    const onClickViewMnemonic = (unikey) => {
      unikey.isSetting = false
      currentEventName = 'viewMnemonic'
      isShowDangerousDialog.value = true
    }
    const handleMnemonicCancel = () => {
      isShowMnemonicDialog.value = false
    }
    

    // deletePrivateKey
    const deleteKey = ref(null)
    const deleteKeyRef = ref(null)
    const isShowDeleteKeyDialog = ref(false)
    const onClickDeletePrivateKey = (unikey) => {
      unikey.isSetting = false
      currentUnikey = unikey
      currentEventName = 'deletePrivateKey'
      dangerousText.value = 'You may lost your asset if you are not backup properly.'
      isShowDangerousDialog.value = true
    }
    const handleDeleteKeyCancel = () => {
      if(deleteKey.value.toLowerCase() != 'delete key') {
        deleteKeyRef.value.validate()
        return
      }
      deleteKey.value = ''
      isShowDeleteKeyDialog.value = false
      isShowSecurityDialog.value = true
    }


    return {
      // unikey
      unikeys,
      derivedUniKeys,
      importedUniKeys,
      getImageUrl,
      substringKey,

      // Settings
      onClickSettings,

      // securityDialog
      password,
      passwordRef,
      validataText,
      isShowSecurityDialog,
      mnemonicArr,
      handleSecurityCancel,

      //dangerousDialog
      isShowDangerousDialog,
      dangerousText,
      handleDangerousCancel,

      // disabled
      onClickDisabled,

      // viewPrivateKey
      selectedprivateKey,
      isShowPrivateKeyDialog,
      onClickViewPrivateKey,
      handlePrivateKeyCancel,

      // viewMnemonic
      isShowMnemonicDialog,
      onClickViewMnemonic, 
      handleMnemonicCancel,

      // deletePrivateKey
      deleteKey,
      deleteKeyRef,
      isShowDeleteKeyDialog,
      onClickDeletePrivateKey,
      handleDeleteKeyCancel,
    }
  },
}
</script>
