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

const appNumber = window.location.search.match(/\=(\d+)/)[1];
console.log(appNumber)

import Vue from 'vue'
import App14 from './app-14/App.vue'
import App15 from './app-15/App.vue'

let App
switch(appNumber) {
  case '14': App = App14; break;
  case '15': App = App15; break;
}

new Vue({
  el: '#app',
  render: h => h(App)
})