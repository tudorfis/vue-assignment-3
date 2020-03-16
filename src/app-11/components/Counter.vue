<template>
  <div>
    <button class="btn btn-primary" @click="increment({by: 10, duration: 500})">Increment by 10</button>
    <button class="btn btn-primary" @click="decrement({by: 10, duration: 500})">Decrement by 10</button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions([
      'increment',
      'decrement'
    ])
  }
}
</script>

<style>

</style>