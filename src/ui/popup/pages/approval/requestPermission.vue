<style lang="scss" scoped>
.page-approval-request-permission {

}
</style>

<template>
  <div class="page-approval-request-permission">
    request permission
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { ApprovalData } from '~/background/services/approval'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageUnlock',
  setup () {
    const approval = ref<ApprovalData|null>(null)

    onMounted(async () => {
      approval.value = await wallet.getApproval()

      console.log(approval.value)
    })

    return {

    }
  },
}
</script>
