<template>
  <div>
    <v-card dark class="login">
      <v-list>
        <v-subheader class="space">PLAYERS</v-subheader>
        <v-divider></v-divider>
        <div
          v-for="(player, index) in crowd"
          :key="index"
          :class="applyOffice(player.office)" >
            <v-list-item v-if="user.office === 'President' && player.office != 'President'" @click="nominateChancellor(index)"> 
              {{ player.username }}
              <v-spacer></v-spacer>
            </v-list-item>
            <v-list-item v-else> 
              {{ player.username }}
              <v-spacer></v-spacer>
            </v-list-item>
          <v-divider v-if="index + 1 < crowd.length" :key="index"></v-divider>
          </div>
      </v-list>
    </v-card>

    <div class="table">
      <div class="small-board">
        <v-card-title class="title">Discard</v-card-title>
        <v-card dark>
          <draggable class="discard-stack" :list="discard" group="cards">
          </draggable>
        </v-card>
      </div>

      <div>
        <div class="board">
          <v-card dark class="board">
            <v-img src="../assets/fascist-board.png" height="auto" width="100%">
              <draggable 
                class="fascist-board" 
                :list="fascistBoard" 
                group="cards" 
                @change="addFascistPolicy" 
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
            <v-img src="../assets/liberal-board.png" height="auto" width="100%" class="img">
              <draggable 
                class="liberal-board" 
                :list="liberalBoard" 
                group="cards" 
                @change="addLiberalPolicy" 
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

        <v-btn dark class="start-button" @click="startGame">START GAME</v-btn>
        <h3 v-if="chancellorNominee != null"> The President has nominated {{ chancellorNominee.username }} for Chancellor</h3>
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
            <player-card class="player-card"> </player-card>
          </div>
          <player-card v-else class="player-hand player-card"> </player-card>
      </div>
      
      <div class="small-board">
        <v-card-title class="title">Policy Deck</v-card-title>
        <draggable class="deck-stack" :list="deck" group="cards" @change="removePolicyFromDeck" :disabled="user.office!='President' || hand.length === 3">
          <v-card
            dark
            class="deck"
            v-for="(element) in deck"
            :key="element.id"
          >
          </v-card>
        </draggable>
        <v-btn dark @click="restoreDeck">Restore</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
