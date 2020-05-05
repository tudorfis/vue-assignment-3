<template>
  <div class="topmenu-controls" :style="topmenuControlsStyle">
    <i class="fas fa-search-plus" @click="zoomService.zoomIn()"></i>
    <i class="fas fa-search-minus" @click="zoomService.zoomOut()"></i>
    <i class="far fa-file" @click="gridIOservice.newModel()"></i>
    <i class="fas fa-undo" @click="undo"></i>
    <i class="fas fa-redo" @click="redo"></i>
    <i class="fas fa-th-large" @click="makeSquare"></i>
    <i class="fas fa-th" @click="makeRectangular"></i>
  </div>
</template>

<script>
import { globalConfig } from "../../../config/global.config"
import { zoomService } from "../../../services/zoom.service"
import { gridIOservice } from "../../../models/grid/services/gridIO.service";
import { gridHistoryService } from "../../../models/grid/services/gridHistory.service";
import { DimensionsConfigEnum } from "../../../config/dimensions/DimensionsConfigEnum";
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
      },
      makeRectangular() {
        if (localStorage.getItem('dimensionType') === DimensionsConfigEnum.RECTANGULAR) return

        localStorage.setItem('gridModel.model', gridHistoryService.getLatestState());
        localStorage.setItem('dimensionType', DimensionsConfigEnum.RECTANGULAR);
        location.reload()
      },
      makeSquare() {
        if (localStorage.getItem('dimensionType') === DimensionsConfigEnum.SQUARE) return

        localStorage.setItem('gridModel.model', gridHistoryService.getLatestState());
        localStorage.setItem('dimensionType', DimensionsConfigEnum.SQUARE);
        location.reload()
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