import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import SignUp from '@/components/SignUp.vue'
import GameTable from '@/components/GameTable.vue'
import firebase from 'firebase'
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'log-in',
    component: Login
  },
  {
    path: '/',
    name: 'log-in',
    component: Login
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: SignUp
  },
  {
    path: '/game-table',
    name: 'game-table',
    component: GameTable,
    meta: {
      requiresAuth: true
    } 
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if(currentUser) {
    var user = {
      username: currentUser.displayName,
      userId: currentUser.uid,
      email: currentUser.email
    }

    store.commit('setUser', {
      User: user
    })
  }

  if (requiresAuth && !currentUser) next('log-in')
  else if (!requiresAuth && currentUser) next('game-table')
  else next()
})

export default router
