<template>
  <div class="controls">
    <button class="btn btn-success" @click="incrementCols">++Cols</button>
    <button class="btn btn-danger" @click="decrementCols">--Cols</button>

    <button class="btn btn-success" @click="incrementRows">++Rows</button>
    <button class="btn btn-danger" @click="decrementRows">--Rows</button>

    <small>{{ globalConfig.zoomLevel }}</small>
    <button class="btn btn-info" @click="zoomService.zoomIn()" :disabled="zoomService.disableZoomIn()">z in</button>
    <button class="btn btn-info" @click="zoomService.zoomOut()" :disabled="zoomService.disableZoomOut()">z out</button>

    <button class="btn btn-success" @click="saveModel">save</button>
    <button class="btn btn-danger" @click="loadModel">load</button>
  </div>
</template>

<script>
window.tempModel = null

import { globalConfig } from '../../../../config/global.config'
import { zoomService } from '../../../../services/zoom.service'
import { gridModel } from '../../../../models/grid/grid.model';
export default {
    data() {
        return {
            zoomService,
            globalConfig
        }
    },
    methods: {
        incrementCols() {
          gridModel.addColumnAtEnd()
        },
        decrementCols() {
          gridModel.removeColumnAtEnd()
        },
        incrementRows() {
          gridModel.addRowAtEnd()
        },
        decrementRows() {
          gridModel.removeRowAtEnd()
        },
        saveModel() {
          tempModel = gridModel.saveGridModel()
        },
        loadModel() {
          gridModel.loadGridModel(JSON.parse(tempModel))
          this.$forceUpdate()
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