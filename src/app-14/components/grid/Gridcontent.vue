<template>
  <div 
    ref="gridcontent"
    class="gridcontent"
    :class="gridcontentClass"
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
        :fill="svgPath.isArrow ? svgPath.color : 'none'"
        :stroke="!svgPath.isArrow ? svgPath.color : ''"
        :stroke-width="!svgPath.isArrow ? svgPath.width : 0"
        :stroke-dasharray="!svgPath.isArrow ? svgPath.style : 0" />
    </svg>
    <div 
      class="gridlayout"
      :style="gridLayoutStyle"
    >
      <krt-gridcell
        v-for="position of gridPositions"
        :key="position"
        :position="position"
      ></krt-gridcell>
    </div>

    <krt-grid-arrow-connector></krt-grid-arrow-connector>
    <krt-grid-arrow-attributes></krt-grid-arrow-attributes>
    <krt-grid-link-names></krt-grid-link-names>
    <krt-grid-link-name-modal></krt-grid-link-name-modal>
    <krt-grid-link-attributes-modal></krt-grid-link-attributes-modal>
  </div>
</template>

<script>
import { globalConfig as gc } from '../../config/global.config'
import { gridModel } from '../../models/grid/grid.model'
import GridcellVue from './components/Gridcell.vue';
import GridArrowConnectorVue from './components/control-components/GridArrowConnector.vue';
import { gridSvgService } from './services/gridSvg.service'
import { Utils } from '../../utils/utils';
import { gridArrowConnectorService } from '../grid/services/gridArrowConnector.service'
import { gridArrowAttributesService } from './services/gridArrowAttributes.service'
import { gridPanService } from './services/gridPan.service';
import { gridLinksBuilderService } from '../../models/grid/services/grid-links/gridLinksBuilder.service';
import { globalResetsService } from '../../services/globalResets.service';
import { GridPositionIterator } from '../../models/grid/iterators/GridPositionIterator';
import { gridReduceService } from '../../models/grid/services/gridReduce.service';
import { DimensionsConfigEnum } from '../../config/dimensions/DimensionsConfigEnum';
import GridLinkNamesVue from './components/control-components/GridLinkNames.vue';
import GridArrowAttributesVue from './components/control-components/GridArrowAttributes.vue';
import GridLinkNameModalVue from './modals/GridLinkNameModal.vue';
import GridLinkAttributesModalVue from './modals/GridLinkAttributesModal.vue';

export default {
  props: ['toolboxWidth', 'topmenuHeight'],
  components: {
    krtGridcell: GridcellVue,
    krtGridArrowConnector: GridArrowConnectorVue,
    krtGridArrowAttributes: GridArrowAttributesVue,
    krtGridLinkNames: GridLinkNamesVue,
    krtGridLinkNameModal: GridLinkNameModalVue,
    krtGridLinkAttributesModal: GridLinkAttributesModalVue,
  },
  data() {
    return {
      gc,
      gm: gridModel,
      glb: gridLinksBuilderService,
      grs: globalResetsService,
      gridSvgService
    };
  },
  methods: {
    drawPath() {
      gridArrowConnectorService.drawPath()
    },
    findSvgPath(event) {
      gridArrowAttributesService.findSvgPath(event)
    }
  },
  mounted() {
      gridArrowAttributesService.svgEl = document.querySelector('#svgGrid')
      gridArrowAttributesService.gridlayoutEl = document.querySelector('.gridlayout')
      gridPanService.init(this.$refs.gridcontent)
  },
  computed: {
    gridPositions() {
      if (!gridModel.model) return
      
      return GridPositionIterator.getPositionsMatrix()
    },
    svgPaths() {
      return Utils.reduceobj(gridLinksBuilderService.svgPaths)
    },
    gridcontentClass() {
      return {
          [`zoom-${gc.zoomLevel}`]: true,
          [`square`]: gc.dimensionType === DimensionsConfigEnum.SQUARE,
          [`rectangular`]: gc.dimensionType === DimensionsConfigEnum.RECTANGULAR
      }
    },
    gridcontentStyle() {
        return {
            height: `calc(100% - ${gc.topmenuHeight + 4}px)`,
            width: `calc(100% - ${gc.toolboxWidth + 7}px)`,
            left: `${gc.toolboxWidth + 5}px`,
            top: `${gc.topmenuHeight + 1}px`
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
@import "./styles/square.dimensions.scss";
@import "./styles/rectangular.dimensions.scss";

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