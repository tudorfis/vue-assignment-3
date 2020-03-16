<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <h3>Vuex</h3>
        <app-result></app-result>
        <app-another-result></app-another-result>
        <hr>
        <app-counter></app-counter>
        <br>
        <app-another-counter></app-another-counter>
        <hr>
        <!-- <input type="text" :value="value" @input.number="updateValue"> -->
        <input type="text" v-model="value">
        <p>{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import CounterVue from './components/Counter.vue'
import ResultVue from './components/Result.vue'
import AnotherResultVue from './components/AnotherResult.vue'
import AnotherCounterVue from './components/AnotherCounter.vue'
export default {
  computed: {
    value: {
      get() {
        return this.$store.getters.value
      },
      set(value) {
        this.$store.dispatch('updateValue', value)
      }
    }
  },
  components: {
    appCounter: CounterVue,
    appResult: ResultVue,
    appAnotherResult: AnotherResultVue,
    appAnotherCounter: AnotherCounterVue
  }
}
</script>

<style>

</style>