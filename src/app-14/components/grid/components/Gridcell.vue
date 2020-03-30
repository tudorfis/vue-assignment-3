<template>
<!-- :class="gridCellClass" -->
  <div
    ref="gridcell"
    class="gridcell"
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