<template>
  <div
    ref="gridcell"
    class="gridcell"
    :class="gridCellClass"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
  >
    <krt-gridcell-droppoints
      v-if="showDroppoints"
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
  computed: {
    showDroppoints() {
      const droppointsKeys = Object.keys(this.droppointsDisplay)
      for (const key of droppointsKeys) {
        if (this.droppointsDisplay[key])
          return true
      }

      return false
    },
    gridCellClass() {
      return {
        [`zoom-${globalConfig.zoomLevel}`]: true
      }
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

  &.zoom-50 {
    width: 120px;
    height: 120px;
  }
  &.zoom-75 {
    width: 180px;
    height: 180px;
  }
  &.zoom-100 {
    width: 240px;
    height: 240px;
  }
  &.zoom-125 {
    width: 300px;
    height: 300px;
  }
  &.zoom-150 {
    width: 360px;
    height: 360px;
  }

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