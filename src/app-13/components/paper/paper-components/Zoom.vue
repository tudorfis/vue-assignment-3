<template>
  <div class="zoom">
    <h4>Zoom</h4>
    <div class="controls">
      <button @click="zoomOut" class="btn" :disabled="zoomLevel === 0.25">
        <i class="fas fa-search-minus"></i>
      </button>
      <button @click="zoomIn" class="btn" :disabled="zoomLevel === 2">
        <i class="fas fa-search-plus"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['paper'],
  data() {
      return {
          zoomLevel: 1
      }
  },
  methods: {
    zoomIn() {
      this.zoomLevel += 0.25;
      this.paper.scale(this.zoomLevel, this.zoomLevel);
    },
    zoomOut() {
      this.zoomLevel -= 0.25;
      this.paper.scale(this.zoomLevel, this.zoomLevel);
    }
  }
};
</script>

<style>
</style>