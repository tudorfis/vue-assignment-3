<template>
  <div class="container">
      <app-header
        :quotesAdded="quotes.length"
        :quotesMax="maxQuotes"
      ></app-header>
      <app-new-quote 
        @quoteAdded="newQuote"
      ></app-new-quote>
      <app-quote-grid 
        :quotes="quotes"
        @quoteDeleted="deleteQuote"
      ></app-quote-grid>
      <div class="row">
          <div class="col-sm-12 text-center">
              <div class="alert alert-info">*Click on a quote to delete it</div>
          </div>
      </div>
  </div>
</template>

<script>
import QuoteGridVue from './QuoteGrid.vue';
import NewQuoteVue from './NewQuote.vue';
import HeaderVue from './Header.vue';
export default {
  data() {
    return {
      quotes: ['Just a quote to see something'],
      maxQuotes: 10
    };
  },
  components: {
    appHeader: HeaderVue,
    appNewQuote: NewQuoteVue,
    appQuoteGrid: QuoteGridVue
  },
  methods: {
      newQuote(quote) {
          if (this.quotes.length >= this.maxQuotes) {
              return alert('Please delete quotes first')
          }
          this.quotes.push(quote)
      },
      deleteQuote(index) {
          this.quotes.splice(index, 1)
      }
  }
};
</script>

<style>
</style>
