<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
        <h1>Built in directives</h1>
        <p v-text="'you!'"></p>
        <p v-html="'<strong>you!</strong>'"></p>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
        <h1>Custom directive</h1>
        <p v-blink:background.delayed.fast="{firstColor: '#7fc8f6',secondColor: '#7cff86'}">color this</p>
        <p v-blink:background.delayed.fast="'#7fc8f6'">color this</p>
        <p v-blink:color.delayed.fast="'#7cff86'">color this</p>
        <p v-blink:color.delayed="'#7fc8f6'">color this</p>
        <p v-blink:background="'#7cff86'">color this</p>
        <p v-blink:color="'#7cff86'">color this</p>
      </div>
    </div>
  </div>
</template>

<script>
import BlinkDirective from './directives/blink/BlinkDirective.vue';
export default {
  directives: {
    blink: BlinkDirective
  }
};
</script>

<style scoped>
p {
  width: 100px;
  text-align: center;
  font-weight: bold;
}
</style>