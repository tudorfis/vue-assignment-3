
import * as types from '../types'

const state = {
  counter: 0
}

const getters = {
  [types.DOUBLE_COUNTER]: ({ counter }) => counter * 2,
  [types.CLICK_COUNTER]: ({ counter }) => `${counter} Clicks`
}

const mutations = {
  increment: (state, by) => {
    if (by)
      state.counter += by
    else
      state.counter++
  },
  decrement: (state, by) => {
    if (by)
      state.counter -= by
    else
      state.counter--
  }
}

const actions = {
  increment: ({ commit }, payload) => {
    const by = typeof payload === 'object' ? payload.by : payload
    
    commit('increment', by)
    console.log(payload)
  },
  decrement: ({ commit }, payload) => {
    const by = typeof payload === 'object' ? payload.by : payload
    
    commit('decrement', by)
    console.log(payload)
  },
  asyncIncrement: ({ commit }, payload) => {
    setTimeout(() => {
      commit('increment', payload)
    }, 1000);
  },
  asyncDecrement: ({ commit }, payload) => {
    setTimeout(() => {
      commit('decrement', payload)
    }, 1000);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}