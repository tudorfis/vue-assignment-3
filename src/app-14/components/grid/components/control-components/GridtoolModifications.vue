
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
import { VueUtils } from '../../../../utils/vue.utils';
import { globalConfig } from '../../../../config/global.config';
import { gridcellOperationsService } from '../../services/gridcellOperations.service';
import { dragElementsEnum } from '../../../../services/dragElements.service';
import { globalResetsService } from '../../../../services/globalResets.service';
export default {
  props: ['position'],
  methods: {
    onDelete(event) {
      globalResetsService.reset()

      const gridCellElement = VueUtils.traversePath(event, 'gridcell')
      gridcellOperationsService.resetCell(gridCellElement)
      
      gridModel.deleteAllLinks(this.position)
      gridModel.buildLinks()
      
      gridModel.saveModel()
    },
    onEdit(event) {
      globalResetsService.reset()

      const gridCellElement = VueUtils.traversePath(event, 'gridcell')
      const elementType = gridCellElement.__vue__.$options.propsData['cell'].type

      switch (elementType) {
        case dragElementsEnum.SEND_EMAIL:
          $('#sendEmailModal').modal();
          break;
        
        case dragElementsEnum.SEND_SMS:
          $('#sendSmsModal').modal();
          break;

        case dragElementsEnum.ADD_REMOVE_TAG:
          $('#addRemoveTagsModal').modal();
          break;
          
        case dragElementsEnum.SUBSCRIBE_LIST:
          $('#subscribeListModal').modal();
          break;
          
        case dragElementsEnum.SUBSCRIBE_SEQUENCE:
          $('#subscribeSequenceModal').modal();
          break;
          
        case dragElementsEnum.AUTOMATION:
          $('#automationModal').modal();
          break;
          
        case dragElementsEnum.SPLIT:
          $('#splitModal').modal();
          break;
          
        case dragElementsEnum.GO_TO:
          $('#goToModal').modal();
          break;
          
        case dragElementsEnum.WAIT:
          $('#waitModal').modal();
          break;
          
      }
    }
  },
  computed: {
    generalIconStyle() {
      const fontSize = Math.floor(globalConfig.gridCellElementWidth / 5)
      return {
        'font-size': `${fontSize}px`
      }
    },
    deleteIconStyle() {
      const left =  Math.floor(globalConfig.gridCellElementWidth / 14)
      const top = left + Math.floor(left / 2)

      return {
        'top': `-${top}px`,
        'left': `-${left}px`
      }
    },
    editIconStyle() {
      const left =  globalConfig.gridCellElementWidth - Math.floor(globalConfig.gridCellElementWidth / 7)
      let top = Math.floor(globalConfig.gridCellElementHeight / 11)

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