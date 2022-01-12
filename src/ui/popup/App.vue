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
    const isSetup = ref(false)
    const isLocked = ref(false)
    onMounted(async () => {
      isSetup.value = await wallet.isSetup()
      isLocked.value = await wallet.isLocked()
      if (isSetup.value) {
        if (isLocked.value) {
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
