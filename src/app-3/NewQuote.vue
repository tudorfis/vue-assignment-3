<template>
  <form>
    <div class="row">
      <div class="col-sm-8 col-sm-offset-2 col-xs-12 col-md-6 col-md-offset-3">
        <label>Add a New Quote</label>
        <textarea class="form-control" rows="3" v-model="quote"></textarea>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-8 col-sm-offset-2 col-xs-12 col-md-6 col-md-offset-3">
        <button class="btn btn-primary" @click.prevent="createNew">Add +</button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      quote: ''
    };
  },
  methods: {
    createNew() {
      this.$emit('quoteAdded', this.quote);
      this.quote = '';
    }
  }
};
</script>

<style scoped>
form {
  margin: 20px 10px;
}
.btn {
  float: right;
  margin: 10px 0;
}
</style>