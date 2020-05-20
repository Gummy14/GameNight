<template>
  <div class="overlord">
    <player-list></player-list>
    
    <div class="table">
      <div class="small-board">
        <v-card-title class="title">Policy Deck</v-card-title>
        <draggable class="deck-stack" :list="deck" group="cards" @change="removePolicyFromDeck" :disabled="user.office != 'President' || hand.length === 3 || chancellor === null">
          <v-card
            dark
            class="deck back"
            v-for="(element) in deck"
            :key="element.id"
          >
          </v-card>
        </draggable>
        <v-btn dark v-if="deck.length === 0" @click="restoreDeck">Restore</v-btn>
        <v-divider></v-divider>
        <v-btn v-if="needToPeekCards && user.office === 'President'" dark @click="peekCards">Examine</v-btn>
          <transition-group name="fade" tag="ul" class="deck-stack">
            <v-card
              dark
              :class="applyClass(element.type)"
              v-for="(element) in peekDeck"
              :key="element.id"
            > 
            </v-card>
          </transition-group>
      </div>

      <div>
        <div class="board">
          <v-card dark class="board">
            <v-img v-if="this.crowd.length < 7" src="../assets/fascist-board.png" width="100%" :disabled="this.crowd.length < 5">
              <draggable 
                class="fascist-board" 
                :list="fascistBoard" 
                group="cards" 
                @change="newTurn(0)"
                :disabled="user.office != 'Chancellor' || hand.length != 1"
              >
                <v-card
                  :class="applyClass(element.type)"
                  v-for="(element) in fascistBoard"
                  :key="element.id"
                >
                </v-card>
              </draggable>
            </v-img>
            <v-img v-else-if="this.crowd.length === 7 || this.crowd.length === 8" src="../assets/fascist-board-7-8.png" width="100%">
              <draggable 
                class="fascist-board" 
                :list="fascistBoard" 
                group="cards" 
                @change="newTurn(0)"
                :disabled="user.office != 'Chancellor' || hand.length != 1"
              >
                <v-card
                  :class="applyClass(element.type)"
                  v-for="(element) in fascistBoard"
                  :key="element.id"
                >
                </v-card>
              </draggable>
            </v-img>
            <v-img v-else-if="this.crowd.length > 8 && this.crowd.length <= 10" src="../assets/fascist-board-9-10.png" width="100%">
              <draggable 
                class="fascist-board" 
                :list="fascistBoard" 
                group="cards" 
                @change="newTurn(0)"
                :disabled="user.office != 'Chancellor' || hand.length != 1"
              >
                <v-card
                  :class="applyClass(element.type)"
                  v-for="(element) in fascistBoard"
                  :key="element.id"
                >
                </v-card>
              </draggable>
            </v-img>
          </v-card>
        </div>

        <div class="board">
          <v-card dark class="board"> 
            <v-img src="../assets/liberal-board.png" width="100%">
              <draggable 
                class="liberal-board" 
                :list="liberalBoard" 
                group="cards" 
                @change="newTurn(1)"
                :disabled="user.office != 'Chancellor' || hand.length != 1"
              >
                <v-card
                  :class="applyClass(element.type)"
                  v-for="(element) in liberalBoard"
                  :key="element.id"
                > 
                </v-card>
              </draggable>
            </v-img>
          </v-card>
        </div>

        <v-slider
          v-model="failedGovernmentCount"
          tick-size="9"
          min="0"
          max="3"
          ticks
          class="failed-government-tracker"
          track-color="#4267b2"
          thumb-color="#4267b2"
          thumb-label="always"
          inverse-thumb
          readonly
        >
        </v-slider>

        <v-btn v-if="user.userId === crowd[0].userId && showStartButton" dark class="start-button" @click="startGame">START GAME</v-btn>
        <v-card-title class="title">Player Board</v-card-title>
        <div v-if="user.office === 'President' || user.office === 'Chancellor'" class="board player-hand">
          <v-card class="card-hand">
            <draggable class="hand" :list="hand" group="cards">
              <v-card
                :class="applyClass(element.type)"
                v-for="(element) in hand"
                :key="element.id"
              >
              </v-card>
            </draggable>
            <v-btn 
              v-if="user.office === 'President'" 
              :outlined="hand.length != 2 || !hasDiscarded" 
              color="#1e1e1e" 
              :disabled="hand.length != 2 || !hasDiscarded" 
              class="handoff" 
              @click="addPolicy()"
            >
              Hand off cards
            </v-btn>
          </v-card>
          <player-card @investigationComplete="setInvestigationResults($event, true)" class="player-card"> </player-card>
        </div>
        <player-card v-else class="player-hand player-card"> </player-card>
      </div>
      
      <div class="small-board">
        <v-card-title class="title">Discard</v-card-title>
        <v-card dark>
            <draggable v-if="hasDiscarded === true" class="discard-stack back" :list="discard" group="cards" @change="discardedPolicy"> 
            </draggable>
            <draggable v-else class="discard-stack" :list="discard" group="cards" @change="discardedPolicy"> 
            </draggable>
        </v-card>
      </div>

      <v-dialog v-model="isGameOver" persistent max-width="375">
        <game-over @newGame="startGame" @leaveGame="leaveGame">
        </game-over>
      </v-dialog>

      <v-dialog v-model="isInvestigationOver" persistent max-width="375">
        <investigation-results :player="investigationResults" @investigationOver="setInvestigationResults(null, false)">
        </investigation-results>
      </v-dialog>

      <v-dialog v-model="callingForVeto" persistent max-width="450">
        <veto></veto>
      </v-dialog>

    </div>
    <v-footer
      color="primary lighten-1"
      padless
      fixed
    >
      <v-row
        justify="center"
        no-gutters
      >
        <v-btn
          v-for="player in crowd"
          :key="player.userId"
          color="white"
          text
          rounded
          class="my-2"
        >
          {{ player.username }}
        </v-btn>
      </v-row> 
    </v-footer>
  </div>
