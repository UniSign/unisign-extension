<style lang="scss">
.page-approval-connect {

}
</style>

<template>
  <div class="page-approval-connect">
    connect

    <div>
      {{ $tt('Repeat') }}
    </div>
    <div>
      {{ $tt('This is a welcome message.') }}
    </div>

    <div>
      {{ $i18n.locale }}
    </div>
    <div>{{$i18n.messages}}</div>
    <div>
      <select name="locale" :value="$i18n.locale" @change="onChangeLocale">
        <option v-for="locale in LocaleOptions" :key="locale.value" :value="locale.value">
          {{ locale.text }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import { setLocale } from '../../i18n'
import { LocaleOptions } from '../../../../constants/index'

export default {
  name: 'PageApprovalConnect',
  components: {},
  setup () {
    return {
      setLocale,
      onChangeLocale (e) {
        setLocale(e.target.value)
      },
      LocaleOptions,
    }
  },
}
</script>
