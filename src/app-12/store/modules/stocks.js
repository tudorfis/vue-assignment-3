
import stocks from '../../data/stocks'

const state = {
  stocks: []
}

const mutations = {
  'SET_STOCKS' (state, stocks) {
    state.stocks = stocks
  },
  'RND_STOCKS' (state) {
    for (const stock of state.stocks) {
      const fluctuation = (Math.floor(Math.random() * (+10 - -10)) + -10 ) / 100
      const newStockPrice = (stock.price - fluctuation).toFixed(2)
      stock.price = newStockPrice
      
      console.log(state)

      if (state.stockPortfolio && state.stockPortfolio.length) {
        const stockPortfolio = state.stockPortfolio.find(el => el.id === stock.id)

        if (stockPortfolio) {
          const index = state.stockPortfolio.indexOf(stockPortfolio)
          state.stockPortfolio[index].price = newStockPrice
        }
      }
    }
  }
}

const actions = {
  buyStock: ({ commit }, order) => {
    commit('BUY_STOCK', order)
  },
  initStocks: ({ commit }) => {
    commit('SET_STOCKS', stocks)
  },
  randomizeStocks: ({ commit }) => {
    commit('RND_STOCKS')
  }
}

const getters = {
  stocks: ({ stocks }) => state.stocks
}

export default {
  state,
  mutations,
  actions,
  getters
}