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
    previousGovernment: [],
    nextPresidentPosition: -1,
    vetoUnlocked: false,
    callingForVeto: false,
    presidentialVetoVote: null,
    isGameOver: false,
    discard: []
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
    setPreviousGovernment (state, payload) {
      state.previousGovernment = payload.PreviousGovernment
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
    setPresidentialVetoVote (state, payload) {
      state.presidentialVetoVote = payload.PresidentialVetoVote
    },
    setIsGameOver (state, payload) {
      state.isGameOver = payload.IsGameOver
    },
    setDiscard (state, payload) {
      state.discard = payload.Discard
    },
    resetPresidentialPowers (state) {
      state.needToKillPlayer = false,
      state.needToPeekCards = false,
      state.needToInvestigatePlayer = false,
      state.needToPickNewPresident = false
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
      state.previousGovernment = [],
      state.nextPresidentPosition = -1,
      state.vetoUnlocked = false,
      state.callingForVeto = false,
      state.presidentialVetoVote = null,
      state.isGameOver = false,
      state.discard = []
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
    getPreviousGovernment (state) {
      return state.previousGovernment
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
    },
    getIsGameOver (state) {
      return state.isGameOver
    },
    getDiscard (state) {
      return state.discard
    }
  }
})
