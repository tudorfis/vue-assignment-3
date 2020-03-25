<template>
  <div class="gridcontent" @mouseover="resetGridView">
    <svg
      id="svgGrid"
      :style="svgStyle"
      :viewBox="svgViewBox"
    >

      <!-- top arrow -->
      <path :fill="strokeColor" d="M100 100 h15 l-15 -20 l-15 20 Z"  />
      
      <!-- down arrow -->
      <path :fill="strokeColor" d="M100 110 h15 l-15 20 l-15 -20 Z"  />

      <!-- left arrow -->
      <path :fill="strokeColor" d="M40 50 v-20 l-20 15 l20 15 Z"  />

      <!-- right arrow -->
      <path :fill="strokeColor" d="M50 50 v-20 l20 15 l-20 15 Z"  />


      <!-- some lines drawed for fun -->
      <path :fill="strokeColor" d="M110 30 H140 L125 50 Z"  />
      <path :stroke="strokeColor" :stroke-width="strokeWidth" d="M125 30 v-25 h120 v345 h30" fill="none"></path>
      <path :fill="strokeColor" d="M270 335 v30 L290 350 Z"></path>

      <path :stroke="strokeColor" :stroke-width="strokeWidth" d="M440 350 H750"></path>
      <path :fill="strokeColor" d="M750 335 v30 l20 -15 Z"></path>

    </svg>
    <div class="gridlayout" :style="gridLayoutStyle">
      <krt-gridcell
        v-for="gridCellIndex in gridSize"
        :index="gridCellIndex"
        :total="gridSize"
        :cols="globalConfig.gridColumns"
        :rows="globalConfig.gridRows"
        :width="globalConfig.gridCellHeight"
        :height="globalConfig.gridCellWidth"
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
      globalConfig,
      strokeWidth: 10,
      strokeColor: '#ccc'
    };
  },
  computed: {
    svgStyle() {
      return {
        width: `${(globalConfig.gridCellWidth * globalConfig.gridColumns) + 4}px`,
        height: `${(globalConfig.gridCellHeight * globalConfig.gridRows) + 4}px`,
        left: `${globalConfig.toolboxWidth + 20 + 2}px`,
        top: `${globalConfig.topmenuHeight + 20 + 2}px`
      }
    },
    svgViewBox() {
      const width = globalConfig.gridCellWidth * globalConfig.gridColumns
      const height = globalConfig.gridCellHeight * globalConfig.gridRows
      
      return `0 0 ${width} ${height}`
    },
    gridLayoutStyle() {
      return {
        left: `${globalConfig.toolboxWidth + 20 + 2}px`,
        top: `${globalConfig.topmenuHeight + 20 + 10}px`,
        left: `${globalConfig.toolboxWidth + 20 + 10}px`,
        'grid-template-columns': `repeat(${globalConfig.gridColumns}, 1fr)`,
        'grid-template-rows': `repeat(${globalConfig.gridRows}, 1fr)`
      }
    },
    gridSize() {
      return globalConfig.gridColumns * globalConfig.gridRows;
    }
  }
};
</script>

<style lang="scss" scoped>
.gridcontent {
  svg {
    position: absolute;
    border:2px solid #000;
    z-index: 0;

    path {
      z-index: 2;
    }
  }

  overflow: auto;
  padding: 30px;

  .gridlayout {
    display: grid;
    position: absolute;
    z-index: 1;
  }
}
</style>