<template>
  <div
    ref="gridcell"
    class="gridcell"
    @dragstart="stopDragEmptyCell"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @mouseenter="showGridArrow"
    @mouseleave="hideGridArrow"
  >
    <krt-gridcell-droppoints
      v-if="showDroppoints"
      :display="droppointsDisplay"
    ></krt-gridcell-droppoints>
    <small class="position-info">{{ position }}</small>
    <krt-gridcell-element
      ref="gridcellelement"
      v-show="cell.is"
      :position="position"
      :type="cell.type"
    ></krt-gridcell-element>
  </div>
</template>

<script>

import { globalConfig } from '../../../config/global.config';
import GridcellElementVue from './GridcellElement.vue';
import GridcellDropPointsVue from './control-components/GridcellDropPoints.vue';
import gridcellDragDropMixin from '../mixins/gridcell-mixins/gridcellDragDrop.mixin'
import gridcellDroppointsMixin from '../mixins/gridcell-mixins/gridcellDroppoints.mixin'
import { gridArrowService } from '../services/gridArrow.service';

export default {
  mixins: [
    gridcellDragDropMixin,
    gridcellDroppointsMixin
  ],
  components: {
    krtGridcellElement: GridcellElementVue,
    krtGridcellDroppoints: GridcellDropPointsVue
  },
  methods: {
    stopDragEmptyCell(event) {
      if (!event.target.classList.contains('gridtool'))
        event.preventDefault()
    },
    showGridArrow(event) {
      gridArrowService.prototype = this
      return gridArrowService.init(event)
    },
    hideGridArrow() {
      gridArrowService.prototype = this
      return gridArrowService.destroy()
    }
  }
};
</script>

<style lang="scss" scoped>
.gridcell {
  position: relative;
  color: #eee;
  z-index: 0;
  border: 1px dashed #e0e0e0;

  .position-info {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 14px;
    user-select: none;
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