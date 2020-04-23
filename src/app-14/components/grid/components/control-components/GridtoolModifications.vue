
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
    generalIconStyle() {
      const fontSize = Math.floor(gc.gridCellElementWidth / 5)
      return {
        'font-size': `${fontSize}px`
      }
    },
    deleteIconStyle() {
      const left =  Math.floor(gc.gridCellElementWidth / 14)
      const top = left + Math.floor(left / 2)

      return {
        'top': `-${top}px`,
        'left': `-${left}px`
      }
    },
    editIconStyle() {
      const left =  gc.gridCellElementWidth - Math.floor(gc.gridCellElementWidth / 7)
      const top = Math.floor(gc.gridCellElementHeight / 11)

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