<template>
  <div 
    class="gridcontent"
    @mousemove="drawPath"
    @mouseover="resetGridView"
    @mouseup="stopArrowDrag"
  >
    <!-- @TODO: remove controls, used only for testing purposes
        add top menu controls, such as zoom in, zoom out etc -->
    <krt-gridcontent-controls></krt-gridcontent-controls>
    <svg
      id="svgGrid"
      :style="svgStyle"
      :viewBox="zoomService.svgViewBox"
    >
      <path 
        v-for="(arrow, arrowIndex) of pathObj"
        :key="arrowIndex"
        :linkKey="arrow.linkKey"
        :d="arrow.d" 
        :fill="arrow.a ? (arrow.color || globalConfig.arrowColor) : 'none'"
        :stroke="!arrow.a ? (arrow.color ||globalConfig.arrowColor) : ''"
        :stroke-width="!arrow.a ? globalConfig.arrowWidth : 0" />
    </svg>
    <div 
      class="gridlayout"
      :class="gridLayoutClass"
      :style="gridLayoutStyle"
      @mousemove="findSvgPath"
    >
      <krt-gridcell
        v-for="(cell,position) of gridObj"
        :cell="cell"
        :key="position"
        :position="position"
      ></krt-gridcell>
    </div>
    <krt-grid-arrow-connector></krt-grid-arrow-connector>
    <krt-grid-arrow-delete></krt-grid-arrow-delete>
  </div>
</template>

<script>
import { globalConfig } from '../../config/global.config'
import GridcellVue from './components/Gridcell.vue';
import mousemoveMixin from '../../mixins/mousemove.mixin';
import { gridModel } from '../../models/grid/grid.model'
import gridcontentMixin from './mixins/gridcontentStyles.mixin'
import GridcontentControlsVue from './components/control-components/GridcontentControls.vue';
import GridArrowConnectorVue from './components/control-components/GridArrowConnector.vue';
import { zoomService } from '../../services/zoom.service'
import { Utils } from '../../utils/utils';
import { gridArrowService } from '../grid/services/gridArrow.service'
import { VueUtils } from '../../utils/vue.utils';
import GridArrowDeleteVue from './components/control-components/GridArrowDelete.vue';
import { gridDeleteService } from './services/gridDelete.service'

export default {
  mixins: [mousemoveMixin, gridcontentMixin],
  props: ['toolboxWidth', 'topmenuHeight'],
  components: {
    krtGridcell: GridcellVue,
    krtGridcontentControls: GridcontentControlsVue,
    krtGridArrowConnector: GridArrowConnectorVue,
    krtGridArrowDelete: GridArrowDeleteVue
  },
  data() {
    return {
      globalConfig,
      gridModel,
      zoomService,
      
    };
  },
  methods: {
    drawPath() {
      gridArrowService.prototype = this
      return gridArrowService.drawPath()
    },
    findSvgPath(event) {
      gridDeleteService.findSvgPath(event, 1)
    }
  },
  mounted() {
      gridDeleteService.svgEl = document.querySelector('#svgGrid')
      gridDeleteService.gridlayoutEl = document.querySelector('.gridlayout')
  },
  computed: {
    gridObj() {
      return gridModel.buildGridCells('get')
    },
    pathObj() {
      return Utils.reduceobj(gridModel.paths)
    }
  }
};
</script>

<style lang="scss">
@import "./styles/zoom.scss";

.gridcontent {
  svg {
    position: absolute;
    z-index: 1;
    path {
      z-index: 3;
    }
  }
  .gridlayout {
    display: grid;
    position: absolute;
    z-index: 2;
  }
}
</style>