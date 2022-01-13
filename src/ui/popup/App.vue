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
    let isSetup = false
    let isLocked = false
    onMounted(async () => {
      isSetup = await wallet.isSetup()
      isLocked = await wallet.isLocked()
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
