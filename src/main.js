/**
  Vue.filter('to-lowercase', value => {
    return value.toLowerCase()
  })

  Vue.mixin({
    created() {
      console.log('global mixin - created hook')
    }
  })

  Vue.filter('countAppendLength', value => {
    if (!value) return ''
    return `${value} (${value.length})`
  })
*/

/**
  // app-10
  import VueResource from 'vue-resource'
  Vue.use(VueResource)

  Vue.http.options.root = 'https://vue-assignment-4ad0c.firebaseio.com/'
  Vue.http.interceptors.push((request, next) => {
    console.log(request)
    
    if (request.method === 'POST')
      request.method = 'PUT'

    next(response => {
      response.json = _ => ({messages: response.body})
    })
  })
*/

/*
import { store } from './app-11/store/store'

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
*/

/*
import Vue from 'vue'
import App from './app-12/App.vue'
import store from './app-12/store/store'
import * as currencyFilters from './app-12/filters/currency.filter'

Vue.filter('currency', currencyFilters.currency)

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
*/

import Vue from 'vue'
import App from './app-14/App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})