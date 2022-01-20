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
  img {
    width: 24px;
    height: 24px;
  }
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
.allow-site-box {
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid #E4E9F0;
  background: #F1F4F8;
  .allow-site-item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 24px;
    background-color: #F1F4F8;
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.06);
    }
    span {
      margin-left: 12px;
      font-size: $detail-font-size;
      line-height: 16px;
    }
  }
}
</style>

<template>
  <SignWrapper title="request permissions" @reject="onRejectClick" @allow="onAllowClick">
    <h2>
      Website
    </h2>
    <div class="website-detail-box">
      <img :src="site?.icon">
      <p>{{ substringOrigin(approval?.origin,true) }}<span>{{ substringOrigin(approval?.origin,false) }}</span></p>
    </div>
    <h2>Connect Address</h2>
    <div class="connect-address-box">
      <div class="connect-address-title">
        <img :src="getImageUrl(currentUnikey?.keySymbol)">
        <span>{{ currentUnikey?.keySymbol }}</span>
      </div>
      <div class="connect-address-content">
        {{ currentUnikey?.key }}
      </div>
    </div>
    <h2>Allow this site to</h2>
    <div class="allow-site-box">
      <div v-for="permission in approval?.params.permissions" :key="permission" class="allow-site-item" @click="onClickChoosePermission(permission)">
        <Iconfont :name="choosePermissions.includes(permission)?'checkbox-check':'checkbox-uncheck'" size="16"></Iconfont>
        <span>{{ permission }}</span>
      </div>
    </div>
  </SignWrapper>
</template>

<script lang="ts">
import { ref } from 'vue'
import SignWrapper from './-/SignWrapper.vue'
import { ApprovalData } from '~/background/services/approval'
import { PermittedKeyObjectType } from '~/background/controllers/provider/index'
import { Unikey } from '~/background/services/unikey'
import { wallet } from '~/ui/controllers/wallet'
import { getImageUrl, substringOrigin } from '~/utils'

export default {
  name: 'PageConnect',
  components: {
    SignWrapper,
  },
  setup () {
    const approval = ref<ApprovalData<PermittedKeyObjectType>|null>(null)
    const currentUnikey = ref<Unikey|null>(null)
    const choosePermissions = ref<string[]>([])
    const onClickChoosePermission = (permission: string) => {
      if (choosePermissions.value.includes(permission) && choosePermissions.value.length > 1) {
        const index = choosePermissions.value.indexOf(permission)
        choosePermissions.value.splice(index, 1)
      }
      else {
        choosePermissions.value.push(permission)
      }
    }
    async function onRejectClick () {
      await wallet.rejectApproval()
    }
    async function onAllowClick () {
      await wallet.resolveApproval(choosePermissions.value)
    }

    const site = ref<string>('')
    onMounted(async () => {
      currentUnikey.value = await wallet.getCurrentUnikey()
      approval.value = await wallet.getApproval()
      choosePermissions.value = [...approval.value!.params!.permissions]
      const siteVal = await wallet.getSite(approval.value!.origin as string)
      if (siteVal) {
        site.value = siteVal as any
      }
    })

    return {
      approval,
      currentUnikey,
      choosePermissions,
      onClickChoosePermission,
      substringOrigin,
      onRejectClick,
      onAllowClick,
      site,
      getImageUrl,
    }
  },
}
</script>
