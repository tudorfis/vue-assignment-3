<template>
  <div class="controls">
    <button class="btn btn-success" @click="incrementCols">++Cols</button>
    <button class="btn btn-danger" @click="decrementCols">--Cols</button>

    <button class="btn btn-success" @click="incrementRows">++Rows</button>
    <button class="btn btn-danger" @click="decrementRows">--Rows</button>

    <input v-model="globalConfig.gridCellWidth" />
    <input v-model="globalConfig.gridCellHeight" />

    <input v-model="globalConfig.gridCellElementWidth" />
    <input v-model="globalConfig.gridCellElementHeight" />

    <button class="btn btn-success" @click="saveModel">save</button>
    <button class="btn btn-danger" @click="loadModel">load</button>

    <input v-model="spliceColPosition" />
    <button class="btn btn-warning" @click="spliceCols">cols</button>
    
    <input v-model="spliceRowPosition" />
    <button class="btn btn-warning" @click="spliceRows">rows</button>
  </div>
</template>

<script>
window.tempModel = null

import { globalConfig } from '../../../config/global.config'
import { gridModel } from '../../../models/grid.model';
export default {
    data() {
        return {
            globalConfig,
            spliceColPosition: 'B1',
            spliceRowPosition: 'A2'
        }
    },
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
        },
        spliceCols() {
            gridModel.spliceCols(this.spliceColPosition)
        },
        spliceRows() {
            gridModel.spliceRows(this.spliceRowPosition)
        }
    }
};
</script>

<style lang="scss" scoped>
.controls {
  position: fixed;
  top: 15px;
  left: 200px;
  z-index: 4;
  color: white;
  input {
    width: 35px;
    vertical-align: middle;
  }
  button {
    width: 40px;
    font-size: 10px;
    padding: 6px 2px;
    vertical-align: middle;
  }
}
</style>