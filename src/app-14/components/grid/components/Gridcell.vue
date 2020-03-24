<template>
  <div
    ref="gridcell"
    class="gridcell"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    :style="{...dimensionsStyle}"
  >
    <small class="position-info">{{ position }}</small>
    <krt-gridcell-element
      ref="gridcellelement" 
      v-if="hasElement"
      @mountedElement="onMountGridcellElement"
      :element="gridElement"
      :type="gridElementType"
    >
    </krt-gridcell-element>
  </div>
</template>

<script>
import { gridCellService } from '../services/gridcell.service';
import GridcellElementVue from './GridcellElement.vue';
import { dragElementsService } from '../../../services/dragElements.service';
import { VueUtils } from '../../../utils/vue.utils';
import { globalConfig } from '../../../config/global.config';
export default {
  components: {
    krtGridcellElement: GridcellElementVue
  },
  props: ['width', 'height', 'index', 'total', 'cols', 'rows'],
  data() {
    return {
      hasElement: false,
      gridElement: null,
      gridElementType: '',
      letters: globalConfig.alphabet
    };
  },
  computed: {
    allowDrop() {
      return !this.hasElement
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
      const sameElement = dragElementsService.isSameElement(this.gridElement)
      if (sameElement) return;

      gridCellService.removeClasses(['allowed-drop', 'not-allowed-drop']);

      if (this.allowDrop) {
        this.hasElement = true
        this.gridElementType = dragElementsService.activeDragElementType
        /** we also have here a mount to 
         * store gridElement & removePrevious one from GridcellElement.vue 
         * */
      }
    },
    onDragover(event) {
      const sameElement = dragElementsService.isSameElement(this.gridElement)
      if (sameElement) return;

      /** operations for current cell */
      const gridCell = this.$refs.gridcell
      gridCell.classList.add(`${!this.allowDrop ? 'not-' : ''}allowed-drop`);
      
      /** operations when changing cell */
      if (gridCellService.isDifferentCell(gridCell)) 
        gridCellService.previousCellOperations()

      gridCellService.saveActiveCell(gridCell)
    },
    onMountGridcellElement(gridElement) {
      this.gridElement = gridElement

      /** if the same block has been moved, to delete it from the previous cell */
      if (dragElementsService.insideCell) {
        const dragElement = dragElementsService.previousDragElement
        const gridCellElement = VueUtils.traverseParent(dragElement.__vue__, 'gridcell')

        gridCellService.resetCell(gridCellElement)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.gridcell {
  position: relative;
  border: 1px dashed #e0e0e0;
  margin: -1px 0 0 -1px;
  color: #eee;
  z-index: 0;

  .position-info {
    position: absolute;
    top: 0;
    left: 0;
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
    margin: -2px 0 0 -2px !important;
  }
}
</style>