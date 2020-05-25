<template>
  <v-card dark>
    <v-card-title class="headline">{{ gameWinner.victoryType }}</v-card-title>  
    <v-card-text>{{ gameWinner.description }}</v-card-text>  
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
      president: 'president'
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