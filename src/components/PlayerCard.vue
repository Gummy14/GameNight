<template>
  <v-card dark>
    <div>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="headline mb-1"> {{ user.username}} </v-list-item-title>
                <v-list-item-title class="headline mb-1">{{ user.party }}</v-list-item-title>
          <v-list-item-subtitle>{{isHitler}}</v-list-item-subtitle>
            </v-list-item-content> 
            <v-list-item-avatar
                tile
                size="80"
                v-if="user.party==='Fascist'" class="fascist"
                ></v-list-item-avatar>
            <v-list-item-avatar
                tile
                size="80"
                v-else class="liberal"
                ></v-list-item-avatar>
                
        </v-list-item>
        <v-card-actions>
            <v-btn outlined :disabled="chancellorNominee === ''" @click="vote(true)">Vote Ja!</v-btn>
            <v-btn outlined :disabled="chancellorNominee === ''" @click="vote(false)">Vote Nein!</v-btn>
        </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import firebase from 'firebase'
export default {
  name: 'player-card',
  data() {
    return {
      chancellorNomineeCrowdIndex: null
    }
  },
  computed: {
    ...mapState({ user: 'user', crowd: 'crowd'}),
    isHitler() {
        if (this.user.isHitler === true) {
            return 'You ARE Hitler'
        } else {
            return 'You ARE NOT Hitler'
        }
    },
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
    },
    isElectionComplete() {
      var didEveryoneVote = true
      for (let x = 0; x < this.crowd.length; x++) {
        if (this.crowd[x].vote === null) {
          didEveryoneVote = false
        }
      }
      return didEveryoneVote
    },
  },
  methods: {
    vote(ballot) {
      for (let x = 0; x < this.crowd.length; x++) {
        if (this.user.userId === this.crowd[x].userId) {
          this.crowd[x].vote = ballot
          break
        }
      }
      firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd })
      if (this.isElectionComplete) {
        this.countVotes()
      }
    },
    countVotes() {
      var yesVotes = 0
      var minimumVotesNeeded = Math.ceil((this.crowd.length/2))
      console.log("it is calling countVotes")
      for (let x = 0; x < this.crowd.length; x++) {
        if (this.crowd[x].vote === true) {
          yesVotes++
        }
      }
      if (yesVotes > minimumVotesNeeded) {
        this.makeNomineeChancellor()
      } else {
        this.failedGovernment()
      }
    },
    makeNomineeChancellor() {
      this.crowd[this.chancellorNomineeCrowdIndex].office = 'Chancellor'
      firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd, chancellorNominee: null, chancellor: this.crowd[this.chancellorNomineeCrowdIndex] })
    },
    changePresident (player) {
      var lastPlayer = this.crowd.length - 1
      var pres = null
      if (player != lastPlayer) {
          this.crowd[player].office = 'None'
          this.crowd[player + 1].office = 'President'
          pres = player + 1
      } else {
          this.crowd[player].office = 'None'
          this.crowd[0].office = 'President'
          pres = 0
      }
      firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd, president: this.crowd[pres] })
    },
    failedGovernment () {
      for (let x = 0; x < this.crowd.length; x++) {
          if (this.crowd[x].office === 'President') {
              this.changePresident(x)
              break
          }
      }
    }
  }
}
</script>
<style scoped>
.policy {
  max-width: 75px;
  height: 125px;
  margin-right: 10px;
}
.fascist{
  background: red;
}
.liberal{
  background: blue;
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