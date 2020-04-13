<template>
  <div class="gridcontent-controls" :style="controlStyles">
    <i class="fas fa-search-plus" @click="zoomService.zoomIn()"></i>
    <i class="fas fa-search-minus" @click="zoomService.zoomOut()"></i>
    <i class="far fa-file" @click="gridModel.newModel()"></i>
    <i class="fas fa-undo" @click="undo"></i>
    <i class="fas fa-redo" @click="redo"></i>
  </div>
</template>

<script>
import { globalConfig } from '../../../../config/global.config'
import { zoomService } from '../../../../services/zoom.service'
import { gridModel } from '../../../../models/grid/grid.model';
export default {
    data() {
        return {
            zoomService,
            gridModel
        }
    },
    methods: {
      undo() {
        gridModel.undoModel()
        this.$forceUpdate()
      },
      redo() {
        gridModel.redoModel()
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