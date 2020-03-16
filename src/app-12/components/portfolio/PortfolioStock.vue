<template>
  <div class="col-sm-12 col-md-6">
    <div class="panel panel-info">
      <div class="panel-heading">
        <h3 class="panel-title">
          {{ stock.name }}
          <small>
            {{ `( Price: $${stock.price} | Quantity: ${stock.quantity} )` }}
            {{ !isSellDisabled ? `Total Selling Price: $${total}` : '' }}
            {{ insufficientStocks ? `- Insufficient Stocks -` : '' }}
          </small>
        </h3>
      </div>
      <div class="panel-body">
        <div class="pull-left">
          <input 
            type="number"
            class="form-control"
            placeholder="Quantity"
            :class="{danger: isSellDisabled && quantity > 0}"
            v-model.number="quantity"
          >
        </div>
        <div class="pull-right">
          <button 
            class="btn btn-info"
            @click="sellStock"
            :disabled="isSellDisabled"
          >{{ insufficientStocks ? 'Not enough Stocks' : 'Sell' }}</button>
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
    }
  },
  computed:  {
    funds() {
      return this.$store.getters.funds
    },
    total() {
      return this.quantity * this.stock.price
    },
    insufficientStocks() {
      return this.quantity > this.stock.quantity
    },
    isSellDisabled() {
      return this.insufficientStocks || this.quantity <= 0
    }
  },
  methods: {
    sellStock() {
      const order = {
        stockId: this.stock.id,
        stockPrice: this.stock.price,
        quantity: this.quantity
      }
      this.$store.dispatch('sellStock', order)
      this.quantity = 0
    }
  }
};
</script>

<style scoped>
  .danger {
    border: 2px solid red;
  }
</style>