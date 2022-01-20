<template>
  <div></div>
</template>

<script>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'PageIndex',
  setup () {
    const router = useRouter()

    onMounted(async () => {
      const isSetup = await wallet.isSetup()
      const isLocked = await wallet.isLocked()

      if (isSetup) {
        if (isLocked) {
          await router.replace('/setup/locked')
        }
        else {
          const approval = await wallet.getApproval()
          if (approval) {
            const route = approval.approvalPage

            await router.replace(route)
          }
          else {
            await router.replace('/setup/home')
          }
        }
      }
      else {
        await router.replace('/setup')
      }
    })
    return {
    }
  },
}
</script>
