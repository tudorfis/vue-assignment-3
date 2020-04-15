<template>
  <div class="topmenu-controls" :style="topmenuControlsStyle">
    <i class="fas fa-search-plus" @click="zoomService.zoomIn()"></i>
    <i class="fas fa-search-minus" @click="zoomService.zoomOut()"></i>
    <i class="far fa-file" @click="gridModel.newModel()"></i>
    <i class="fas fa-undo" @click="undo"></i>
    <i class="fas fa-redo" @click="redo"></i>
  </div>
</template>

<script>
import { globalConfig } from '../../../config/global.config'
import { zoomService } from '../../../services/zoom.service'
import { gridModel } from '../../../models/grid/grid.model';
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
      topmenuControlsStyle() {
        const gc = globalConfig
        return {
          padding: `${gc.topmenuHeight / 4}px 0`
        }
      }
    }
};
</script>

<style lang="scss" scoped>
.topmenu-controls {
  user-select: none;

  i {
    cursor: pointer;
    font-size: 24px;
    color: white;
    margin-right: 20px;
  }
}
</style>