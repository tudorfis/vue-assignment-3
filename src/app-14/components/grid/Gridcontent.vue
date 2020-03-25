<template>
  <div class="gridcontent" @mouseover="resetGridView">

    <svg
      id="svgGrid"
      :style="{width: `${(gridCellWidth * gridColumns) + 5}px`, height: `${(gridCellHeight * gridRows) + 5}px`}"
      :viewBox="`0 0 ${gridCellWidth * gridColumns} ${gridCellHeight * gridRows}`"
    >
      <path stroke="#ccc" stroke-width="10" d="M125 30 V0" fill="none"></path>
      <path fill="#ccc" stroke="#000" stroke-width="0" d="M110 30 H140 L125 50 Z"  />

      <path stroke="#ccc" stroke-width="10" d="M125 5 H240" fill="none"></path>
      <path stroke="#ccc" stroke-width="10" d="M244.5 0 V355" fill="none"></path>
      <path stroke="#ccc" stroke-width="10" d="M245 350 H270" fill="none"></path>
      <path fill="#ccc" stroke="#000" stroke-width="0" d="M270 335 V365 L290 350 Z"></path>

      <path stroke="#ccc" stroke-width="10" d="M440 350 H750" fill="none"></path>
      <path fill="#ccc" stroke="#000" stroke-width="0" d="M750 335 V365 L770 350 Z"></path>
    </svg>

    <div class="gridlayout" :style="gridStyle">
      <krt-gridcell
        v-for="gridCellIndex in gridSize"
        :index="gridCellIndex"
        :total="gridSize"
        :cols="gridColumns"
        :rows="gridRows"
        :width="gridCellHeight"
        :height="gridCellWidth"
      ></krt-gridcell>
    </div>
  </div>
</template>

<script>
import { globalConfig } from '../../config/global.config'
import GridcellVue from './components/Gridcell.vue';
import mousemoveMixin from '../../mixins/mousemove.mixin';
export default {
  mixins: [mousemoveMixin],
  props: ['toolboxWidth', 'topmenuHeight'],
  components: {
    krtGridcell: GridcellVue
  },
  data() {
    return {
      gridCellHeight: globalConfig.gridCellHeight,
      gridCellWidth: globalConfig.gridCellWidth,
      gridColumns: globalConfig.gridColumns,
      gridRows: globalConfig.gridRows
    };
  },
  computed: {
    gridStyle() {
      return {
        'grid-template-columns': `repeat(${this.gridColumns}, 1fr)`,
        'grid-template-rows': `repeat(${this.gridRows}, 1fr)`
      };
    },
    gridSize() {
      return this.gridColumns * this.gridRows;
    }
  }
};
</script>

<style lang="scss" scoped>
.gridcontent {
  svg {
    position: absolute;
    border:2px solid #000;
    left: 222px;
    z-index: 0;
    top: 83px;

    path {
      z-index: 2;
    }
  }

  overflow: auto;
  padding: 30px;

  .gridlayout {
    display: grid;

    position: absolute;
    top: 90px;
    left: 230px;
    z-index: 1;
  }
}
</style>