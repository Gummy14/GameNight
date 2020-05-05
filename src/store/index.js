import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    crowd: [],
    fascistBoard: [],
    liberalBoard: [],
    deck: [],
    president: null,
    chancellor: null,
    nominee: null,
    policies: [],
    failedGovernmentCount: 0,
    graveyard: [],
    needToKillPlayer: false,
    needToPeekCards: false,
    needToInvestigatePlayer: false,
    needToPickNewPresident: false,
    previousChancellor: '',
    nextPresidentPosition: -1,
    vetoUnlocked: false,
    callingForVeto: false,
    presidentialVetoVote: null
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
    setNominee (state, payload) {
      state.nominee = payload.Nominee
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
    setNeedToPickNewPresident (state, payload) {
      state.needToPickNewPresident = payload.NeedToPickNewPresident
    },
    setPreviousChancellor (state, payload) {
      state.previousChancellor = payload.PreviousChancellor
    },
    setNextPresidentPosition (state, payload) {
      state.nextPresidentPosition = payload.NextPresidentPosition
    },
    setVetoUnlocked (state, payload) {
      state.vetoUnlocked = payload.VetoUnlocked
    },
    setCallingForVeto (state, payload) {
      state.callingForVeto = payload.CallingForVeto
    },
    resetPresidentialPowers (state) {
      state.needToKillPlayer = false,
      state.needToPeekCards = false,
      state.needToInvestigatePlayer = false,
      state.needToPickNewPresident = false,
      state.nextPresidentPosition = -1
    },
    setPresidentialVetoVote (state, payload) {
      state.presidentialVetoVote = payload.PresidentialVetoVote
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
      state.nominee = null,
      state.failedGovernmentCount = 0,
      state.graveyard = [],
      state.needToKillPlayer = false,
      state.needToPeekCards = false,
      state.needToInvestigatePlayer = false,
      state.needToPickNewPresident = false,
      state.previousChancellor = '',
      state.nextPresidentPosition = -1,
      state.vetoUnlocked = false,
      state.callingForVeto = false,
      state.presidentialVetoVote = null
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
    getNominee (state) {
      return state.nominee
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
    getNeedToPickNewPresident (state) {
      return state.needToPickNewPresident
    },
    getPreviousChancellor (state) {
      return state.previousChancellor
    },
    getNextPresidentPosition (state) {
      return state.nextPresidentPosition
    },
    getVetoUnlocked (state) {
      return state.vetoUnlocked
    },
    getCallingForVeto (state) {
      return state.callingForVeto
    },
    getpresidentialVetoVote (state) {
      return state.presidentialVetoVote
    }
  }
})
