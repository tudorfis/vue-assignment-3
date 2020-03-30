<template>
  <div class="gridcontent" @mouseover="resetGridView">
    <krt-gridcontent-controls></krt-gridcontent-controls>
    <!-- -->
    <svg
      id="svgGrid"
      :style="svgStyle"
      :viewBox="zoomService.svgViewBox" 
    >
        <!-- 
        <path :fill="globalConfig.arrowColor" d="M100 100 h15 l-15 -20 l-15 20 Z" class="top-arrow"  />
        <path :fill="globalConfig.arrowColor" d="M100 110 h15 l-15 20 l-15 -20 Z" class="down-arrow"  />
        <path :fill="globalConfig.arrowColor" d="M40 50 v-20 l-20 15 l20 15 Z" class="left-arrow" />
        <path :fill="globalConfig.arrowColor" d="M50 50 v-20 l20 15 l-20 15 Z" class="right-arrow" />
        -->

      <!-- <!-- -->
        <path :fill="globalConfig.arrowColor" d="M124 32 h15 l-15 20 l-15 -20 Z"  />
        <path :stroke="globalConfig.arrowColor" :stroke-width="globalConfig.arrowWidth" d="M124 32 v-26 h119 v345 h30" fill="none"></path>
        <path :fill="globalConfig.arrowColor" d="M270 335 v30 L290 350 Z"></path>
        
        <path :stroke="globalConfig.arrowColor" :stroke-width="globalConfig.arrowWidth" d="M440 350 H750"></path>
        <path :fill="globalConfig.arrowColor" d="M750 335 v30 l20 -15 Z"></path>
      <!-- --> -->
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
import { gridModel } from '../../models/grid.model'
import gridcontentMixin from './mixins/gridcontentStyles.mixin'
import GridcontentControlsVue from './components/GridcontentControls.vue';
import { zoomService } from '../../services/zoom.service'
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
      const gridObj = gridModel.buildGridCells('get')
      return gridObj
    }
  }
};
</script>

<style lang="scss">
.gridcontent {
  svg {
    position: absolute;
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