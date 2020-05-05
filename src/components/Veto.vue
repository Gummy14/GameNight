<template>
  <v-card dark>
    <div v-if="user.office === 'President'">
      <div v-if="presidentialVetoVote===null">
        <v-card-title>Veto!</v-card-title>
        <v-card-subtitle>Your Chancellor has called for a veto</v-card-subtitle>
        <v-card-text>Agreeing will allow your chancellor to discard all polices, but increment the failed government counter by 1</v-card-text> 
        <br>
        <v-card-text>Disagreeing will force your chancellor to enact a policy from their hand</v-card-text> 
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="presidentVote(true)">Agree</v-btn>
          <v-btn @click="presidentVote(false)">Disagree</v-btn>
        </v-card-actions>
      </div>
      <div v-if="presidentialVetoVote===null">
        <v-card-text v-if="presidentialVetoVote===true">You have chosen to veto this hand</v-card-text>
        <v-card-text v-if="presidentialVetoVote===false">You have chosen NOT to veto this hand</v-card-text>
        <v-card-text v-if="presidentialVetoVote===null">Currently awaiting your Chancellor's confirmation</v-card-text>
      </div>
    </div>
    <div v-else-if="user.office === 'Chancellor'">
      <v-card-title>Veto!</v-card-title>
      <v-card-subtitle>You have called for a veto</v-card-subtitle>
      <br>
      <v-card-text v-if="presidentialVetoVote===null">Currently awaiting your President's response</v-card-text>
      <v-card-text v-if="presidentialVetoVote===true">The President has agreed to veto this hand</v-card-text>
      <v-card-text v-if="presidentialVetoVote===false">The President has decided NOT to veto this hand. Pick your poison.</v-card-text>
      <div v-if="presidentialVetoVote!=null">
        <v-btn @click="resumeTurn()">Continue</v-btn>
      </div>
    </div>
  </v-card>

</template>

<script>
import firebase from 'firebase'
import { mapState } from 'vuex'
export default {
  name: 'veto',
  data() {
    return {
      chancellorNomineeCrowdIndex: null,
    }
  },
  computed: {
    ...mapState({ 
      crowd: 'crowd', 
      failedGovernmentCount: 'failedGovernmentCount', 
      fascistBoard: 'fascistBoard', 
      liberalBoard: 'liberalBoard', 
      deck: 'deck',
      nominee: 'nominee',
      previousChancellor: 'previousChancellor',
      president: 'president',
      user: 'user',
      presidentialVetoVote: 'presidentialVetoVote'
    }),
    chancellorNominee () {
      var doesChancellorNomineeExist = false
      var chancellorNominee = ''
      this.crowd.forEach((element, index) => {
        if (element.office === 'Chancellor Nominee') {
          doesChancellorNomineeExist = true
          chancellorNominee = element.username
          this.chancellorNomineeCrowdIndex = index
        }
      })
      if (doesChancellorNomineeExist === false) {
        return ''
      } else {
        return chancellorNominee
      }
    }
  },
  methods: {
    agree () {
      this.failedGovernment()
    },
    disagree () {
      firebase.firestore().collection('root').doc('game-room').update({ callingForVeto: false, presidentialVetoVote: null })  
    },
    presidentVote (vote) {
      firebase.firestore().collection('root').doc('game-room').update({ presidentialVetoVote: vote }) 
    },
    resumeTurn () {
      if (this.presidentialVetoVote === true) {
        this.agree()
      } else {
        this.disagree()
      }
    },
    failedGovernment () {
      if (this.failedGovernmentCount + 1 === 3) {
        this.enactTopPolicy()
      }
      var presidentPosition = -1
      for (let x = 0; x < this.crowd.length; x++) {
        if (this.crowd[x].office === 'President') {
          presidentPosition = x
        }
        this.crowd[x].office = 'None'
      }
      this.changePresident(presidentPosition)
    },
    changePresident (player) {
      var lastPlayer = this.crowd.length - 1
      var pres = null
      if (this.chancellorNomineeCrowdIndex != null) {
        this.crowd[this.chancellorNomineeCrowdIndex].office = 'None'
      }
      if (player != lastPlayer) {
          this.crowd[player].office = 'None'
          this.crowd[player + 1].office = 'President'
          pres = player + 1
      } else {
          this.crowd[player].office = 'None'
          this.crowd[0].office = 'President'
          pres = 0
      }

      firebase.firestore().collection('root').doc('game-room').update({ 
        crowd: this.crowd, 
        deck: this.deck,
        liberalBoard: this.liberalBoard,
        fascistBoard: this.fascistBoard,
        president: this.crowd[pres], 
        nominee: null,
        chancellor: null,
        failedGovernmentCount: this.failedGovernmentCount + 1 === 3 ? 0 : this.failedGovernmentCount + 1,
        callingForVeto: false,
        presidentialVetoVote: null
      })
    },
    enactTopPolicy () {
      var topPolicy = this.deck[0]
      if (topPolicy.type === 0) {
        this.deck.splice(0, 1)
        this.fascistBoard.push(topPolicy)
      } else if (topPolicy.type === 1) {
        this.deck.splice(0, 1)
        this.liberalBoard.push(topPolicy)
      }
    },
  }
}
</script>
<style scoped>
</style>