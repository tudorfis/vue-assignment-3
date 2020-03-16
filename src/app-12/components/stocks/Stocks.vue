<template>
  <div>
    <app-stock v-for="stock of stocks" :stock="stock"></app-stock>
  </div>
</template>

<script>
import StockVue from './Stock.vue';
export default {
  components: {
    appStock: StockVue
  },
  computed: {
    stocks() {
      return this.$store.getters.stocks;
    }
  }
}
</script>

<style>

</style>