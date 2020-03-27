<template>
  <div
    ref="gridcell"
    class="gridcell"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    :style="gridCellStyle"
  >
    <krt-gridcell-droppoints
      :display="droppointsDisplay"
    ></krt-gridcell-droppoints>
    <small class="position-info">{{ position }}</small>
    <krt-gridcell-element
      ref="gridcellelement"
      v-show="cell.hasElement"
      :type="cell.gridElementType"
    ></krt-gridcell-element>
  </div>
</template>

<script>

import { globalConfig } from '../../../config/global.config';
import GridcellElementVue from './GridcellElement.vue';
import GridcellDropPointsVue from './GridcellDropPoints.vue';
import gridcellDragDropMixin from '../mixins/gridcellDragDrop.mixin'

export default {
  mixins: [gridcellDragDropMixin],
  components: {
    krtGridcellElement: GridcellElementVue,
    krtGridcellDroppoints: GridcellDropPointsVue
  },
  props: ['width', 'height'],
  computed: {
    gridCellStyle() {
      const borderSize = globalConfig.gridCellBorderSize;
      const borderColor = globalConfig.gridCellBorderColor;
      const borderStyle = globalConfig.gridCellBorderStyle;

      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        border: `${borderSize}px ${borderStyle} ${borderColor}`
      };
    }
  },
  
};
</script>

<style lang="scss" scoped>
.gridcell {
  position: relative;

  color: #eee;
  z-index: 0;

  .position-info {
    font-size: 20px;
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