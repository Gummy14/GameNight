<template>
  <v-card dark>
    <div>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="headline mb-1 text-wrap"> {{ user.username}} </v-list-item-title>
                <v-list-item-title class="headline mb-1">{{ user.party }}</v-list-item-title>
                <v-list-item-subtitle>{{ isHitler }}</v-list-item-subtitle>
            </v-list-item-content> 
            <v-list-item-avatar
                tile
                size="100"
                v-if="user.party==='Fascist'" class="fascist"
            ></v-list-item-avatar>
            <v-list-item-avatar
                tile
                size="100"
                v-else class="liberal"
            ></v-list-item-avatar>
        </v-list-item>
        <v-card-actions>
          <v-btn :disabled="nominee === null || user.vote" @click="vote(true)">Vote Ja!</v-btn>
          <v-btn :disabled="nominee === null || user.vote" @click="vote(false)">Vote Nein!</v-btn>
          <v-btn outlined v-if="needToKillPlayer && this.user.office === 'President'" :disabled="nominee === null" @click="killPlayer()">FINISH HIM</v-btn>
          <v-btn outlined v-if="needToInvestigatePlayer && this.user.office === 'President'" :disabled="nominee === null" @click="investigatePlayer()">INVESTIGATE HIM</v-btn>
          <v-btn outlined v-if="needToPickNewPresident && this.user.office === 'President'" :disabled="nominee === null" @click="makePresident()">SELECT AS PRESIDENT</v-btn>
          <v-btn outlined v-if="vetoUnlocked && this.user.office === 'Chancellor'" @click="veto()">CALL FOR VETO</v-btn>
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
      didFailGovernment: false,
      nextPresidentUserId: ''
    }
  },
  computed: {
    ...mapState({ 
      user: 'user', 
      crowd: 'crowd', 
      failedGovernmentCount: 'failedGovernmentCount', 
      fascistBoard: 'fascistBoard', 
      liberalBoard: 'liberalBoard', 
      deck: 'deck',
      graveyard: 'graveyard',
      nominee: 'nominee',
      needToKillPlayer: 'needToKillPlayer',
      needToPeekCards: 'needToPeekCards',
      needToInvestigatePlayer: 'needToInvestigatePlayer',
      needToPickNewPresident: 'needToPickNewPresident',
      nextPresidentPosition: 'nextPresidentPosition',
      previousGovernment: 'previousGovernment',
      president: 'president',
      vetoUnlocked: 'vetoUnlocked'
    }),
    isHitler () {
      if (this.user.isHitler === true) {
          return 'You ARE Hitler'
      } else {
          return 'You ARE NOT Hitler'
      }
    },
    isElectionComplete () {
      var didEveryoneVote = true
      for (let x = 0; x < this.crowd.length; x++) {
        if (this.crowd[x].vote === null) {
          didEveryoneVote = false
        }
      }
      return didEveryoneVote
    }
  },
  methods: {
    clearOffices () {
      for (var x = 0; x < this.crowd.length; x++) {
        this.crowd[x].office = 'None'
      }
    },
    vote(ballot) {
      for (let x = 0; x < this.crowd.length; x++) {
        if (this.user.userId === this.crowd[x].userId) {
          this.crowd[x].vote = ballot
          break
        }
      }
      if (this.isElectionComplete) {
        this.countVotes()
      } else {
        firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd })
      }
    },
    countVotes() {
      var yesVotes = 0
      var minimumVotesNeeded = Math.ceil((this.crowd.length/2))
      for (let x = 0; x < this.crowd.length; x++) {
        if (this.crowd[x].vote === true) {
          yesVotes++
        }
      }
      if (yesVotes >= minimumVotesNeeded) {
        this.makeNomineeChancellor()
      } else {
        this.failedGovernment()
      }
    },
    makeNomineeChancellor() {
      this.crowd.forEach(element => {
        element.vote = null
      })
      this.crowd[this.nominee.index].office = 'Chancellor'
      var previousGovernment = []
      previousGovernment.push(this.crowd[this.nominee.index].userId, this.president.userId)
      firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd, nominee: null, chancellor: this.crowd[this.nominee.index], failedGovernmentCount: 0, previousGovernment: previousGovernment, isGameOver: (this.crowd[this.nominee.index].isHitler && this.fascistBoard.length >= 3) })
    },
    changePresident (player) {
      this.hand = []
      var pres = null
      var lastPlayer = this.crowd.length - 1
      if (this.nominee.index != null) {
        this.crowd[this.nominee.index].office = 'None'
      }
      if (this.nextPresidentPosition != -1) {
        this.clearOffices()
        for (let x = 0; x < this.crowd.length; x++) {
          if (this.crowd[x].userId === this.nextPresidentUserId) {
            this.crowd[x].office = 'President'
            pres = x
            this.$store.commit('setNextPresidentPosition', {
              NextPresidentPosition: -1
            })
            this.$store.commit('setNeedToPickNewPresident', {
              NeedToPickNewPresident: false
            })
            break
          }
        }
        this.nextPresidentUserId = ''
      } else {
        if (player != lastPlayer) {
          this.crowd[player].office = 'None'
          this.crowd[player + 1].office = 'President'
          pres = player + 1
        } else {
          this.crowd[player].office = 'None'
          this.crowd[0].office = 'President'
          pres = 0
        }
      }

      var totalFailedGovernments
      if (this.didFailGovernment) {
        totalFailedGovernments = this.failedGovernmentCount + 1 === 3 ? 0 : this.failedGovernmentCount + 1
      } else {
        totalFailedGovernments = this.failedGovernmentCount
      }
      this.didFailGovernment = false

      this.crowd.forEach(element => {
        element.vote = null
      })

      firebase.firestore().collection('root').doc('game-room').update({ 
        crowd: this.crowd, 
        deck: this.deck,
        liberalBoard: this.liberalBoard,
        fascistBoard: this.fascistBoard,
        president: this.crowd[pres], 
        nominee: null,
        chancellor: null,
        failedGovernmentCount: totalFailedGovernments,
        graveyard: this.graveyard
      })
    },
    failedGovernment () {
      this.didFailGovernment = true
      if (this.failedGovernmentCount + 1 === 3) {
        this.enactTopPolicy()
      } 
      for (let x = 0; x < this.crowd.length; x++) {
        if (this.crowd[x].office === 'President') {
          this.changePresident(x)
          break
        }
      }
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
    getOffice (office) {
      for (let c = 0; c < this.crowd.length; c ++) {
        if (this.crowd[c].office === office) {
          return c
        }
      }
      return -1
    },
    killPlayer () {
      this.$store.commit('setNeedToKillPlayer', {
        NeedToKillPlayer: false
      })
      var crowdIndex = this.getOffice('Sentenced')
      let player = this.crowd[crowdIndex]
      if (this.nextPresidentPosition != -1) {
        if (crowdIndex === this.nextPresidentPosition) {
          this.nextPresidentUserId = this.crowd[this.nextPresidentPosition === this.crowd.length - 1 ? 0 : this.nextPresidentPosition + 1].userId
        } else {
          this.nextPresidentUserId = this.crowd[this.nextPresidentPosition].userId
        }
      }
      if (player.office === 'Sentenced') {
        player.office = 'None'
        this.graveyard.push(this.crowd[crowdIndex])
        this.crowd.splice(crowdIndex, 1)
      }
      if (player.isHitler) {
        firebase.firestore().collection('root').doc('game-room').update({ isGameOver: true, graveyard: this.graveyard, crowd: this.crowd })
      } else {
        for (let x = 0; x < this.crowd.length; x++) {
          if (this.crowd[x].office === 'President') {
            this.changePresident(x)
            break
          }
        }
      }
    },
    investigatePlayer () {
      this.$store.commit('setNeedToInvestigatePlayer', {
        NeedToInvestigatePlayer: false
      })
      var crowdIndex = this.getOffice('Under Investigation')
      this.$emit('investigationComplete', this.crowd[crowdIndex])
    },
    makePresident () {
      var nextPresidentPosition
      var president
      for (let c = 0; c < this.crowd.length; c++) {
        if (this.crowd[c].office === 'President') {
          if (c != this.crowd.length - 1) {
            nextPresidentPosition = c + 1
          } else {
            nextPresidentPosition = 0
          }
          this.$store.commit('setNextPresidentPosition', {
            NextPresidentPosition: nextPresidentPosition
          })
          this.crowd[c].office = 'None'
        } else if (this.crowd[c].userId === this.nominee.userId) {
          this.crowd[c].office = 'President'
          president = this.crowd[c]
        } else {
          this.crowd[c].office = 'None'
        }
      }
      firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd, nominee: null, chancellor: null, president: president, nextPresidentPosition: nextPresidentPosition})
    },
    veto () {
      firebase.firestore().collection('root').doc('game-room').update({ callingForVeto: true })
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