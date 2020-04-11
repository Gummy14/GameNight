import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: undefined,
    crowd: [],
    fascistBoard: [],
    liberalBoard: [],
    deck: [],
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload.User
    },
    setCrowd (state, payload) {
      state.crowd = payload.Crowd
    },
    setFascistBoard (state, payload) {
      state.fascistBoard = payload.FascistBoard
    },
    setLiberalBoard (state, payload) {
      state.liberalBoard = payload.LiberalBoard
    },
    setDeck (state, payload) {
      state.deck = payload.Deck
    },
    clearStore (state) {
      state.user = undefined,
      state.crowd = [],
      state.fascistBoard = [],
      state.liberalBoard = [],
      state.deck = []
    }
  },
  actions: {
  },
  getters: {
    getUser (state) {
      return state.user
    },
    getCrowd (state) {
      return state.crowd
    },
    getFascistBoard (state) {
      return state.fascistBoard
    },
    getLiberalBoard (state) {
      return state.liberalBoard
    },
    getDeck (state) {
      return state.deck
    }
  }
})
