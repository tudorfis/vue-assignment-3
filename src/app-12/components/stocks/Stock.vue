<template>
  <div class="col-sm-12 col-md-6">
    <div class="panel panel-success">
      <div class="panel-heading">
        <h3 class="panel-title">
          {{ stock.name }}
          <small>
            {{ `( Price: $${stock.price} )` }}
            {{ !isBuyDisabled ? `Total Buying Price: $${total}` : '' }}
            {{ insufficientFunds ? `- Insufficient Funds -` : '' }}
          </small>
        </h3>
      </div>
      <div class="panel-body">
        <div class="pull-left">
          <input 
            type="number"
            class="form-control"
            :class="{danger: isBuyDisabled && quantity > 0}"
            placeholder="Quantity"
            v-model.number="quantity"
          >
        </div>
        <div class="pull-right">
          <button 
            class="btn btn-success"
            @click="buyStock"
            :disabled="isBuyDisabled"
          >{{ insufficientFunds ? 'Insufficient Funds' : 'Buy' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['stock'],
  data() {
    return {
      quantity: 0
    };
  },
  computed: {
    funds() {
      return this.$store.getters.funds
    },
    total() {
      return this.quantity * this.stock.price
    },
    isBuyDisabled() {
      return this.insufficientFunds || this.quantity <= 0
    },
    insufficientFunds() {
      return this.total > this.funds
    }
  },
  methods: {
    buyStock() {
      const order = {
        stockId: this.stock.id,
        stockName: this.stock.name,
        stockPrice: this.stock.price,
        quantity: this.quantity
      }
      this.$store.dispatch('buyStock', order)
      this.quantity = 0
    },
  }
};
</script>

<style scoped>
  .danger {
    border: 2px solid red;
  }
</style>