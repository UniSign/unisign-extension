<template>
  <router-view></router-view>
</template>

<script>

import { useRouter } from 'vue-router'
import { wallet } from '~/ui/controllers/wallet'

export default {
  name: 'App',
  setup () {
    const router = useRouter()
    onMounted(async () => {
      const isSetup = await wallet.isSetup()
      const isLocked = await wallet.isLocked()
      if (isSetup) {
        if (isLocked) {
          router.push('/locked')
        }
        else {
          router.push('/begin')
        }
      }
      else {
        router.push('/')
      }
    })
    return {
    }
  },
}
</script>
