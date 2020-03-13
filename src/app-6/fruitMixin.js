export const fruitMixin = {
  data() {
    return {
      filterFruit: '',
      fruits: ['apple', 'banana', 'mango', 'melon']
    };
  },
  computed: {
    filteredFruits() {
      return this.fruits.filter(fruit => fruit.match(this.filterFruit));
    }
  },
  created() {
    console.log('Created ', this)
  },
}