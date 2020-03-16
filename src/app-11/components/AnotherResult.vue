<template>
  <div>
    <p>Counter is: {{ doubleCounter }}</p>
    <p>Number of clicks: {{ stringCounter }}</p>
    <strong>{{ anotherCounter }}</strong>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as types from '../store/types'
export default {
  computed: {
    ...mapGetters({
      doubleCounter: types.DOUBLE_COUNTER,
      stringCounter: types.CLICK_COUNTER
    }),
    anotherCounter() {
      return 'anotherCounter'
    }
  }
  // {
  //   counter() {
  //     return this.$store.getters.doubleCounter;
  //   },
  //   clicks() {
  //     return this.$store.getters.stringCounter;
  //   },
  // }
};
</script>

<style>
</style>