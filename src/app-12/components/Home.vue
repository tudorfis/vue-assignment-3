<template>
  <div>
    <h3>Trade or View Your Portfolio</h3>
    <h6>You may Save &amp; Load your Data</h6>
    <hr>
    <p>Your Funds: {{ funds | currency }}</p>
  </div>
</template>

<script>

export default {
  computed: {
    funds() {
      return this.$store.getters.funds;
    }
  }
};
</script>

<style>
</style>