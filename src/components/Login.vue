<template>
  <v-card class="login">
    <div class="field">
      <v-text-field 
        solo-inverted
        label="Email"
        v-model="email"
      ></v-text-field>
      <v-text-field 
        solo-inverted
        label="Password"
        type="password"
        v-model="password"
      ></v-text-field>
      <v-btn @click="login" class="login-btn">Login</v-btn>
      <router-link to="/sign-up">Sign Up</router-link>
    </div>
  </v-card>
</template>

<script>
import firebase from 'firebase'
  export default {
    name: 'log-in',
    data () {
    return {
      email: '',
      password: ''
    }
  },
    methods: {
      login () {
        var db = firebase.firestore()
        var self = this
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
          function () {
            var currentUser = firebase.auth().currentUser

            var user = {
              username: currentUser.displayName,
              userId: currentUser.uid,
              email: currentUser.email,
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
          },
          function (error) {
            alert('Failed to Log In!' + error.message)
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
