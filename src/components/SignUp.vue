<template>
  <v-card class="login">
    <div class="field">
      <v-form v-model="isValid">
        <v-text-field 
        solo-inverted
        label="Username"
        v-model="username"
        :rules="nameRules"
        required
      ></v-text-field>
      <v-text-field 
        solo-inverted
        label="Email"
        v-model="email"
        :rules="emailRules"
        hint="E-mail must be valid"
        validate-on-blur
        required
      ></v-text-field>
      <v-text-field 
        solo-inverted
        label="Password"
        type="password"
        v-model="password"
        :rules="passwordRules"
        hint="Password must be longer than 5 characters"
        validate-on-blur
        required
      ></v-text-field>
      <v-text-field 
        solo-inverted
        label="Confirm Password"
        type="password"
        v-model="passwordConfirm"
        :rules="passwordRules"
        hint="Passwords must match"
        validate-on-blur
        required
      ></v-text-field>
      <v-btn :disabled="!isValid" @click="signUp" class="login-btn">Confirm and Login</v-btn>
      </v-form>
      <v-alert class="alert" v-model="arePasswordsDifferent" type="error">Passwords Do Not Match</v-alert>
    </div>
  </v-card>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'sign-up',
  data () {
    return {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      isValid: false,
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 50 || 'Name must be less than 50 characters'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length > 5 || 'Password must be greater than 5 characters'
      ],
      arePasswordsDifferent: false
    }
  },
  methods: {
    signUp () {
      var db = firebase.firestore()
      var self = this
      if (this.password != this.passwordConfirm) {
        this.arePasswordsDifferent = true
      } else {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        function () {
          var currentUser = firebase.auth().currentUser

          currentUser.updateProfile({
            displayName: self.username,
          })
          .then(function() {
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
          })
          .catch(function(error) {
            alert('Failed to Log In!' + error.message)
          })
        },
        function (error) {
          alert('Failed to sign up!' + error.message)
        }
      )
      }
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
.alert {
  margin-top: 10px;
}
</style>
