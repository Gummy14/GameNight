<template>
  <div>
    <v-footer color="#1e1e1e" padless fixed>
      <v-row justify="center" no-gutters>
        <v-col
          justify="center"
          v-for="(player, index) in crowd"
          :key="index"
          color="white"
          class="names"
          @click="vote()"
          >
          <div v-if="user.office === 'President' && player.office != 'President'">
            <div v-if="!needToKillPlayer && !needToInvestigatePlayer && !needToPickNewPresident">

              <v-card
                v-if="previousGovernment.length === 2 && player.userId != previousGovernment[0] && player.userId != previousGovernment[1]" 
                @click="nominate(index, 'Chancellor Nominee')"
                :class="applyOffice(player)"
                class="pa-2 cardhover "
                dark
                outlined
                hover
                >
                <div class="text-center">
                  {{ player.username }}
                  <v-icon v-if="player.vote != null">{{ checkedBox }}</v-icon>
                </div>
              </v-card>

              <v-card
                v-else-if="previousGovernment.length === 2 && player.userId === previousGovernment[0] || player.userId === previousGovernment[1]" 
                :class="applyOffice(player)"
                class="pa-2 cardhover "
                dark
                outlined
                hover
                >
                <div class="text-center">
                  {{ player.username }}
                  <v-icon v-if="player.vote != null">{{ checkedBox }}</v-icon>
                </div>
              </v-card>

              <v-card
                v-else-if="previousGovernment.length === 0"
                @click="nominate(index, 'Chancellor Nominee')"
                :class="applyOffice(player)"
                class="pa-2 cardhover "
                dark
                outlined
                hover
                >
                <div class="text-center">
                  {{ player.username }}
                  <v-icon v-if="player.vote != null">{{ checkedBox }}</v-icon>
                </div>
              </v-card>
            </div>
            <v-card
              v-else-if="needToKillPlayer"
              @click="nominate(index, 'Sentenced')"
              :class="applyOffice(player)"
              class="pa-2 cardhover "
              dark
              outlined
              hover
              >
              <div class="text-center">
                {{ player.username }}
                <v-icon v-if="player.vote != null">{{ checkedBox }}</v-icon>
              </div>
            </v-card>

            <v-card
              v-else-if="needToInvestigatePlayer"
              @click="nominate(index, 'Under Investigation')"
              :class="applyOffice(player)"
              class="pa-2 cardhover "
              dark
              outlined
              hover
              >
              <div class="text-center">
                {{ player.username }}
                <v-icon v-if="player.vote != null">{{ checkedBox }}</v-icon>
              </div>
            </v-card>

            <v-card
              v-else-if="needToPickNewPresident"
              @click="nominate(index, 'New President')"
              :class="applyOffice(player)"
              class="pa-2 cardhover "
              dark
              outlined
              hover
              >
              <div class="text-center">
                {{ player.username }}
                <v-icon v-if="player.vote != null">{{ checkedBox }}</v-icon>
              </div>
            </v-card>
          </div>
          <v-card
            v-else
            :class="applyOffice(player)"
            class="pa-2 cardhover "
            dark
            outlined
            hover
            >
            <div class="text-center">
              {{ player.username }}
              <v-icon v-if="player.vote != null">{{ checkedBox }}</v-icon>
            </div>
          </v-card>
        </v-col>
      </v-row> 
    </v-footer>
  </div>
