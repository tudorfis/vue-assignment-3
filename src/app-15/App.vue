<template>
  <div>
    <div class="container" style="display: none;">
      <div class="row">
        <h3>Have Fun With The Controls</h3>
      </div>
    </div>
    <svg :viewBox="`0 0 ${size} ${size}`" :style="{border: `${lineWidth}px solid ${strokeColor}`}">
      <path
        :stroke="strokeColor"
        :stroke-width="lineWidth"
        v-for="n of totalLines"
        :d="`M${n * gridSize} 0 V${size}`"
      />
      <path
        :stroke="strokeColor"
        :stroke-width="lineWidth"
        v-for="n of totalLines"
        :d="`M0 ${n * gridSize} H${size}`"
      />

      <path stroke="red" stroke-width="0.7" d="M27.5 15 H30" fill="none"></path>
      <path stroke="red" stroke-width="0.7" d="M30 15 V20" fill="none"></path>
      <path stroke="red" stroke-width="0.7" d="M30 20 H40" fill="none"></path>
      <path stroke="red" stroke-width="0.7" d="M40 20 V25" fill="none"></path>
      <path stroke="red" stroke-width="0.7" d="M40 25 H42.5" fill="none"></path>
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      size: 100,
      gridSize: 10,
      strokeColor: 'green',
      visualColors: ['#000', '#222', '#333', '#666']
    };
  },
  computed: {
    lineWidth() {
      return (this.size / 500).toFixed(2);
    },
    totalLines() {
      const totalLines = Math.round(
        (this.size - this.gridSize) / this.gridSize
      );
      return totalLines < 0 ? 1 : totalLines;
    }
  },
  methods: {
    randomColor() {
      const length = this.visualColors.length - 1;
      let index = 0;

      for (let i = 1; i <= length; i++) index += Math.round(Math.random());

      return this.visualColors[index];
    },
    startRandomizingColors() {
      const vm = this;
      setInterval(function() {
        vm.size++;

        if (vm.size % 8 === 0) vm.strokeColor = vm.randomColor();

        if (vm.size % 400 === 0) vm.gridSize++;
      }, 20);
    }
  },
  mounted() {
      return
      this.startRandomizingColors()
  }
};
</script>

<style lang="scss" scoped>
.form-group {
  margin-right: 5px;
  width: 100px;
}
</style>