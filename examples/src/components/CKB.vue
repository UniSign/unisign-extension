<template>
  <el-row>
    <el-col :span="24">
      <el-form ref="form" :model="form" label-width="160px">

        <el-form-item label="Private Key">
          <el-input v-model="privateKey" @blur="onSetPrivateKey"></el-input>
        </el-form-item>
        <el-form-item label="Public Key">
          <el-input v-model="publicKey" readonly></el-input>
        </el-form-item>
        <el-form-item label="Legacy Short Address">
          <el-input v-model="addressShort" readonly></el-input>
        </el-form-item>
        <el-form-item label="Full Address">
          <el-input v-model="addressFull" readonly></el-input>
        </el-form-item>
        <el-form-item label="Chain Type">
          <el-select v-model="chainType" @change="onChangeChainType">
            <el-option label="Mainnet" :value="0"></el-option>
            <el-option label="Testnet" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-divider></el-divider>
        <el-form-item label="Plain text to sign">
          <el-input v-model="plainText" @blur="onSignPlainText" placeholder="Please input the message you want to sign here."></el-input>
        </el-form-item>
        <el-form-item label="Signature">
          <el-input v-model="plainTextSignature" readonly></el-input>
        </el-form-item>

        <el-divider></el-divider>
        <el-form-item label="Struct message to sign">
          <Vue3JsonEditor v-model="structMessage" mode="code" @json-change="onSignStructMessage"/>
        </el-form-item>
        <el-form-item label="Signature">
          <el-input v-model="structMessageSignature" readonly></el-input>
        </el-form-item>

        <el-divider></el-divider>
        <el-form-item label="Transaction in ckb-cli format to sign">
          <el-input type="textarea" v-model="cliTransaction" @blur="onSignTransaction" placeholder="Please input the transaction you want to sign here."></el-input>
        </el-form-item>
        <el-form-item label="Signed Raw Transaction">
          <el-input v-model="signedRawTransaction" readonly></el-input>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { ref } from 'vue'
import { Vue3JsonEditor } from 'vue3-json-editor'

import { core, ckb } from 'sign.mjs'

export default {
  components: { Vue3JsonEditor },
  setup() {
    const privateKey = ref('')
    const publicKey = ref('')
    const chainType = ref(1)
    const addressShort = ref('')
    const addressFull = ref('')
    const plainText = ref('')
    const plainTextSignature = ref('')

    // The Vue3JsonEditor will not modify ref directly, so here is just an initial value.
    const structMessage = {
      coinType: core.CoinType.CKB,
      dAppName: 'unittest',
      detail: 'This is a unit test',
      subject: 'Unit Test',
      version: 1,
      content: {
        txId: '0x0000000000000000000000000000000000000000000000000000000000000000'
      },
    }
    const structMessageSignature = ref('')

    const cliTransaction = ref('')
    const signedRawTransaction = ref('')

    let rawKeypair
    let rawAddress
    let signProvider

    return {
      privateKey,
      publicKey,
      chainType,
      addressShort,
      addressFull,
      plainText,
      plainTextSignature,
      structMessage,
      structMessageSignature,
      cliTransaction,
      signedRawTransaction,

      rawKeypair,
      rawAddress,
      signProvider,

      onSetPrivateKey () {
        console.log('privateKey:', privateKey.value)

        if (!privateKey.value) {
          return
        }

        rawKeypair = ckb.Keypair.fromHex(privateKey.value)
        publicKey.value = core.util.bufferToHex(rawKeypair.publicKey)

        rawAddress = ckb.Address.fromBuffer(rawKeypair.publicKey)
        addressShort.value = rawAddress.toLegacyShortAddress(chainType.value)
        addressFull.value = rawAddress.toFullAddress(chainType.value)

        signProvider = ckb.SignProvider.create({
          keypairs: [rawKeypair]
        })
      },
      onChangeChainType () {
        console.log('chainType:', chainType.value)

        if (!signProvider) {
          return
        }

        signProvider.setNetwork(chainType.value)
      },
      async onSignPlainText () {
        console.log('plainText:', plainText.value)

        if (!signProvider) {
          return
        }

        const keypair = signProvider.getKeypair(0)
        const signature = await signProvider.signPlainMessage(keypair, plainText.value)

        plainTextSignature.value = core.util.bufferToHex(signature)
      },
      async onSignStructMessage (value) {
        console.log('structMessage:', JSON.stringify(value))

        if (!signProvider) {
          return
        }

        const keypair = signProvider.getKeypair(0)
        const signature = await signProvider.signStructMessage(keypair, value)

        structMessageSignature.value = core.util.bufferToHex(signature)
      },
      async onSignTransaction () {
        console.log('cliTransaction:', cliTransaction.value)

        if (!signProvider) {
          return
        }

        signProvider.setKeypairs({ keypairs: [
            ckb.Keypair.fromHex('0000000000000000000000000000000000000000000000000000000000000001'),
            ckb.Keypair.fromHex('0000000000000000000000000000000000000000000000000000000000000002'),
          ]})

        const result = await signProvider.signTransaction(cliTransaction.value)
        signedRawTransaction.value = result
      }
    }
  }
}
</script>
