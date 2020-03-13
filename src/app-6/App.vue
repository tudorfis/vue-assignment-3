<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <h1>Filter & Mixins</h1>
        <p>{{ text | toUppercase | to-lowercase }}</p>
        <p>{{ '27.oct.1989' | date }}</p>
        <hr />
        <input v-model="filterFruit" />
        <ul>
          <li v-for="fruit of filteredFruits">{{ fruit }}</li>
        </ul>
        <hr />
        <app-list></app-list>
      </div>
    </div>
  </div>
</template>

<script>
import ListVue from './List.vue';
import { fruitMixin } from './fruitMixin'
export default {
  data() {
    return {
      text: 'Hello there!',
    };
  },
  filters: {
    date(value) {
      return new Date(value).toString().slice(0, 16);
    },
    toUppercase(value) {
      return value.toUpperCase();
    }
  },
  components: {
    appList: ListVue
  },
  mixins: [fruitMixin],
  created() {
    console.log('component rules', this)
  },
};
</script>

<style>
</style>