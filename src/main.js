
const appNumber = window.location.search.match(/\=(\d+)/)[1];

import Vue from 'vue'
import App14 from './app-14/App.vue'
import App15 from './app-15/App.vue'

let App
switch(appNumber) {
  case '14': App = App14; break;
  case '15': App = App15; break;
}

const app = new Vue({
  el: '#app',
  render: h => h(App)
})

globalThis.app = app
