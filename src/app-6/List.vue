<template>
  <div>
    <input v-model="filterFruit" />
    <ul>
      <li v-for="fruit of filteredFruits">{{ fruit }}</li>
    </ul>
  </div>
</template>

<script>
import { fruitMixin } from './fruitMixin'
export default {
  mixins: [fruitMixin]
};
</script>

<style>
</style>