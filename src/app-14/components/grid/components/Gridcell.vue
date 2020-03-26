<template>
  <div
    ref="gridcell"
    class="gridcell"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    :style="gridCellStyle"
  >
    <small class="position-info">{{ position }}</small>
    <krt-gridcell-element
      ref="gridcellelement"
      v-show="cell.hasElement"
      :type="cell.gridElementType"
    ></krt-gridcell-element>
      <!-- @mountedElement="onMountGridcellElement" -->
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
  props: ['width', 'height', 'position', 'cell'],
  data() {
    return {
      hasElement: this.cell.hasElement,
      gridElement: this.cell.gridElement,
      gridElementType: this.cell.gridElementType
    };
  },
  computed: {
    allowDrop() {
      return !this.cell.hasElement;
    },
    gridCellStyle() {
      const borderSize = globalConfig.gridCellBorderSize;
      const borderColor = globalConfig.gridCellBorderColor;
      const borderStyle = globalConfig.gridCellBorderStyle;
      // const marginBorder = !borderSize ? '0' : `-${borderSize}`

      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        border: `${borderSize}px ${borderStyle} ${borderColor}`
        // margin: `${marginBorder}px 0 0 ${marginBorder}px`
      };
    }
  },
  methods: {
    onDrop(event) {
      const sameElement = dragElementsService.isSameElement(event.target);
      if (sameElement) return;

      gridCellService.removeClasses(['allowed-drop', 'not-allowed-drop']);

      if (this.allowDrop) {
        this.cell.hasElement = true;
        this.cell.gridElementType = dragElementsService.activeDragElementType;

        if (dragElementsService.insideCell) {
          const dragElement = dragElementsService.previousDragElement;
          const gridCellElement = VueUtils.traverseByRef(dragElement.__vue__, 'gridcell');

          gridCellService.resetCell(gridCellElement);
        }
      }
    },
    onDragover(event) {
      const sameElement = dragElementsService.isSameElement(event.target);
      if (sameElement) return;

      /** operations for current cell */
      const gridCell = this.$refs.gridcell;
      gridCell.classList.add(`${!this.allowDrop ? 'not-' : ''}allowed-drop`);

      /** operations when changing cell */
      if (gridCellService.isDifferentCell(gridCell))
        gridCellService.previousCellOperations();

      gridCellService.saveActiveCell(gridCell);
    }
  }
};
</script>

<style lang="scss" scoped>
.gridcell {
  position: relative;

  color: #eee;
  z-index: 0;

  .position-info {
    position: absolute;
    top: 0;
    left: 0;
  }

  &.allowed-drop {
    background-color: #ccffcc;
    border: 5px dashed lime !important;
    z-index: 1 !important;
  }
  &.not-allowed-drop {
    background-color: #ffd1d1;
    border: 5px dashed red !important;
    z-index: 1 !important;
  }
}
</style>