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
        <el-form-item label="Legacy Address">
          <el-input v-model="addressLegacy" readonly></el-input>
        </el-form-item>
        <el-form-item label="Segwit Address">
          <el-input v-model="addressSegwit" readonly></el-input>
        </el-form-item>
        <el-form-item label="Native Segwit Address">
          <el-input v-model="addressNativeSegwit" readonly></el-input>
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
        <el-form-item label="PSBT Transaction to sign">
          <el-input type="textarea" v-model="psbtTransaction" @blur="onSignTransaction" placeholder="Please input the transaction you want to sign here."></el-input>
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

import { core, btc } from 'sign.mjs'

export default {
  components: { Vue3JsonEditor },
  setup() {
    const privateKey = ref('')
    const publicKey = ref('')
    const chainType = ref(1)
    const addressLegacy = ref('')
    const addressNativeSegwit = ref('')
    const addressSegwit = ref('')
    const plainText = ref('')
    const plainTextSignature = ref('')

    // The Vue3JsonEditor will not modify ref directly, so here is just an initial value.
    const structMessage = {
      coinType: core.CoinType.BTC,
      dAppName: 'unittest',
      detail: 'This is a unit test',
      subject: 'Unit Test',
      version: 1,
      content: {
        txId: '0x0000000000000000000000000000000000000000000000000000000000000000'
      },
    }
    const structMessageSignature = ref('')

    const psbtTransaction = ref('')
    const signedRawTransaction = ref('')

    let rawKeypair
    let rawAddress
    let signProvider

    return {
      privateKey,
      publicKey,
      chainType,
      addressLegacy,
      addressNativeSegwit,
      addressSegwit,
      plainText,
      plainTextSignature,
      structMessage,
      structMessageSignature,
      psbtTransaction,
      signedRawTransaction,

      rawKeypair,
      rawAddress,
      signProvider,

      onSetPrivateKey () {
        console.log('privateKey:', privateKey.value)

        if (!privateKey.value) {
          return
        }

        rawKeypair = btc.Keypair.fromHex(privateKey.value)
        publicKey.value = core.util.bufferToHex(rawKeypair.publicKey)

        rawAddress = btc.Address.fromBuffer(rawKeypair.publicKey)
        addressLegacy.value = rawAddress.toLegacyAddress(chainType.value)
        addressNativeSegwit.value = rawAddress.toNativeSegwitAddress(chainType.value)
        addressSegwit.value = rawAddress.toSegwitAddress(chainType.value)

        signProvider = btc.SignProvider.create({
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
        // Sign message with different address type
        // const signature = await signProvider.signPlainMessage(keypair, plainText.value, btc.SegwitType.Native)
        // const signature = await signProvider.signPlainMessage(keypair, plainText.value, btc.SegwitType.P2SH)

        plainTextSignature.value = core.util.bufferToHex(signature)
      },
      async onSignStructMessage (value) {
        console.log('structMessage:', JSON.stringify(value))

        if (!signProvider) {
          return
        }

        const keypair = signProvider.getKeypair(0)
        const signature = await signProvider.signStructMessage(keypair, value)
        // Sign message with different address type
        // const signature = await signProvider.signStructMessage(keypair, plainText.value, btc.SegwitType.Native)
        // const signature = await signProvider.signStructMessage(keypair, plainText.value, btc.SegwitType.P2SH)

        structMessageSignature.value = core.util.bufferToHex(signature)
      },
      async onSignTransaction () {
        console.log('psbtTransaction:', psbtTransaction.value)

        if (!signProvider) {
          return
        }

        signProvider.setKeypairs({ keypairs: [
            btc.Keypair.fromHex('7149d6db2352c4d62e0f608aac8e2e2990f26225baaaa875da14f6f3ae7eb6ef'),
            btc.Keypair.fromHex('a950ec757af14446ffa0840a4c92d82c09aab749d835ce9c3e192b1b59174dcd'),
          ]})

        const result = await signProvider.signTransaction(psbtTransaction.value, true)
        signedRawTransaction.value = result
      }
    }
  }
}
</script>
