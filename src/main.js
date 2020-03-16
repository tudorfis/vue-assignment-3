import Vue from 'vue'
import App from './app-9/App.vue'

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

new Vue({
  el: '#app',
  render: h => h(App)
})
