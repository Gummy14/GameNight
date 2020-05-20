<template>
  <v-card class="login">
    <div class="field">
      <v-text-field 
        solo-inverted
        label="Name"
        v-model="name"
        @keyup.enter="join"
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
        firebase.auth().signInAnonymously().then(
          function () {
            var currentUser = firebase.auth().currentUser
            currentUser.updateProfile({
              displayName: self.name,
            })
            .then(function() {
              var user = {
                username: currentUser.displayName,
                userId: currentUser.uid,
                isHitler: false,
                party: 'None',
                office: 'None'
              }
              self.$store.commit('setUser', {
                User: user
              })
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
            })
          },
          function (error) {
            alert('Failed to join!' + error.message)
          }
        )
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
