<template>
  <div class="row">
    <div class="col-sm-12">
      <h3>Quotes Added</h3>
      <div class="progress">
        <div class="progress">
          <div
            class="progress-bar"
            role="progressbar"
            :style="{width: progressBarWidth}"
          >{{ quotesAdded }} / {{ quotesMax }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    quotesAdded: {
      type: Number,
      required: true
    },
    quotesMax: {
      type: Number,
      required: true
    }
  },
  computed: {
    progressBarWidth() {
      return `${(this.quotesAdded / this.quotesMax) * 100}%`
    }
  }
};
</script>

<style>
</style>