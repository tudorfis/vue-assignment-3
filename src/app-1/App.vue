<template>
  <div class="container">
    <div class="col-xs-12">
      <button @click="selectedComponent = 'appQuote'">Quote</button>
      <button @click="selectedComponent = 'appAuthor'">Author</button>
      <button @click="selectedComponent = 'appNew'">New</button>

      <p>{{ selectedComponent }}</p>
      <keep-alive>
        <component :is="selectedComponent">
          <p>Default content</p>
        </component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Quote from './components/Quote.vue';
import Author from './components/Author.vue';
import New from './components/New.vue';

export default {
  data() {
    return {
      quoteTitle: 'The Quote',
      selectedComponent: 'appQuote'
    };
  },
  components: {
    appQuote: Quote,
    appAuthor: Author,
    appNew: New
  }
};
</script>

<style>
</style>
