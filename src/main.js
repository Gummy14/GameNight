import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import * as firebase from "firebase"

Vue.config.productionTip = false

//PROD
const firebaseConfig = {
  apiKey: "AIzaSyDatwU4wRTJZeGVTaer3o03UG6oBQ6hveQ",
  authDomain: "game-night-19da4.firebaseapp.com",
  databaseURL: "https://game-night-19da4.firebaseio.com",
  projectId: "game-night-19da4",
  storageBucket: "game-night-19da4.appspot.com",
  messagingSenderId: "395262653179",
  appId: "1:395262653179:web:19b43642ee7a92a814365e",
  measurementId: "G-JF923W4H26"
};

//QA
// const firebaseConfig = {
//   apiKey: "AIzaSyD1itMDC20-qDtyfQeKO0P-jG7EDIH9YEE",
//   authDomain: "game-night-qa.firebaseapp.com",
//   databaseURL: "https://game-night-qa.firebaseio.com",
//   projectId: "game-night-qa",
//   storageBucket: "game-night-qa.appspot.com",
//   messagingSenderId: "245213836634",
//   appId: "1:245213836634:web:5d9cce38c2b35a3424af63",
//   measurementId: "G-YHGBGLJEQX"
// };
firebase.initializeApp(firebaseConfig)

let app = ''
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})
