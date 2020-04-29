<template>
  <v-card dark>
    <div v-if="player">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1 text-wrap"> {{ player.username}} </v-list-item-title>
          <v-list-item-title class="headline mb-1">{{ player.party }}</v-list-item-title>
        </v-list-item-content> 
        <v-list-item-avatar
          tile
          size="100"
          v-if="player.party==='Fascist'" class="fascist"
        ></v-list-item-avatar>
        <v-list-item-avatar
          tile
          size="100"
          v-else class="liberal"
        ></v-list-item-avatar>
      </v-list-item>
      <v-card-actions>
          <v-btn outlined @click="continueGame">Continue</v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'investigation-results',
  props: [
    'player'
  ],
  methods: {
    continueGame() {
      this.$emit('investigationOver')
    }
  }
}
</script>
<style scoped>
.text-wrap {
    flex: wrap;
}
.policy {
  max-width: 75px;
  height: 125px;
  margin-right: 10px;
}
.fascist{
  background-image: url("../assets/fascist-party-card.png");
  background-size: 100%;
}
.liberal{
  background-image: url("../assets/liberal-party-card.png");
  background-size: 100%;
}
.player-hand {
  padding: 10px;
  display: flex;
  max-width: 250px;
}
.button {
    flex: wrap;
}
</style>