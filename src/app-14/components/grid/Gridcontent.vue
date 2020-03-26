<template>
  <div class="gridcontent" @mouseover="resetGridView">

    <!-- @TODO: temporarly controls -->
    <div class="controls">
      <button class="btn btn-success" @click="incrementCols">++Cols</button>
      <button class="btn btn-danger" @click="decrementCols">--Cols</button>

      <button class="btn btn-success" @click="incrementRows">++Rows</button>
      <button class="btn btn-danger" @click="decrementRows">--Rows</button>

      <input v-model="globalConfig.gridCellWidth">
      <input v-model="globalConfig.gridCellHeight">

      <input v-model="globalConfig.gridCellElementWidth">
      <input v-model="globalConfig.gridCellElementHeight">

      <button class="btn btn-success" @click="saveModel">save</button>
      <button class="btn btn-danger" @click="loadModel">load</button>
    </div>


    <svg
      id="svgGrid"
      :style="svgStyle"
      :viewBox="svgViewBox"
    >

      <!-- top arrow -->
      <!-- <path :fill="strokeColor" d="M100 100 h15 l-15 -20 l-15 20 Z"  /> -->
      
      <!-- down arrow -->
      <!-- <path :fill="strokeColor" d="M100 110 h15 l-15 20 l-15 -20 Z"  /> -->

      <!-- left arrow -->
      <!-- <path :fill="strokeColor" d="M40 50 v-20 l-20 15 l20 15 Z"  /> -->

      <!-- right arrow -->
      <!-- <path :fill="strokeColor" d="M50 50 v-20 l20 15 l-20 15 Z"  /> -->


      <!-- some lines drawed for fun -->
      <!-- <path :fill="globalConfig.arrowColor" d="M110 30 H140 L125 50 Z"  /> -->
      <!-- <path :fill="globalConfig.arrowColor" d="M124 32 h15 l-15 20 l-15 -20 Z"  />
      <path :stroke="globalConfig.arrowColor" :stroke-width="globalConfig.arrowWidth" d="M124 32 v-26 h119 v345 h30" fill="none"></path>

      <path :fill="globalConfig.arrowColor" d="M270 335 v30 L290 350 Z"></path>

      <path :stroke="globalConfig.arrowColor" :stroke-width="globalConfig.arrowWidth" d="M440 350 H750"></path>
      <path :fill="globalConfig.arrowColor" d="M750 335 v30 l20 -15 Z"></path> -->

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
window.tempModel = null

import { globalConfig } from '../../config/global.config'
import GridcellVue from './components/Gridcell.vue';
import mousemoveMixin from '../../mixins/mousemove.mixin';
import { gridModel } from '../../models/grid.model'
export default {
  mixins: [mousemoveMixin],
  props: ['toolboxWidth', 'topmenuHeight'],
  components: {
    krtGridcell: GridcellVue
  },
  data() {
    return {
      globalConfig,
      gridModel
    };
  },
  computed: {
    svgStyle() {
      const gc = globalConfig
      const gm = gridModel.model

      const svgWidth = (gc.gridCellWidth * gm.numCols) + (gc.arrowWidth * 2)
      const svgHeight = (gc.gridCellHeight * gm.numRows) + (gc.arrowWidth * 2)
      const svgLeft = gc.toolboxWidth + gc.gridContentLeftPadding + gc.arrowWidth + gc.svgBorderSize
      const svgTop = gc.topmenuHeight + gc.gridContentTopPadding + gc.arrowWidth + gc.svgBorderSize
      const svgBorder = `${gc.svgBorderSize}px solid ${gc.svgBorderColor}`

      return {
        width: `${svgWidth}px`,
        height: `${svgHeight}px`,
        left: `${svgLeft}px`,
        top: `${svgTop}px`,
        border: `${svgBorder}`
      }
    },
    svgViewBox() {
      const gc = globalConfig
      const gm = gridModel.model

      const width = gc.gridCellWidth * gm.numCols
      const height = gc.gridCellHeight * gm.numRows
      
      return `0 0 ${width} ${height}`
    },
    gridLayoutStyle() {
      const gc = globalConfig
      const gm = gridModel.model

      const left = gc.toolboxWidth + gc.gridContentLeftPadding + (gc.arrowWidth * 2) + gc.svgBorderSize
      const top = gc.topmenuHeight + gc.gridContentTopPadding + (gc.arrowWidth * 2) + gc.svgBorderSize

      return {
        top: `${top}px`,
        left: `${left}px`,
        'grid-template-columns': `repeat(${gm.numCols}, 1fr)`,
        'grid-template-rows': `repeat(${gm.numRows}, 1fr)`
      }
    },
    gridSize() {
      return gridModel.model.numCols * gridModel.model.numRows;
    }
  },

  /** @TODO: test controls only */
  methods: {
    incrementCols() {
      gridModel.addColumnEnd()
    },
    decrementCols() {
      gridModel.removeColumnEnd()
    },
    incrementRows() {
      gridModel.addRowEnd()
    },
    decrementRows() {
      gridModel.removeRowEnd()
    },
    saveModel() {
      tempModel = gridModel.saveGridModel()
    },
    loadModel() {
      gridModel.loadGridModel(tempModel)
      this.$forceUpdate()
    }
  }
};
</script>

<style lang="scss" scoped>
.gridcontent {

  /** @TODO: temporarly controls */
  .controls {
    position: fixed;
    top: 10px;
    left: 200px;
    z-index: 4;
    color: white;
    input {
      width: 50px;
      vertical-align: middle;
    }
    button {
      width: 50px;
      font-size: 10px;
      padding: 6px  2px;
      vertical-align: middle;
    }
  }

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