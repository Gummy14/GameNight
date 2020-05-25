<template>
  <v-card dark>
    <v-card-title class="headline">{{ gameWinner.victoryType }}</v-card-title>  
    <v-card-text>{{ gameWinner.description }}</v-card-text>
    <v-card-text> {{ listOfFascists }}</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>  
      <v-btn @click="emitNewGame">New Game</v-btn>
      <v-btn @click="emitLeaveGame">Leave Game</v-btn> 
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'game-over',
  data() {
    return {
    }
  },
  computed: {
    ...mapState({ 
      fascistBoard: 'fascistBoard',
      liberalBoard: 'liberalBoard',
      graveyard: 'graveyard',
      chancellor: 'chancellor',
      president: 'president',
      crowd: 'crowd'
    }),
    gameWinner () {
        var outcome
      if (this.fascistBoard.length === 6) {
        outcome = {
          victoryType: 'Fascist Policy Victory!',
          description: 'The fascists have successfully passed enough policies to turn Germany into a fascist nation. \nDark days lay ahead.'
        }
        return outcome
      } else if (this.liberalBoard.length === 5) {
        outcome = {
          victoryType: 'Liberal Policy Victory!',
          description: 'The liberals have successfully passed enough policies to starve off fascism for now. \nPeace may be achievable after all.'
        }
        return outcome
      } else if (this.isHitlerDead) {
        if (this.president.party === 'Fascist') {
          outcome = {            
            victoryType: 'A fascist has killed Hitler!',
            description: 'An incompetent fascist has, for some reason, killed their own leader\nThis act has single handily destroyed the fascist movement and secured a liberal victory.\n\nThanks Obama'
          }
        } else {
          outcome = {
            victoryType: 'Hitler has been killed!',
            description: 'Hitler has died! \nThe fascists are now aimless without their leader.'
          }
        }
        return outcome
      } else if (this.chancellor?.isHitler) {
        outcome = {
          victoryType: 'Hitler has been elected Chancellor!',
          description: 'So this is how liberty dies... with thunderous applause. A sad day for democracy.'
        }
        return outcome
      }
        else {
        outcome = {
          victoryType: 'GAME OVER',
          description: 'GAME OVER'
        }
        return outcome
      }
    },
    isHitlerDead () {
      for (let a = 0; a < this.graveyard.length; a++) {
        if (this.graveyard[a].isHitler) {
          return true
        }
      }
      return false
    },
    listOfFascists () {
      var deadplayers = this.graveyard
      var players = this.crowd

      if (deadplayers.length > 0) {
        players.concat(deadplayers)
      }

      var fascists = 'The fascists were:'
      var fascistCount = 0
      switch (players.length)
      {
        case 5:
          fascistCount = 2
          break
        case 6:
          fascistCount = 2
          break
        case 7:
          fascistCount = 3
          break
        case 8:
          fascistCount = 3
          break
        case 9:
          fascistCount = 4
          break
        case 10:
          fascistCount = 4
          break
      }

      var identifiedFascists = 0
      for (let q = 0; q < players.length; q++) {
        if (players[q].party === 'Fascist') {
          identifiedFascists++
          if (identifiedFascists < fascistCount) {
            fascists = fascists + ' ' + players[q].username + ','
          } else {
            fascists = fascists + ' ' + players[q].username
          }
        }
      }

      return fascists
    }
  },
  methods: {
    emitNewGame() {
      this.$emit('newGame')
    },
    emitLeaveGame() {
      this.$emit('leaveGame')
    }
  }
}
</script>
<style scoped>
</style>