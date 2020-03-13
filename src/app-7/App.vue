<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <h3>Exercise Filters &amp; Mixins</h3>

        <!-- Exercise 1 -->
        <!-- Build a local Filter which reverses the Text it is applies on -->
        <div class="exercise-1">
          <input v-model="text1" />
          <p>{{ text1 | reverseText }}</p>
        </div>

        <!-- Exercise 2 -->
        <!-- Build a global Filter which counts the length of a word and it appends it -->
        <!-- Like this: "Test" => Gets Filtered to => "Test (4)" -->
        <div class="exercise-2">
          <input v-model="text2" />
          <p>{{ text2 | countAppendLength }}</p>
        </div>

        <!-- Exercise 3 -->
        <!-- Do the same as in Exercise 1 & 2, now with Computed Properties -->
        <div class="exercise-3">
          <div>
            <input v-model="text31" />
            <p>{{ reverseText31 }}</p>
          </div>
          <div>
            <input v-model="text32" />
            <p>{{ countAppendLengthText32 }}</p>
          </div>
        </div>

        <!-- Exercise 4 -->
        <!-- Share the Computed Property rebuilding Exercise 2 via a Mixin -->
        <!-- done -->
      </div>
    </div>
  </div>
</template>

<script>
import { textManipulationMixin } from './textManipulationMixin'
export default {
  mixins: [textManipulationMixin],
  data() {
    return {
      text1: '',
      text2: '',
    };
  },
  filters: {
    reverseText(value) {
      return value
        .split('')
        .reverse()
        .join('');
    }
  }
};
</script>

<style>
</style>