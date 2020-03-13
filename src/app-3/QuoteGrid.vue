<template>
  <div class="row">
    <app-quote 
      v-for="(quote, index) in quotes"
      @click.native="onDeleteQuote(index)"
    >{{ quote }}</app-quote>
  </div>
</template>

<script>
import QuoteVue from './Quote.vue';

export default {
  props: ['quotes'],
  components: {
    appQuote: QuoteVue
  },
  methods: {
    onDeleteQuote(index) {
      this.$emit('quoteDeleted', index)
    }
  }
};
</script>

<style>
</style>