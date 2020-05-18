import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import GameTable from '@/components/GameTable.vue'
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
  var currentUser
  if (localStorage.getItem('user')) {
    currentUser = JSON.parse(localStorage.getItem('user'))

    store.commit('setUser', {
      User: currentUser
    })

  } else {
    currentUser = null
  }
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('log-in')
  else if (!requiresAuth && currentUser) next('game-table')
  else next()
})

export default router