</template>
<script>
import firebase from 'firebase'
import { mapState } from 'vuex'
import { mdiCheckboxMarkedOutline } from '@mdi/js';
export default {
  name: 'player-list',
  data() {
    return {
      checkedBox: mdiCheckboxMarkedOutline
    }
  },
  computed: {
    ...mapState({ 
      crowd: 'crowd',
      user: 'user',
      needToKillPlayer: 'needToKillPlayer',
      needToPeekCards: 'needToPeekCards',
      needToInvestigatePlayer: 'needToInvestigatePlayer',
      needToPickNewPresident: 'needToPickNewPresident',
      previousGovernment: 'previousGovernment',
    })
  },
  methods: {
    applyOffice (player) {
      if ((this.user.party === 'Fascist' && !this.user.isHitler) || (this.user.isHitler && this.crowd.length < 7)) {
        return {
          'president': player.office === 'President' && player.party != 'Fascist',
          'chancellor': player.office === 'Chancellor' && player.party != 'Fascist',
          'chancellor-nominee': player.office === 'Chancellor Nominee' && player.party != 'Fascist',
          'sentenced': player.office === 'Sentenced' && player.party != 'Fascist',
          'under-investigation': player.office === 'Under Investigation' && player.party != 'Fascist',
          'new-president': player.office === 'New President' && player.party != 'Fascist',
          
          'fascist-player': player.party === 'Fascist' && !player.isHitler && player.office === 'None',
          'fascist-player-president': player.party === 'Fascist' && !player.isHitler && player.office === 'President',
          'fascist-player-chancellor': player.party === 'Fascist' && !player.isHitler && player.office === 'Chancellor',
          'fascist-player-chancellor-nominee': player.party === 'Fascist' && !player.isHitler && player.office === 'Chancellor Nominee',
          'fascist-player-sentenced': player.party === 'Fascist' && !player.isHitler && player.office === 'Sentenced',
          'fascist-player-under-investigation': player.party === 'Fascist' && !player.isHitler && player.office === 'Under Investigation',
          'fascist-player-new-president': player.party === 'Fascist' && !player.isHitler && player.office === 'New President',

          'hitler' : player.isHitler,
          'hitler-president': player.isHitler && player.office === 'President',
          'hitler-chancellor': player.isHitler && player.office === 'Chancellor',
          'hitler-chancellor-nominee': player.isHitler && player.office === 'Chancellor Nominee',
          'hitler-sentenced': player.isHitler && player.office === 'Sentenced',
          'hitler-under-investigation': player.isHitler && player.office === 'Under Investigation',
          'hitler-new-president': player.isHitler && player.office === 'New President',
        }
      } else if (this.user.isHitler && this.crowd.length > 6) {
        return {
          'president': player.office === 'President',
          'chancellor': player.office === 'Chancellor',
          'chancellor-nominee': player.office === 'Chancellor Nominee',
          'sentenced': player.office === 'Sentenced',
          'under-investigation': player.office === 'Under Investigation',
          'new-president': player.office === 'New President',
          
          'hitler' : player.isHitler,
          'hitler-president': player.isHitler && player.office === 'President',
          'hitler-chancellor': player.isHitler && player.office === 'Chancellor',
          'hitler-chancellor-nominee': player.isHitler && player.office === 'Chancellor Nominee',
          'hitler-sentenced': player.isHitler && player.office === 'Sentenced',
          'hitler-under-investigation': player.isHitler && player.office === 'Under Investigation',
          'hitler-new-president': player.isHitler && player.office === 'New President',
        }
      } else {
        return {
          'president': player.office === 'President',
          'chancellor': player.office === 'Chancellor',
          'chancellor-nominee': player.office === 'Chancellor Nominee',
          'sentenced': player.office === 'Sentenced',
          'under-investigation': player.office === 'Under Investigation',
          'new-president': player.office === 'New President',
        }
      }
    },
    nominate(nominee, nomination) {
      this.clearNominees()
      this.crowd.forEach(element => {
        element.vote = null
      })
      this.crowd[nominee].office = nomination
      firebase.firestore().collection('root').doc('game-room').update({ crowd: this.crowd, nominee: this.crowd[nominee] })
    },
    clearNominees () {
      for (let x=0; x < this.crowd.length; x++) {
        if (this.crowd[x].office != 'President') {
          this.crowd[x].office = 'None'
        }
      }
    }
  }
}
</script>
<style scoped>
.login {
  margin: 20px;
  margin-right: 100px;
  width: 250px;
  height: max-content;
}
.space {
  padding-left: 15px;
}
.names {
  width: 200px;
}
.president {
  background: rebeccapurple;
}
.chancellor {
  background: #5a8bb9;
}
.sentenced {
  background: yellow;
}
.chancellor-nominee {
  background: #a4b3c1;
}
.under-investigation {
  background: #2aff4e;
}
.new-president {
  background: #7a589c;
}
.fascist-player {
  background: #fc5f4a;
}
.fascist-player-president {
  background: linear-gradient(to right, #fc5f4a 0%, rebeccapurple 100%);
}
.fascist-player-chancellor {
  background: linear-gradient(to right, #fc5f4a 0%, #5a8bb9 100%);
}
.fascist-player-sentenced {
  background: linear-gradient(to right, #fc5f4a 0%, yellow 100%);
}
.fascist-player-chancellor-nominee {
  background: linear-gradient(to right, #fc5f4a 0%, #a4b3c1 100%);
}
.fascist-player-under-investigation {
  background: linear-gradient(to right, #fc5f4a 0%, #2aff4e 100%);
}
.fascist-player-new-president {
  background: linear-gradient(to right, #fc5f4a 0%, #7a589c 100%);
}
.hitler {
  background: #a6120f;
}
.hitler-president {
  background: linear-gradient(to right, #a6120f 0%, rebeccapurple 100%);
}
.hitler-chancellor {
  background: linear-gradient(to right, #a6120f 0%, #5a8bb9 100%);
}
.hitler-sentenced {
  background: linear-gradient(to right, #a6120f 0%, yellow 100%);
}
.hitler-chancellor-nominee {
  background: linear-gradient(to right, #a6120f 0%, #a4b3c1 100%);
}
.hitler-under-investigation {
  background: linear-gradient(to right, #a6120f 0%, #2aff4e 100%);
}
.hitler-new-president {
  background: linear-gradient(to right, #a6120f 0%, #7a589c 100%);
}
.cardhover:hover {
  background: white;
  color: black;
}
</style>
