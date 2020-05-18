<template>
  <v-card class="login">
    <div class="field">
      <v-text-field 
        solo-inverted
        label="Name"
        v-model="name"
      ></v-text-field>
      <v-btn @click="join" class="login-btn">Join Game!</v-btn>
    </div>
  </v-card>
</template>

<script>
import firebase from 'firebase'
  export default {
    name: 'log-in',
    data () {
    return {
      name: ''
    }
  },
    methods: {
      join () {
        var db = firebase.firestore()
        var self = this
        var user = {
          username: this.name,
          userId: "test-id",
          isHitler: false,
          party: 'None',
          office: 'None'
        }
        this.$store.commit('setUser', {
          User: user
        })
        localStorage.setItem('user', JSON.stringify(user))
        db.collection('root').doc('game-room').get().then((doc) => {
          var crowd = doc.data().crowd
          crowd.push(user)
          self.$store.commit('setCrowd', {
            Crowd: crowd
          })
          db.collection('root').doc('game-room').update({ crowd: crowd })
        })
        .then(() => {
          self.$router.replace('/game-table')
        })
      }
    }
  }
</script>
<style scoped>
.login {
  margin: 20px;
  max-width: 350px;
}
.field {
  padding: 10px;
}
.login-btn {
  margin-right: 20px;
}
</style>
