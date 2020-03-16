
const state = {
  funds: 10**4,
  stockPortfolio: []
}

const mutations = {
  'BUY_STOCK' (state, {  stockId, stockName, quantity, stockPrice }) {
    const record = state.stockPortfolio.find(stock => stock.id == stockId)
    if (record) {
      record.quantity += quantity
    
    } else {
      state.stockPortfolio.unshift({
        id: stockId,
        name: stockName,
        quantity,
        price: stockPrice
      })
    }
    state.funds -= stockPrice * quantity
  },
  'SELL_STOCK' (state, { stockId, quantity, stockPrice }) {
    const record = state.stockPortfolio.find(stock => stock.id === stockId)
    if (record.quantity > quantity) {
      record.quantity -= quantity
    } else {
      state.stockPortfolio.splice(state.stockPortfolio.indexOf(record), 1)
    }
    state.funds += stockPrice * quantity
  }
}

const actions = {
  sellStock({ commit }, order) {
    commit('SELL_STOCK', order)
  }
}

const getters = {
  stockPortfolio: ({ stockPortfolio }) => stockPortfolio,
  funds: ({ funds }) => funds
}

export default {
  state,
  mutations,
  actions,
  getters
}