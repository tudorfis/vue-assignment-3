<template>
  <div class="gridcontent" @mouseover="resetGridView">
    <!-- @TODO: remove controls, used only for testing purposes -->
    <krt-gridcontent-controls></krt-gridcontent-controls>
    <svg
      id="svgGrid"
      :style="svgStyle"
      :viewBox="zoomService.svgViewBox" 
    >
        <path 
          :d="arrow.d" 
          v-for="arrow of pathObj"
          :fill="arrow.a ? globalConfig.arrowColor : 'none'"
          :stroke="!arrow.a ? globalConfig.arrowColor : ''"
          :stroke-width="!arrow.a ? globalConfig.arrowWidth : 0" />
    </svg>
    <div 
      class="gridlayout"
      :class="gridLayoutClass"
      :style="gridLayoutStyle"
    >
      <krt-gridcell
        v-for="(cell,position) of gridObj"
        :cell="cell"
        :key="position"
        :position="position"
      ></krt-gridcell>
    </div>
  </div>
</template>

<script>
import { globalConfig } from '../../config/global.config'
import GridcellVue from './components/Gridcell.vue';
import mousemoveMixin from '../../mixins/mousemove.mixin';
import { gridModel } from '../../models/grid/grid.model'
import gridcontentMixin from './mixins/gridcontentStyles.mixin'
import GridcontentControlsVue from './components/GridcontentControls.vue';
import { zoomService } from '../../services/zoom.service'
import { Utils } from '../../utils/utils';
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
      gridModel,
      zoomService
    };
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
.gridcontent {
  svg {
    position: absolute;
    z-index: 0;
  }
  .gridlayout {
    display: grid;
    position: absolute;
    z-index: 1;

    &.zoom-50 {
      .gridcell {
        width: 120px;
        height: 120px;
        .gridcell-element {
          width: 70px;
          height: 70px;
          top: 25px;
          left: 25px;
          .gridtool {
            padding: 20px;
            border-radius: 7.5px;
            i { font-size: 26px; }
          }
        }
      }
    }
    &.zoom-75 {
      .gridcell {
        width: 180px;
        height: 180px;
        .gridcell-element {
          width: 105px;
          height: 105px;
          top: 37.5px;
          left: 37.5px;
          .gridtool {
            padding: 30px;
            border-radius: 11.25px;
            i { font-size: 42px; }
          }
        }
      }
    }
    &.zoom-100 {
      .gridcell {
        width: 240px;
        height: 240px;
        .gridcell-element {
          width: 140px;
          height: 140px;
          top: 50px;
          left: 50px;
          .gridtool {
            padding: 40px;
            border-radius: 15px;
            i { font-size: 56px; }
          }
        }
      }
    }
    &.zoom-125 {
      .gridcell {
        width: 300px;
        height: 300px;
        .gridcell-element {
          width: 175px;
          height: 175px;
          top: 62.5px;
          left: 62.5px;
          .gridtool {
            padding: 50px;
            border-radius: 18.75px;
            i { font-size: 70px; }
          }
        }
      }
    }
    &.zoom-150 {
      .gridcell {
        width: 360px;
        height: 360px;
        .gridcell-element {
          width: 210px;
          height: 210px;
          top: 75px;
          left: 75px;
          .gridtool {
            padding: 60px;
            border-radius: 22.5px;
            i { font-size: 84px; }
          }
        }
      }
    }
  }
}
</style>