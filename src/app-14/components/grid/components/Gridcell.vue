<template>
  <div
    ref="gridcell"
    class="gridcell"
    position="position"
    @dragstart="stopDragEmptyCell"
    @drop.prevent="onDropGridCellElement"
    @dragover.prevent="onDragoverGridCellElement"
    @mouseenter="doGridArrowOperations"
  >
    <krt-gridcell-droppoints
      v-if="showDroppoints"
      :display="droppointsDisplay"
    ></krt-gridcell-droppoints>
    <small class="position-info">{{ position }}</small>
    <krt-gridcell-element
      ref="gridcellelement"
      v-show="cellIs"
      :position="position"
      :type="cellType"
    ></krt-gridcell-element>
  </div>
</template>

<script>
import GridcellElementVue from './GridcellElement.vue';
import GridcellDropPointsVue from './control-components/GridcellDropPoints.vue';
import gridcellDragDropMixin from '../mixins/gridcellDragDrop.mixin'
import { gridArrowConnectorService } from '../services/gridArrowConnector.service';
import { gridModel } from '../../../models/grid/grid.model';

export default {
  mixins: [gridcellDragDropMixin],
  data() {
    return {
      gm: gridModel
    }
  },
  components: {
    krtGridcellElement: GridcellElementVue,
    krtGridcellDroppoints: GridcellDropPointsVue
  },
  methods: {
    stopDragEmptyCell(event) {
      if (!event.target.classList.contains('gridtool'))
        event.preventDefault()
    },
    doGridArrowOperations() {
      gridArrowConnectorService.doGridcellOperations(this.position)
    }
  },
  computed: {
    showDroppoints() {
        for (const key of Object.keys(this.droppointsDisplay))
            if (this.droppointsDisplay[key]) return true

        return false
    },
    cellType() {
      const cell = gridModel.model.cells[this.position]
      if (!!cell) return cell.type

      return ''
    },
    cellIs() {
        const cell = gridModel.model.cells[this.position]
        if (!!cell) return cell.is

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