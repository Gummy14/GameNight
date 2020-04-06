<template>
  <v-card>
    {{ user.username}}, {{ user.party }}
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'player-card',
  computed: {
    ...mapState({ user: 'user'})
  }
}
</script>
<style scoped>
</style>