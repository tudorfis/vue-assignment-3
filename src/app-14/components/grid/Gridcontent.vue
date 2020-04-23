<template>
  <div 
    ref="gridcontent"
    class="gridcontent"
    :style="gridcontentStyle"
    @mouseover="grs.resetGridView()"
    @mouseup="grs.stopArrowDrag()"
    @mousemove="drawPath(); findSvgPath($event)"
  >
    <svg
      id="svgGrid"
      :style="gridSvgService.svgStyle"
      :viewBox="gridSvgService.svgViewBox"
    >
      <path 
        v-for="(svgPath, svgIndex) of svgPaths"
        :key="svgIndex"
        :linkKey="svgPath.linkKey"
        :d="svgPath.svgD" 
        :fill="svgPath.isArrow ? (svgPath.color || gc.arrowLineColor) : 'none'"
        :stroke="!svgPath.isArrow ? (svgPath.color ||gc.arrowLineColor) : ''"
        :stroke-width="!svgPath.isArrow ? gc.arrowLineWidth : 0" />
    </svg>
    <div 
      class="gridlayout"
      :class="gridLayoutClass"
      :style="gridLayoutStyle"
    >
      <krt-gridcell
        v-for="position of gridPositions"
        :key="position"
        :position="position"
      ></krt-gridcell>
    </div>
    <krt-grid-arrow-connector></krt-grid-arrow-connector>
    <krt-grid-arrow-delete></krt-grid-arrow-delete>
  </div>
</template>

<script>
import { globalConfig as gc } from '../../config/global.config'
import { gridModel } from '../../models/grid/grid.model'
import GridcellVue from './components/Gridcell.vue';
import GridArrowConnectorVue from './components/control-components/GridArrowConnector.vue';
import GridArrowDeleteVue from './components/control-components/GridArrowDelete.vue';
import { gridSvgService } from './services/gridSvg.service'
import { Utils } from '../../utils/utils';
import { gridArrowConnectorService } from '../grid/services/gridArrowConnector.service'
import { gridDeleteArrowService } from './services/gridDeleteArrow.service'
import { gridPanService } from './services/gridPan.service';
import { gridLinksService } from '../../models/grid/services/gridLinks.service';
import { globalResetsService } from '../../services/globalResets.service';
import { GridPositionIterator } from '../../models/grid/iterators/GridPositionIterator';

export default {
  props: ['toolboxWidth', 'topmenuHeight'],
  components: {
    krtGridcell: GridcellVue,
    krtGridArrowConnector: GridArrowConnectorVue,
    krtGridArrowDelete: GridArrowDeleteVue
  },
  data() {
    return {
      gc,
      gm: gridModel,
      gl: gridLinksService,
      grs: globalResetsService,
      gridSvgService
    };
  },
  methods: {
    drawPath() {
      gridArrowConnectorService.drawPath()
    },
    findSvgPath(event) {
      gridDeleteArrowService.findSvgPath(event)
    }
  },
  mounted() {
      gridDeleteArrowService.svgEl = document.querySelector('#svgGrid')
      gridDeleteArrowService.gridlayoutEl = document.querySelector('.gridlayout')
      gridPanService.init(this.$refs.gridcontent)
  },
  computed: {
    gridPositions() {
      if (!gridModel.model) return
      
      return GridPositionIterator.getPositionsMatrix()
    },
    svgPaths() {
      return Utils.reduceobj(gridLinksService.svgPaths)
    },
    gridcontentStyle() {
        return {
            height: `calc(100% - ${gc.topmenuHeight + 4}px)`,
            width: `calc(100% - ${gc.toolboxWidth + 7}px)`,
            left: `${gc.toolboxWidth + 5}px`,
            top: `${gc.topmenuHeight + 1}px`
        }
    },
    gridLayoutClass() {
        return {
            [`zoom-${gc.zoomLevel}`]: true
        }
    },
    gridLayoutStyle() {
      if (!gridModel.model) return {}
      return {
          'grid-template-columns': `repeat(${gridModel.model.numCols}, 1fr)`,
          'grid-template-rows': `repeat(${gridModel.model.numRows}, 1fr)`
      }
    }
  }
};
</script>

<style lang="scss">
@import "./styles/zoom.scss";

.gridcontent {
  overflow: auto;
  position: absolute;
  svg {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    path {
      z-index: 3;
    }
  }
  .gridlayout {
    display: grid;
    position: absolute;
    z-index: 2;
    left: 0;
    top: 0;
  }
}
</style>