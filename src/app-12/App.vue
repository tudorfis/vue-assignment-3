<template>
  <div class="container">
    <app-header
      :route="route"
      @changeRoute="changeRoute"
    ></app-header>
    <div class="row">
      <div class="col-xs-12">
        <app-home v-if="route === Routes.HOME"></app-home>
        <app-portfolio v-else-if="route === Routes.PORTFOLIO"></app-portfolio>
        <app-stocks v-else-if="route === Routes.STOCKS"></app-stocks>
        <app-not-found v-else></app-not-found>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderVue from './components/Header.vue';
import PortfolioVue from './components/portfolio/Portfolio.vue';
import StocksVue from './components/stocks/Stocks.vue';
import NotFoundVue from './components/NotFound.vue';
import HomeVue from './components/Home.vue';
import Routes from './routes/base.routes';

export default {
  components: {
    appHome: HomeVue,
    appHeader: HeaderVue,
    appPortfolio: PortfolioVue,
    appStocks: StocksVue,
    appNotFound: NotFoundVue
  },
  data() {
    return {
      Routes,
      route: Routes.HOME
    };
  },
  methods: {
    changeRoute(route) {
      this.route = route;
    }
  },
  created() {
    this.$store.dispatch('initStocks')
  }
};
</script>

<style lang="scss" scoped>
</style>