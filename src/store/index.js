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
    president: null,
    chancellor: null,
    chancellorNominee: null,
    policies: [],
    failedGovernmentCount: 0,
    graveyard: [],
    needToKillPlayer: false,
    needToPeekCards: false,
    needToInvestigatePlayer: false
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
    setPolicies (state, payload) {
      state.policies = payload.Policies
    },
    setPresident (state, payload) {
      state.president = payload.President
    },
    setChancellor (state, payload) {
      state.chancellor = payload.Chancellor
    },
    setChancellorNominee (state, payload) {
      state.chancellorNominee = payload.ChancellorNominee
    },
    setFailedGovernmentCount (state, payload) {
      state.failedGovernmentCount = payload.FailedGovernmentCount
    },
    setGraveyard (state, payload) {
      state.graveyard = payload.Graveyard
    },
    setNeedToKillPlayer (state, payload) {
      state.needToKillPlayer = payload.NeedToKillPlayer
    },
    setNeedToPeekCards (state, payload) {
      state.needToPeekCards = payload.NeedToPeekCards
    },
    setNeedToInvestigatePlayer (state, payload) {
      state.needToInvestigatePlayer = payload.NeedToInvestigatePlayer
    },
    clearStore (state) {
      state.user = undefined,
      state.crowd = [],
      state.fascistBoard = [],
      state.liberalBoard = [],
      state.deck = [],
      state.policies = [],
      state.president = null,
      state.chancellor = null,
      state.chancellorNominee = null,
      state.failedGovernmentCount = 0,
      state.graveyard = [],
      state.needToKillPlayer = false,
      state.needToPeekCards = false,
      state.needToInvestigatePlayer = false
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
    getPolicies (state) {
      return state.policies
    },
    getPresident (state) {
      return state.president
    },
    getChancellor (state) {
      return state.chancellor
    },
    getChancellorNominee (state) {
      return state.chancellorNominee
    },
    getFailedGovernmentCount (state) {
      return state.failedGovernmentCount
    },
    getGraveyard (state) {
      return state.graveyard
    },
    getNeedToKillPlayer (state) {
      return state.needToKillPlayer
    },
    getNeedToPeekCards (state) {
      return state.needToPeekCards
    },
    getNeedToInvestigatePlayer (state) {
      return state.needToInvestigatePlayer
    },
  }
})