import PlayerCard from './PlayerCard'
export default {
  name: 'game-table',
  components: {
    draggable,
    PlayerCard
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
      hand: [],
      discard: [],
      hasDiscarded: false,
      
      setUpDoc: {
        crowd: [],
        fascistBoard: [],
        liberalBoard: [],
        deck: [],
        president: null,
        chancellor: null,
        chancellorNominee: null,
        policies: [],
        graveyard: []
      }
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
      chancellorNominee: 'chancellorNominee',
      graveyard: 'graveyard'
    })
  },
  mounted () {
    var self = this
    firebase.firestore().collection('root').doc('game-room').onSnapshot(function (doc) {
      if (doc.data().policies.length === 2) {
        self.handOff()
      }

      if (doc.data().president?.userId === self.user.userId) {
        self.$store.commit('setUser', {
          User: doc.data().president
        })
      } else if (doc.data().chancellor?.userId === self.user.userId) {
        self.$store.commit('setUser', {
          User: doc.data().chancellor
        })
      } else if (doc.data().chancellorNominee?.userId === self.user.userId) {
        self.$store.commit('setUser', {
          User: doc.data().chancellorNominee
        })
      } else {
        self.user.office = 'None'
        self.$store.commit('setUser', {
          User: self.user
        })
      }

      self.$store.commit('setCrowd', {
        Crowd: doc.data().crowd
      })

      self.$store.commit('setPresident', {
        President: doc.data().president
      })

      self.$store.commit('setChancellor', {
        Chancellor: doc.data().chancellor
      })

      self.$store.commit('setChancellorNominee', {
        ChancellorNominee: doc.data().chancellorNominee
      })

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

      self.$store.commit('setGraveyard', {
        Graveyard: doc.data().graveyard
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
    applyOffice (office) {
      return {
        'president': office === 'President',
        'chancellor': office === 'Chancellor',
        'chancellor-nominee': office === 'Chancellor Nominee',
        'sentenced': office === 'Sentenced'
      }
    },
    startGame () {
      var pick = Math.floor(Math.random() * (this.crowd.length))
      this.hand = []
      this.clearOffices()
      this.assignRoles()
      this.pickPresident(pick)
      this.setUpDoc.deck = this.randomizeDeck()
      this.setUpDoc.policies = []
      this.setUpDoc.crowd = this.crowd
      this.setUpGame()
    },
    addFascistPolicy () {
      this.newTurn(0)
    },
    addLiberalPolicy () {
      this.newTurn(1)
    },
    removePolicyFromDeck () {
      firebase.firestore().collection('root').doc('game-room').update({ deck: this.deck })
    },
    restoreDeck () {
      var deck = this.randomizeDeck()
      firebase.firestore().collection('root').doc('game-room').update({ deck: deck })
    },
    addPolicy () {
      firebase.firestore().collection('root').doc('game-room').update({ policies: this.hand })
      this.hand = []
    },
    clearPolicies () {
      firebase.firestore().collection('root').doc('game-room').update({ policies: [] })
    },
    setUpGame () {
      firebase.firestore().collection('root').doc('game-room').set(this.setUpDoc)
    },
    clearOffices () {
      for (var x = 0; x < this.crowd.length; x++) {
        this.crowd[x].office = 'None'
      }
    },
    handOff() {
      if (this.user.office === 'Chancellor') {
        this.hand = this.policies
      }
      this.hasDiscarded = false
    },
    randomizeDeck () {
      for (var i = this.defaultDeck.length - 1; i > 0; i--) {
        var pick = Math.floor(Math.random() * (i + 1))
        var temp = this.defaultDeck[i]
        this.defaultDeck[i] = this.defaultDeck[pick]
        this.defaultDeck[pick] = temp
      }
      return this.defaultDeck
    },
    nominateChancellor (nominee) {
      this.clearChancellorNominee()
      this.crowd.forEach(element => {
        element.vote = null
      })
      this.crowd[nominee].office = 'Chancellor Nominee'
      firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd, chancellorNominee: this.crowd[nominee] })
    },
    nominateForDeath (nominee) {
      this.clearChancellorNominee()
      this.crowd[nominee].office = 'Sentenced'
      firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd })
    },
    clearChancellorNominee () {
      for (let x=0; x < this.crowd.length; x++) {
        if (this.crowd[x].office != 'President') {
          this.crowd[x].office = 'None'
        }
      }
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
        if (this.crowd[i].userId === this.user.userId) {
          this.$store.commit('setUser', {
            User: this.crowd[i]
          })
        }
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
      this.policyEnacted = false
      var currentPresident
      for (let r = 0; r < this.crowd.length; r++) {
        if (this.president.userId === this.crowd[r].userId) {
          currentPresident = r
          break;
        }
      }
      var newPresident = this.changePresident(currentPresident)
      this.clearChancellorNominee()
      if (policyAdded === 0) {
        firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd, president: this.crowd[newPresident], chancellorNominee: null, chancellor: null, fascistBoard: this.fascistBoard })
      } else if (policyAdded === 1) {
        firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd, president: this.crowd[newPresident], chancellorNominee: null, chancellor: null, liberalBoard: this.liberalBoard })
      }
    },
    changePresident (player) {
      var lastPlayerInCrowd = this.crowd.length - 1
      var pres = null
      if (player != lastPlayerInCrowd) {
          this.crowd[player].office = 'None'
          this.crowd[player + 1].office = 'President'
          pres = player + 1
      } else {
          this.crowd[player].office = 'None'
          this.crowd[0].office = 'President'
          pres = 0
      }
      return pres
    },
  },
  watch: {
    discard() {
      this.hasDiscarded = true
      if (this.user.office === 'Chancellor') {
        this.clearPolicies()
      }
    }
  }
}
</script>
<style scoped>
.login {
  margin: 20px;
  max-width: 250px;
}

.table {
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}
.policy {
  width: 85px;
  height: 125px;
  margin-right: 10px;
}
.fascist{
  background-image: url("../assets/fascist-card.png");
  background-size: 100%;
}
.liberal{
  background-image: url("../assets/liberal-card.png");
  background-size: 100%;
}
.president {
  background: rebeccapurple;
}
.chancellor {
  background: orange 50%;
}
.sentenced {
  background: yellow;
}
.chancellor-nominee {
  background: #ff2a54;
}
.fascist-board {
  height: 125px;
  margin: 70px 70px auto 70px;
  display: flex;
}
.liberal-board {
  height: 150px;
  margin: 70px 120px auto 120px;
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
  width: 75px;
  height: 125px;
  grid-column: 1;
  grid-row: 1;
}
.deck-stack {
  width: 75px;
  height: 125px;
  display: grid;
}
.discard {
  width: 75px;
  height: 125px;
}
.discard-stack {
  width: 75px;
  height: 125px;
}
.title {
  padding-top: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 5px;
}
.small-board {
  padding: 10px;
}
.start-button {
  display: flex;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%);
}
.space {
  padding-left: 15px;
}
.player-card {
  margin-left: 10px;
  max-width: 375px;
}
</style>
