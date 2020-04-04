<template>
  <div>
    <v-card class="login">
      <v-card-title>Current Players</v-card-title>
      <v-expansion-panels
        accordion
      >
      <template v-for="(user, index) in crowd">
        <v-expansion-panel ripple :key="user.userId">
          <v-expansion-panel-header :class="applyOffice(user.office)"> {{ user.username }} </v-expansion-panel-header>
          <v-expansion-panel-content>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-divider v-if="index + 1 < crowd.length" :key="index"></v-divider>
      </template>
    </v-expansion-panels>
    </v-card>


    <div class="table">
      <div class="small-board">
        <v-card-title class="title">Discard</v-card-title>
        <v-card>
          <draggable class="discard-stack" :list="discard" group="cards">
          </draggable>
        </v-card>
      </div>

      <div>
        <div class="board">
          <v-card-title class="title">Fascist Board</v-card-title>
          <v-card class="board">
            <draggable class="fascist-board" :list="fascistBoard" group="cards" @change="addFascistPolicy">
              <v-card
                :class="applyClass(element.type)"
                v-for="(element) in fascistBoard"
                :key="element.id"
              >
              </v-card>
            </draggable>
          </v-card>
        </div>

        <div class="board">
          <v-card-title class="title">Liberal Board</v-card-title>
          <v-card class="board">
            <draggable class="liberal-board" :list="liberalBoard" group="cards" @change="addLiberalPolicy">
              <v-card
                :class="applyClass(element.type)"
                v-for="(element) in liberalBoard"
                :key="element.id"
              >
              </v-card>
            </draggable>
          </v-card>
        </div>

        <v-btn class="start-button" @click="startGame">START GAME</v-btn>
        <div class="board">
          <v-card-title class="title">Your Policies</v-card-title>
          <v-card class="card-hand">
            <draggable class="hand" :list="hand" group="cards">
              <v-card
                :class="applyClass(element.type)"
                v-for="(element) in hand"
                :key="element.id"
              >
              </v-card>
            </draggable>
          </v-card>
        </div>
      </div>
      
      <div class="small-board">
        <v-card-title class="title">Policy Deck</v-card-title>
        <draggable class="deck-stack" :list="deck" group="cards" @change="removePolicyFromDeck">
          <v-card
            class="deck"
            v-for="(element) in deck"
            :key="element.id"
          >
          </v-card>
        </draggable>
        <v-btn @click="restoreDeck">Restore</v-btn>
      </div>
    </div>
    
  </div>
</template>

<script>
import firebase from 'firebase'
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
export default {
  name: 'game-table',
  components: {
    draggable,
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
      discard: []
    };
  },
  computed: {
    ...mapState({ crowd: 'crowd', fascistBoard: 'fascistBoard', liberalBoard: 'liberalBoard', deck: 'deck', user: 'user' })
  },
  mounted () {
    var self = this
    firebase.firestore().collection('root').doc('game-room').onSnapshot(function (doc) {
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
        'chancellor': office === 'Chancellor'
      }
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
    startGame () {
      var pick = Math.floor(Math.random() * (this.crowd.length + 1))
      this.assignRoles()
      this.restoreDeck()
      for (var x = 0; x < this.crowd.length; x++) {
        this.crowd[x].office = 'None'
      }
      this.changePresident(pick)
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
    changePresident (player) {
      if (player > 0) {
        this.crowd[player-1].office = 'None'
      } else if (player === 0) {
        var lastPlayer = this.crowd.length - 1
        this.crowd[lastPlayer].office = 'None'
      }
      this.crowd[player].office = 'President'
      if (this.crowd[player].userId === this.user.userId) {
        this.user.office = 'President'
        this.$store.commit('setUser', {
              User: this.user
            })
      } else if (this.crowd[player].userId !== this.user.userId) {
        this.user.office = 'None'
        this.$store.commit('setUser', {
              User: this.user
            })
      }
      firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd })
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
      firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd })
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
    }
  }
}
</script>
<style scoped>
.login {
  margin: 20px;
  max-width: 350px;
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
  width: 75px;
  height: 125px;
  margin-right: 10px;
}
.fascist{
  background: red;
}
.liberal{
  background: blue;
}
.president {
  color: yellow;
}
.fascist-board {
  height: 125px;
  display: flex;
}
.liberal-board {
  height: 125px;
  display: flex;
}
.board {
  width: 550px;
  padding: 10px;
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
</style>
