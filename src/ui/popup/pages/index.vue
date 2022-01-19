<template>
  <div></div>
</template>

<script>

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
          router.replace('/setup/locked')
        }
        else {
          router.replace('/setup/home')
        }
      }
      else {
        router.replace('/setup')
      }
    })
    return {
    }
  },
}
</script>
