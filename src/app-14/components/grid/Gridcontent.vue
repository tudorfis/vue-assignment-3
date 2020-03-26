<template>
  <div class="gridcontent" @mouseover="resetGridView">
    <krt-gridcontent-controls></krt-gridcontent-controls>
    <svg
      id="svgGrid"
      :style="svgStyle"
      :viewBox="svgViewBox"
    >
      <!--
        <path :fill="strokeColor" d="M100 100 h15 l-15 -20 l-15 20 Z" class="top-arrow"  />
        <path :fill="strokeColor" d="M100 110 h15 l-15 20 l-15 -20 Z" class="down-arrow"  />
        <path :fill="strokeColor" d="M40 50 v-20 l-20 15 l20 15 Z" class="left-arrow" />
        <path :fill="strokeColor" d="M50 50 v-20 l20 15 l-20 15 Z" class="right-arrow" />

        <path :fill="globalConfig.arrowColor" d="M110 30 H140 L125 50 Z"  />
        <path :fill="globalConfig.arrowColor" d="M124 32 h15 l-15 20 l-15 -20 Z"  />
        <path :stroke="globalConfig.arrowColor" :stroke-width="globalConfig.arrowWidth" d="M124 32 v-26 h119 v345 h30" fill="none"></path>
        <path :fill="globalConfig.arrowColor" d="M270 335 v30 L290 350 Z"></path>
        <path :stroke="globalConfig.arrowColor" :stroke-width="globalConfig.arrowWidth" d="M440 350 H750"></path>
        <path :fill="globalConfig.arrowColor" d="M750 335 v30 l20 -15 Z"></path>
      -->
    </svg>
    <div class="gridlayout" :style="gridLayoutStyle">
      <krt-gridcell
        v-for="n of gridSize"
        :cell="gridModel.getCell(n)"
        :position="gridModel.getPosition(n)"
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
import { gridModel } from '../../models/grid.model'
import gridcontentMixin from './mixins/gridcontentStyles'
import GridcontentControlsVue from './components/GridcontentControls.vue';
export default {
  mixins: [mousemoveMixin, gridcontentMixin],
  props: ['toolboxWidth', 'topmenuHeight'],
  components: {
    krtGridcell: GridcellVue,
    krtGridcontentControls: GridcontentControlsVue
  },
  data() {
    return {
      globalConfig,
      gridModel
    };
  },
  computed: {
    gridSize: _ => gridModel.model.numCols * gridModel.model.numRows
  }
};
</script>

<style lang="scss" scoped>
.gridcontent {
  svg {
    position: absolute;
    border: 2px solid #000;
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