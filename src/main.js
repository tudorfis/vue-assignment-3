import Vue from 'vue'
import App from './app-16/App.vue'

const app = new Vue({
  el: '#app',
  render: h => h(App)
})

globalThis.app = app
