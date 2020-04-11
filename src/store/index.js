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
<<<<<<< HEAD
    election: []
=======
    chancellorNominee: '',
    votes: []
>>>>>>> 658299698ce1da855db4e1d7bff22de5495fba03
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
    setElection (state, payload) {
      state.election = payload.Election
    },
    setVotes (state, payload) {
      state.votes = payload.Votes
    },
    clearStore (state) {
      state.user = undefined,
      state.crowd = [],
      state.fascistBoard = [],
      state.liberalBoard = [],
      state.deck = [],
<<<<<<< HEAD
      state.election = []
=======
      state.chancellorNominee = '',
      state.setVotes = []
>>>>>>> 658299698ce1da855db4e1d7bff22de5495fba03
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
    },
<<<<<<< HEAD
    getElection (state) {
      return state.election
=======
    getChancellorNominee (state) {
      return state.chancellorNominee
    },
    getVotes (state) {
      return state.getVotes
>>>>>>> 658299698ce1da855db4e1d7bff22de5495fba03
    }
  }
})
