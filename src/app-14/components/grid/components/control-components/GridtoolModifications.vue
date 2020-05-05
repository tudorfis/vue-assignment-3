
<template>
  <div class="gridtool-modifications">
    <i 
      @click="onDelete"
      class="fas fa-trash delete-icon"
      :style="{...generalIconStyle, ...deleteIconStyle}"
    ></i>
    <i
      @click="onEdit"
      class="fas fa-edit edit-icon"
      :style="{...generalIconStyle, ...editIconStyle}"></i>
  </div>
</template>

<script>
import { globalConfig as gc } from '../../../../config/global.config';
import { gridToolService } from '../../services/gridTool.service'
import { DimensionsConfigEnum } from '../../../../config/dimensions/DimensionsConfigEnum';

export default {
  props: ['position'],
  methods: {
    onDelete() {
      gridToolService.deleteGridcell(this.position)
    },
    onEdit() {
        gridToolService.editGridcell(this.position)
    }
  },
  computed: {
    mathMedium() {
      return (gc.gridCellElementWidth + gc.gridCellElementHeight) / 2
    },
    generalIconStyle() {
      let fontSize
      if (gc.dimensionType === DimensionsConfigEnum.SQUARE) {
        fontSize = Math.floor(this.mathMedium / 5)
      }
      else if (gc.dimensionType === DimensionsConfigEnum.RECTANGULAR) {
        fontSize = Math.floor(this.mathMedium / 6)
      }
      return {
        'font-size': `${fontSize}px`
      }
    },
    deleteIconStyle() {
      const left =  Math.floor(this.mathMedium / 14)
      const top = left + Math.floor(left / 2)

      return {
        'top': `-${top}px`,
        'left': `-${left}px`
      }
    },
    editIconStyle() {
      let left, top
      if (gc.dimensionType === DimensionsConfigEnum.SQUARE) {
        left =  gc.gridCellElementWidth - Math.floor(gc.gridCellElementWidth / 7)
        top = Math.floor(gc.gridCellElementHeight / 11)
      }
      else if (gc.dimensionType === DimensionsConfigEnum.RECTANGULAR) {
        left = gc.gridCellElementWidth - 15
        top = Math.floor(gc.gridCellElementHeight / 11) + 5
      }

      return {
        'top': `-${top}px`,
        'left': `${left}px`
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.gridtool-modifications {
  position: absolute;
  top: 0;
  left: 0;

  i {
    cursor: pointer;
    position: absolute;
    
    &:hover {
      transition: transform 0.20s;
      transform: scale(1.30);
    }

    &.delete-icon {
      color: red;
    }
    &.edit-icon {
      color: black;
    }
  }
}
</style>