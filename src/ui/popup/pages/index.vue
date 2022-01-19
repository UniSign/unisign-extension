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
      console.log(isSetup, isLocked, 'isLocked')
      if (isSetup) {
        if (isLocked) {
          router.push('/setup/locked')
        }
        else {
          router.push('/setup/home')
        }
      }
      else {
        router.push('/setup')
      }
    })
    return {
    }
  },
}
</script>
