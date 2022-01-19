<style lang="scss" scoped>
.page-approval-request-permission {

}
</style>

<template>
  <div class="page-approval-request-permission">
    request permissions

    {{ approval }}

    <hr>
    <fieldset>
      <button @click="onClickApprove">
        approve
      </button>
    </fieldset>
    <fieldset>
      <button @click="onClickReject">
        reject
      </button>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { PermittedKeyObjectType } from '~/background/controllers/provider/index'
import { ApprovalData } from '~/background/services/approval'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageUnlock',
  setup () {
    const approval = ref<ApprovalData<PermittedKeyObjectType>|null>(null)

    onMounted(async () => {
      approval.value = await wallet.getApproval()

      console.log(approval.value)
    })

    return {
      approval,
      async onClickApprove () {
        await wallet.resolveApproval()
      },

      async onClickReject () {
        await wallet.rejectApproval()
      },
    }
  },
}
</script>
