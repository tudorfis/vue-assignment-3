<template>
  <div>
    <app-stock 
      v-for="stock of stocks"
      :stock="stock"
    ></app-stock>
  </div>
</template>

<script>
import PortfolioStockVue from './PortfolioStock.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    appStock: PortfolioStockVue
  },
  computed: {
    ...mapGetters({
      stocks: 'stockPortfolio'
    })
  },
  mounted() {
    console.log(this.stocks)
  }
}
</script>

<style>

</style>