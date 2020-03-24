<template>
  <div
    ref="gridcell"
    class="gridcell"
    @drop.prevent="onDrop"
    @dragover.prevent="onAllowDrop"
    :style="{...dimensionsStyle}"
  >{{ position }}</div>
</template>

<script>
import { gridCellService } from '../services/gridcell.service';
export default {
  props: ['width', 'height', 'index', 'total', 'cols', 'rows'],
  data() {
    return {
      hasElement: false,
      letters: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'Y',
        'Z'
      ]
    };
  },
  computed: {
    allowDrop() {
      /** @TODO - figure out if element is here or link */
      // return Math.round(Math.random());
      return !this.hasElement;
    },
    dimensionsStyle() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      };
    },
    position() {
      const letter = this.letters[Math.ceil(this.index / this.cols) - 1];
      const number = this.index % this.cols || this.cols;

      return `${letter}${number}`;
    }
  },
  methods: {
    onDrop(event) {
      gridCellService.removeClasses(['allowed-drop', 'not-allowed-drop']);

      if (this.allowDrop) {
        gridCellService.addClasses(['hurray']);
        this.hasElement = true;
      }
      
      console.log('drop() in cell', event);
    },
    onAllowDrop(event) {
      const vm = this;

      const newClass = this.allowDrop ? 'allowed-drop' : 'not-allowed-drop';
      this.$refs.gridcell.classList.add(newClass);

      const cell = this.$refs.gridcell;
      const uid = cell.__vue__._uid;

      if (uid !== gridCellService.activeUid)
        gridCellService.removeClasses(['allowed-drop', 'not-allowed-drop']);

      gridCellService.activeCell = cell;
      gridCellService.activeUid = uid;
    }
  },
  mounted() {
    window.vm = this;
  }
};
</script>

<style lang="scss" scoped>
.gridcell {
  border: 1px dashed #e0e0e0;
  margin: -1px 0 0 -1px;
  color: #eee;
  z-index: 0;

  &.hurray {
    background: gray;
  }
  &.allowed-drop {
    background-color: #ccffcc;
    border: 3px dashed lime !important;
    z-index: 1 !important;
    margin: -2px 0 0 -2px !important;
  }
  &.not-allowed-drop {
    background-color: #ffd1d1;
    border: 3px dashed red !important;
    z-index: 1 !important;
    margin: -3px 0 0 -3px !important;
  }
}
</style>