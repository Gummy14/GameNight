<template>
  <v-card>
    <div>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="headline mb-1"> {{ user.username}} </v-list-item-title>
                <v-list-item-title class="headline mb-1">{{ user.party }}</v-list-item-title>
          <v-list-item-subtitle>{{isHitler}}</v-list-item-subtitle>
                <!-- <v-card v-if="user.party==='Fascist'" class="fascist"></v-card>
                <v-card v-else class="policy liberal"></v-card> -->
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
            <v-btn :disabled="didVote" @click="vote(true)">Vote Ja!</v-btn>
            <v-btn :disabled="didVote" @click="vote(false)">Vote Nein!</v-btn>
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
      didVote: false
    };
  },
  computed: {
    ...mapState({ user: 'user', election: 'election'}),
    isHitler() {
        if (this.user.isHitler === true) {
            return 'You are Hitler'
        } else {
            return 'You are not Hitler'
        }
    }
  },
  methods: {
    vote(ballot) {
      this.election.push(ballot)
      firebase.firestore().collection('root').doc('game-room').update({ election: this.election })
      this.didVote = true
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
  
}
.button {
    flex: wrap;
}
</style>