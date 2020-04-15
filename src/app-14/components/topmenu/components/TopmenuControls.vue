<template>
  <div class="topmenu-controls" :style="topmenuControlsStyle">
    <i class="fas fa-search-plus" @click="zoomService.zoomIn()"></i>
    <i class="fas fa-search-minus" @click="zoomService.zoomOut()"></i>
    <i class="far fa-file" @click="gridIOservice.newModel()"></i>
    <i class="fas fa-undo" @click="undo"></i>
    <i class="fas fa-redo" @click="redo"></i>
  </div>
</template>

<script>
import { globalConfig } from '../../../config/global.config'
import { zoomService } from '../../../services/zoom.service'
import { gridIOservice } from '../../../models/grid/services/gridIO.service';
import { gridHistoryService } from '../../../models/grid/services/gridHistory.service';
export default {
    data() {
        return {
            zoomService,
            gridIOservice
        }
    },
    methods: {
      undo() {
        gridHistoryService.undoModelState()
        this.$forceUpdate()
      },
      redo() {
        gridHistoryService.redoModelState()
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