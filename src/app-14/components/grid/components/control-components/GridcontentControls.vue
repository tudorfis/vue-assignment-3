<template>
  <div class="gridcontent-controls" :style="controlStyles">
    <i class="fas fa-search-plus" @click="zoomService.zoomIn()" :disabled="zoomService.disableZoomIn()"></i>
    <i class="fas fa-search-minus" @click="zoomService.zoomOut()" :disabled="zoomService.disableZoomOut()"></i>

    <i class="far fa-save" @click="saveModel"></i>
    <i class="fas fa-window-restore" @click="loadModel"></i>
  </div>
</template>

<script>
globalThis.tempModel = null

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
        saveModel() {
          tempModel = gridModel.saveGridModel()
        },
        loadModel() {
          gridModel.loadGridModel(JSON.parse(tempModel))
          this.$forceUpdate()
        }
    },
    computed: {
      controlStyles() {
        const top = Math.floor(globalConfig.topmenuHeight / 3.5)
        const left = globalConfig.toolboxWidth + 20
        return {
          top: `${top}px`,
          left: `${left}px`
        }
      }
    }
};
</script>

<style lang="scss" scoped>
.gridcontent-controls {
  position: fixed;
  z-index: 4;
  user-select: none;

  i {
    cursor: pointer;
    font-size: 24px;
    color: white;
    margin-right: 20px;
  }
}
</style>