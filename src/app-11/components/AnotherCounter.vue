<template>
  <div>
    <div class="box" @mousemove="hoverMe"></div>
    <hr />
    <button class="btn btn-primary" @click="increment(1)">Increment mutation</button>
    <button class="btn btn-primary" @click="decrement(1)">Decrement mutation</button>
    <hr />
    <button class="btn btn-primary" @click="incrementCounter">Increment method</button>
    <button class="btn btn-primary" @click="decrementCounter">Decrement method</button>
    <hr />
    <button class="btn btn-primary" @click="asyncIncrement(50)">Increment async</button>
    <button class="btn btn-primary" @click="asyncDecrement(50)">Decrement async</button>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
export default {
  methods: {
    ...mapMutations(['increment', 'decrement']),
    ...mapActions(['asyncIncrement', 'asyncDecrement']),
    incrementCounter() {
      this.$store.commit('increment');
    },
    decrementCounter() {
      this.$store.commit('decrement');
    },
    hoverMe({ clientY, clientX }) {
      console.log(`x=${clientX} y=${clientY}`)
    }
  }
};
</script>

<style scoped>
.box {
  width: 50px;
  height: 50px;
  background: lightgreen;
}
</style>