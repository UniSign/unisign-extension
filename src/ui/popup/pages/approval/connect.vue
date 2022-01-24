<style lang="scss" scoped>
h2 {
  margin: 24px 0 8px;
  font-size: $detail-font-size;
  font-weight: 400;
  line-height: 16px;
  color: #6F7684;
  &:nth-child(1) {
    margin-top: 0px;
  }
}
.website-detail-box {
  padding: 8px 12px;
  display: flex;
  border-radius: 8px;
  border: 1px solid #E4E9F0;
  background: #F1F4F8;
  >p {
    margin-left: 12px;
    font-size: $input-font-size;
    color: #8D919C;
    span {
      margin-left: 0px;
      color: #242C3F;
    }
  }
}
.connect-address-box {
  border-radius: 8px;
  border: 1px solid #E4E9F0;
  background: #F1F4F8;
  .connect-address-title {
    padding: 15px 9px;
    display: flex;
    align-items: center;
    img {
      margin-right: 7px;
      width: 26px;
      height: 26px;
    }
    span {
      font-size: $detail-font-size;
      font-weight: 600;
      line-height: 16px;
    }
  }
  .connect-address-content {
    margin: 0 12px;
    padding: 18px 0;
    border-top: 1px solid rgba(220, 229, 240, 0.5);
    font-size: $detail-font-size;
    font-weight: 600;
    line-height: 16px;
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>

<template>
  <SignWrapper :title="$tt('Connect Request')" @reject="onRejectClick" @allow="onAllowClick">
    <h2>
      {{ $tt('Website') }}
    </h2>
    <div class="website-detail-box">
      <Iconfont name="connect" size="24"></Iconfont>
      <p>{{ $tt('https://') }}<span>{{ $tt('rarible.com') }}</span></p>
    </div>
    <h2>{{ $tt('Connect Address') }}</h2>
    <div class="connect-address-box">
      <div class="connect-address-title">
        <img src="/assets/page-addAddress/key-btc.png">
        <span>{{ $tt('BTC') }}</span>
      </div>
      <div class="connect-address-content">
        0xE7c00a33B82AfF42C8Ea4e7B41dB1ea09Dc4f6BD
      </div>
    </div>
  </SignWrapper>
</template>

<script lang="ts">
import { ref } from 'vue'
import SignWrapper from './-/SignWrapper.vue'
import { ApprovalData } from '~/background/services/approval'
import { Unikey } from '~/background/services/unikey'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageConnect',
  components: {
    SignWrapper,
  },
  setup () {
    const params = ref<ApprovalData|null>(null)
    const currentUnikey = ref<Unikey|null>(null)
    async function onRejectClick () {
      await wallet.resolveApproval(params)
    }
    async function onAllowClick () {
      await wallet.rejectApproval()
    }

    onMounted(async () => {
      currentUnikey.value = await wallet.getCurrentUnikey()
      params.value = await wallet.getApproval()
    })

    return {
      onRejectClick,
      onAllowClick,
    }
  },
}
</script>
