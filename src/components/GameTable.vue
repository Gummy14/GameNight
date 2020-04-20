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
            <v-img src="https://miro.medium.com/max/2000/1*rnfWK2ASMWQXbRjxwlbVqg.png" height="auto" width="100%">
              <draggable class="fascist-board" :list="fascistBoard" group="cards" @change="addFascistPolicy" :disabled="user.office!='Chancellor'">
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
            <v-img src="https://miro.medium.com/max/2000/1*MggrZZYsCG3TYk3ARZSzNg.png" height="auto" width="100%" class="img">
              <draggable class="liberal-board" :list="liberalBoard" group="cards" @change="addLiberalPolicy" :disabled="user.office!='Chancellor'">
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
        <h3 v-if="chancellorNominee != ''"> The President has nominated {{ chancellorNominee }} for Chancellor</h3>
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
              <v-btn :outlined="hand.length != 2" color="#1e1e1e" :disabled="hand.length != 2" class="handoff" @click="addPolicy()">
                Hand off cards
              </v-btn>
            </v-card>
            <player-card class="player-card"> </player-card>
          </div>
          <player-card v-else class="player-hand player-card"> </player-card>
      </div>
      
      <div class="small-board">
        <v-card-title class="title">Policy Deck</v-card-title>
        <draggable class="deck-stack" :list="deck" group="cards" @change="removePolicyFromDeck" :disabled="user.office!='President'">
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
      setUpDoc: {
        crowd: [],
        fascistBoard: [],
        liberalBoard: [],
        deck: [],
        president: null,
        chancellor: null,
        chancellorNominee: null,
        policies: []
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
      chancellorNominee: 'chancellorNominee'
    }),
    chancellorNominee () {
      var doesChancellorNomineeExist = false
      var chancellorNominee = ''
      this.crowd.forEach(element => {
        if (element.office === 'Chancellor Nominee') {
          doesChancellorNomineeExist = true
          chancellorNominee = element.username
        }
      })
      if (doesChancellorNomineeExist === false) {
        return ''
      } else {
        return chancellorNominee
      }
    }
  },
  mounted () {
    var self = this
    firebase.firestore().collection('root').doc('game-room').onSnapshot(function (doc) {
      console.log('mounted')
      if (doc.data().policies.length === 2) {
        console.log('HERE')
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
        'chancellor-nominee': office === 'Chancellor Nominee'
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
      firebase.firestore().collection('root').doc('game-room').update({ fascistBoard: this.fascistBoard })
    },
    addLiberalPolicy () {
      firebase.firestore().collection('root').doc('game-room').update({ liberalBoard: this.liberalBoard })
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
        console.log('IF')
        console.log('TEST')
        this.hand = this.policies
        this.clearPolicies()
      }
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
    newTurn () {
      this.changePresident()
      this.clearChancellorNominee()
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
  color: yellow;
  background: rebeccapurple;
}
.chancellor {
  background: orange 50%;
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
  width: 270px;
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
  width: 270px;
}
</style>