</template>

<script>
import firebase from 'firebase'
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
import PlayerCard from './PlayerCard'
import GameOver from './GameOver'
import InvestigationResults from './InvestigationResults'
import Veto from './Veto'
import PlayerList from './PlayerList'
export default {
  name: 'game-table',
  components: {
    draggable,
    PlayerCard,
    GameOver,
    InvestigationResults,
    Veto,
    PlayerList
  },
  data() {
    return {
      defaultDeck: [
        { name: "POLICY", type: 1, id: 0 },
        { name: "POLICY", type: 1, id: 1 },
        { name: "POLICY", type: 0, id: 2 },
        { name: "POLICY", type: 0, id: 3 },
        { name: "POLICY", type: 1, id: 4 },
        { name: "POLICY", type: 0, id: 5 },
        { name: "POLICY", type: 0, id: 6 },
        { name: "POLICY", type: 1, id: 7 },
        { name: "POLICY", type: 0, id: 8 },
        { name: "POLICY", type: 0, id: 9 },
        { name: "POLICY", type: 1, id: 10 },
        { name: "POLICY", type: 1, id: 11 },
        { name: "POLICY", type: 0, id: 12 },
        { name: "POLICY", type: 0, id: 13 },
        { name: "POLICY", type: 0, id: 14 },
        { name: "POLICY", type: 0, id: 15 },
        { name: "POLICY", type: 0, id: 16 },
      ],
      peekDeck: [],
      hand: [],
      hasDiscarded: false,
      setUpDoc: {
        crowd: [],
        fascistBoard: [],
        liberalBoard: [],
        deck: [],
        president: null,
        chancellor: null,
        nominee: null,
        policies: [],
        graveyard: [],
        failedGovernmentCount: 0,
        previousGovernment: [],
        nextPresidentPosition: -1,
        vetoUnlocked: false,
        callingForVeto: false,
        presidentialVetoVote: null,
        isGameOver: false,
        discard: []
      },
      isInvestigationOver: false,
      investigationResults: null,
      showStartButton: true,
      snapshot: null
    };
  },
  computed: {
    ...mapState({ 
      crowd: 'crowd', 
      fascistBoard: 'fascistBoard', 
      liberalBoard: 'liberalBoard', 
      deck: 'deck', 
      user: 'user', 
      policies: 'policies',
      president: 'president',
      chancellor: 'chancellor',
      nominee: 'nominee',
      failedGovernmentCount: 'failedGovernmentCount',
      graveyard: 'graveyard',
      needToKillPlayer: 'needToKillPlayer',
      needToPeekCards: 'needToPeekCards',
      needToInvestigatePlayer: 'needToInvestigatePlayer',
      needToPickNewPresident: 'needToPickNewPresident',
      nextPresidentPosition: 'nextPresidentPosition',
      previousGovernment: 'previousGovernment',
      callingForVeto: 'callingForVeto',
      isGameOver: 'isGameOver',
      discard: 'discard'
    })
  },
  mounted () {
    var self = this
    this.snapshot = firebase.firestore().collection('root').doc('game-room').onSnapshot(function (doc) {
      self.$store.commit('setCrowd', {
        Crowd: doc.data().crowd
      })
      for (let i = 0; i < self.crowd.length; i++) {
        if (self.crowd[i].userId === self.user.userId) {
          self.$store.commit('setUser', {
            User: self.crowd[i]
          })
          break;
        }
      }

      if (doc.data().president?.userId != self.president?.userId) {
        self.$store.commit('resetPresidentialPowers')
      }
      self.$store.commit('setPresident', {
        President: doc.data().president
      })

      self.$store.commit('setChancellor', {
        Chancellor: doc.data().chancellor
      })

      self.$store.commit('setNominee', {
        Nominee: doc.data().nominee
      })

      if (doc.data().fascistBoard.length > self.fascistBoard.length) {
        self.$store.commit('resetPresidentialPowers')
        switch (doc.data().fascistBoard.length) {
          case 1:
            if (self.crowd.length >= 9) {
              self.$store.commit('setNeedToInvestigatePlayer', {
                NeedToInvestigatePlayer: true
              })
            }
            break
          case 2:
            if (self.crowd.length >= 7) {
              self.$store.commit('setNeedToInvestigatePlayer', {
                NeedToInvestigatePlayer: true
              })
            }
            break
          case 3:
            if (self.crowd.length >= 7) {
              self.$store.commit('setNeedToPickNewPresident', {
                NeedToPickNewPresident: true
              })
            } else if (self.crowd.length === 5 || self.crowd.length === 6) {
              self.$store.commit('setNeedToPeekCards', {
                NeedToPeekCards: true
              })
            }
            break
          case 4:
            self.$store.commit('setNeedToKillPlayer', {
              NeedToKillPlayer: true
            })
            break
          case 5:
            self.$store.commit('setNeedToKillPlayer', {
              NeedToKillPlayer: true
            })
            break
          default:
            break
        }
      }
      self.$store.commit('setFascistBoard', {
        FascistBoard: doc.data().fascistBoard
      })

      self.$store.commit('setLiberalBoard', {
        LiberalBoard: doc.data().liberalBoard
      })

      self.$store.commit('setDeck', {
        Deck: doc.data().deck
      })

      self.$store.commit('setPolicies', {
        Policies: doc.data().policies
      })
      if (doc.data().policies.length === 2) {
        self.handOff()
      }

      self.$store.commit('setFailedGovernmentCount', {
        FailedGovernmentCount: doc.data().failedGovernmentCount
      })
      
      self.$store.commit('setGraveyard', {
        Graveyard: doc.data().graveyard
      })

      self.$store.commit('setPreviousGovernment', {
        PreviousGovernment: doc.data().previousGovernment
      })

      self.$store.commit('setNextPresidentPosition', {
        NextPresidentPosition: doc.data().nextPresidentPosition
      })

      self.$store.commit('setVetoUnlocked', {
        VetoUnlocked: doc.data().vetoUnlocked
      })

      self.$store.commit('setCallingForVeto', {
        CallingForVeto: doc.data().callingForVeto
      })

      self.$store.commit('setPresidentialVetoVote', {
        PresidentialVetoVote: doc.data().presidentialVetoVote
      })

      self.$store.commit('setDiscard', {
        Discard: doc.data().discard
      })

      self.$store.commit('setIsGameOver', {
        IsGameOver: doc.data().isGameOver
      })
    })
  },
  methods: {
    applyClass (policyType) {
      return {
        'policy': true,
        'fascist': policyType === 0,
        'liberal': policyType === 1
      }
    },
    startGame () {
      var pick = Math.floor(Math.random() * (this.crowd.length))
      this.hand = []
      this.hasDiscarded = false
      this.$store.commit('resetPresidentialPowers')
      this.setUpDoc.crowd = this.clearGraveyard()
      this.setUpDoc.crowd.forEach(element => {
        element.vote = null
      })
      this.clearOffices()
      this.assignRoles()
      this.pickPresident(pick)
      this.setUpDoc.deck = this.randomizeDeck(this.defaultDeck)
      this.setUpDoc.discard = []
      this.setUpDoc.policies = []
      this.setUpDoc.isGameOver = false
      this.showStartButton = false
      this.setUpGame()
    },
    leaveGame () {
      var self = this
      for (let x = 0; x < this.crowd.length; x++) {
        if(this.user.userId === this.crowd[x].userId) {
          this.crowd.splice(x,1)
          break
        }
      }
      this.snapshot()
      firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd })
      .then(function () {
        firebase.auth().signOut()
        .then(function() {
          self.$store.commit('clearStore')
          self.$router.replace('/login')
        }).catch(function(error) {
          alert('Failed to leave game!' + error.message)
        })
      })
    },
    addPolicy () {
      var policiesToHandOff = this.hand
      this.hand = []
      firebase.firestore().collection('root').doc('game-room').update({ policies: policiesToHandOff })
    },
    removePolicyFromDeck () {
      firebase.firestore().collection('root').doc('game-room').update({ deck: this.deck })
    },
    restoreDeck () {
      var deck = this.randomizeDeck(this.discard)
      firebase.firestore().collection('root').doc('game-room').update({ deck: deck, discard: [] })
    },
    setUpGame () {
      firebase.firestore().collection('root').doc('game-room').set(this.setUpDoc)
    },
    clearOffices () {
      for (var x = 0; x < this.crowd.length; x++) {
        this.crowd[x].office = 'None'
      }
    },
    clearParties () {
      for (var x = 0; x < this.crowd.length; x++) {
        this.crowd[x].party = 'None'
      }
    },
    clearNominees () {
      for (let x=0; x < this.crowd.length; x++) {
        if (this.crowd[x].office != 'President') {
          this.crowd[x].office = 'None'
        }
      }
    },
    clearGraveyard () {
      var deadplayers = this.graveyard
      if (deadplayers.length > 0) {
        this.$store.commit('setGraveyard', {
          Graveyard: []
        })
        return this.crowd.concat(deadplayers)
      } else {
        return this.crowd
      }
    },
    handOff() {
      if (this.user.office === 'Chancellor') {
        this.hand = this.policies
      }
      this.hasDiscarded = false
    },
    randomizeDeck (deck) {
      for (var i = deck.length - 1; i > 0; i--) {
        var pick = Math.floor(Math.random() * (i + 1))
        var temp = deck[i]
        deck[i] = deck[pick]
        deck[pick] = temp
      }
      return deck
    },
    pickPresident (player) {
      if (player > 0) {
        this.crowd[player-1].office = 'None'
      } else if (player === 0) {
        var lastPlayer = this.crowd.length - 1
        this.crowd[lastPlayer].office = 'None'
      }

      this.crowd[player].office = 'President'
      this.setUpDoc.president = this.crowd[player]
    },
    assignRoles () {
      var roleSet = []
      var playerRole = {
        isHitler: false,
        party: 'None'
      }
      this.crowd.forEach(() => {
        roleSet.push(playerRole)
      })

      switch(this.crowd.length) {
        case 5:
          roleSet = this.createRoleSet(roleSet, 3, 1)
          break
        case 6:
          roleSet = this.createRoleSet(roleSet, 4, 1)
          break
        case 7:
          roleSet = this.createRoleSet(roleSet, 4, 2)
          break
        case 8:
          roleSet = this.createRoleSet(roleSet, 5, 2)
          break
        case 9:
          roleSet = this.createRoleSet(roleSet, 5, 3)
          break
        case 10:
          roleSet = this.createRoleSet(roleSet, 6, 3)
          break
      }
      
      for (let i = roleSet.length - 1; i > 0; i--) {
        var pick = Math.floor(Math.random() * (i + 1))
        var temp = roleSet[i]
        roleSet[i] = roleSet[pick]
        roleSet[pick] = temp
      }
      this.crowd.forEach((element, i) => {
        this.crowd[i].isHitler = roleSet[i].isHitler
        this.crowd[i].party = roleSet[i].party
      })
    },
    createRoleSet(roleSet, numberOfLiberals, numberOfFascists) {
      var hitlerRole = {
        isHitler: true,
        party: 'Fascist'
      }
      var fascistRole = {
        isHitler: false,
        party: 'Fascist'
      }
      var liberalRole = {
        isHitler: false,
        party: 'Liberal'
      }
      roleSet.splice(0, 1, hitlerRole)
      for(let i = 0; i < numberOfLiberals; i++)
      {
        roleSet.splice(i+1, 1, liberalRole)
      }
      
      for(let j = 0; j < numberOfFascists; j++)
      {
        roleSet.splice(j+1+numberOfLiberals, 1, fascistRole)
      }
      return roleSet
    },
    newTurn (policyAdded) {
      this.hand = []
      var crowdLength = this.crowd.length
      if (policyAdded === 0) {
        switch (this.fascistBoard.length) {
          case 1:
            if (crowdLength >= 9) {
              firebase.firestore().collection('root').doc('game-room').update({ fascistBoard: this.fascistBoard })
            } else {
              this.movePresidentToNextPlayer()
            }
            break
          case 2:
            if (crowdLength >= 7) {
              firebase.firestore().collection('root').doc('game-room').update({ fascistBoard: this.fascistBoard })
            } else {
              this.movePresidentToNextPlayer()
            }
            break
          case 3:
            firebase.firestore().collection('root').doc('game-room').update({ fascistBoard: this.fascistBoard })
            break
          case 4:
            firebase.firestore().collection('root').doc('game-room').update({ fascistBoard: this.fascistBoard })
            break
          case 5:
            firebase.firestore().collection('root').doc('game-room').update({ fascistBoard: this.fascistBoard, vetoUnlocked: true })
            break
          case 6:
            firebase.firestore().collection('root').doc('game-room').update({ fascistBoard: this.fascistBoard, isGameOver: true })
            break
          default:
            this.movePresidentToNextPlayer()
        } 
      } else {
        if (this.liberalBoard.length === 5) {
          firebase.firestore().collection('root').doc('game-room').update({ liberalBoard: this.liberalBoard, isGameOver: true })
        } else {
          this.movePresidentToNextPlayer()
        }
      }
    },
    getPresident() {
      var currentPresident
        for (let r = 0; r < this.crowd.length; r++) {
          if (this.president.userId === this.crowd[r].userId) {
            currentPresident = r
            break;
          }
        }
        return currentPresident
    },
    newPresident (player) {
      var lastPlayerInCrowd = this.crowd.length - 1
      var president = null
      if (player != lastPlayerInCrowd) {
          this.crowd[player].office = 'None'
          this.crowd[player + 1].office = 'President'
          president = player + 1
      } else {
          this.crowd[player].office = 'None'
          this.crowd[0].office = 'President'
          president = 0
      }
      return president
    },
    peekCards () {
      if (this.peekDeck.length > 0) {
        this.peekDeck = []
        this.$store.commit('setNeedToPeekCards', {
          NeedToPeekCards: false
        })
        this.movePresidentToNextPlayer()
      } else {
        this.peekDeck.push(this.deck[this.deck.length-3], this.deck[this.deck.length-2], this.deck[this.deck.length-1])
      }
    },
    setInvestigationResults (player, status) {
      this.isInvestigationOver = status
      this.investigationResults = player
      if (!status) {
        this.$store.commit('setNeedToInvestigatePlayer', {
          NeedToInvestigatePlayer: false
        })
        this.movePresidentToNextPlayer()
      }
    },
    discardedPolicy() {
      this.hasDiscarded = true
      if (this.user.office === 'President') {
        firebase.firestore().collection('root').doc('game-room').update({ discard: this.discard })
      } else if (this.user.office === 'Chancellor') {
        firebase.firestore().collection('root').doc('game-room').update({ policies: [], discard: this.discard })
      }
    },
    movePresidentToNextPlayer () {
      this.hand = []
      if (this.nextPresidentPosition != -1) {
        this.clearOffices()
        var nextPresident = this.crowd[this.nextPresidentPosition]
        nextPresident.office = 'President'
        this.$store.commit('setNextPresidentPosition', {
          NextPresidentPosition: -1
        })
        this.$store.commit('setNeedToPickNewPresident', {
          NeedToPickNewPresident: false
        })
        firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd, president: nextPresident, nominee: null, chancellor: null, fascistBoard: this.fascistBoard, liberalBoard: this.liberalBoard })
      } else {
        var newPresident = this.newPresident(this.getPresident())
        this.clearNominees()
        firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd, president: this.crowd[newPresident], nominee: null, chancellor: null, fascistBoard: this.fascistBoard, liberalBoard: this.liberalBoard })
      }
    }
  }
}
</script>
<style scoped>
.overlord {
  display: flex;
}
.table {
  display: flex;
  max-height: 100%;
}
.policy {
  width: 88px;
  height: 125px;
  margin-right: 8.5px;
}
.fascist{
  background-image: url("../assets/fascist-card.png");
  background-size: 100%;
}
.liberal{
  background-image: url("../assets/liberal-card.png");
  background-size: 100%;
}
.fascist-board {
  height: 125px;
  margin: 70px 70px auto 70px;
  display: flex;
}
.liberal-board {
  height: 150px;
  margin: 69px 100px auto 120px;
  display: flex;
}
.board {
  width: 750px;
  padding: 10px;
}
.player-hand {
  padding: 10px;
  display: flex;
}
.hand {
  height: 125px;
  display: flex;
}
.card-hand {
  background: burlywood;
  padding: 10px;
  width: 375px;
}
.handoff {
  width: 100%;
  margin-top: 10px;
  color: white;
}
.deck {
  width: 88px;
  height: 132px;
  grid-column: 1;
  grid-row: 1;
}
.deck-stack {
  width: 75px;
  height: 125px;
  display: grid;
}
.back {
  background-image: url("../assets/policy-card-back.png");
  background-size: 100%;
}
.back {
  background-image: url("../assets/policy-card-back.png");
  background-size: 100%;
}
.back {
  background-image: url("../assets/policy-card-back.png");
  background-size: 100%;
}
.back {
  background-image: url("../assets/policy-card-back.png");
  background-size: 100%;
}
.discard {
  width: 75px;
  height: 125px;
}
.discard-stack {
  width: 88px;
  height: 132px;
}
.title {
  padding-top: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 5px;
}
.small-board {
  margin-top: 200px;
  padding: 10px;
}
.start-button {
  display: flex;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%);
}
.player-card {
  margin-left: 10px;
  max-width: 375px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity .75s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.failed-government-tracker {
  position: relative;
  top:-8.25%;
  padding-left: 35.45%;
  padding-right: 36.25%;
  margin-bottom: -5%;
}
</style>
