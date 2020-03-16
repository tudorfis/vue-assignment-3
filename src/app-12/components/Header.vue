<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <a href class="navbar-brand" @click.prevent="changeRoute(Routes.HOME)">Stock Trader</a>
      </div>
      <div class="collapse navbar-collapse">
        <ul class="nav navbar-nav navbar-left">
          <li :class="{active: route === Routes.PORTFOLIO }">
            <a href @click.prevent="changeRoute(Routes.PORTFOLIO)">Portfolio</a>
          </li>
          <li :class="{active: route === Routes.STOCKS }">
            <a href @click.prevent="changeRoute(Routes.STOCKS)">Stocks</a>
          </li>
        </ul>
        <strong class="navbar-text navbar-right">Funds: {{ funds | currency }}</strong>
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a href @click.prevent="endDay">End Day</a>
          </li>
          <li>
            <a href @click.prevent>Save Data</a>
          </li>
          <li>
            <a href @click.prevent>Load Data</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import Routes from '../routes/base.routes';
import { mapActions } from 'vuex';
export default {
  props: ['route'],
  data() {
    return {
      Routes
    };
  },
  methods: {
    ...mapActions([
      'randomizeStocks'
    ]),
    changeRoute(route) {
      this.$emit('changeRoute', route);
    },
    endDay() {
      this.randomizeStocks()
    }
  },
  computed: {
    funds() {
      return this.$store.getters.funds;
    }
  }
};
</script>

<style lang="scss" scoped>
.active {
  background: #888;
}
</style>