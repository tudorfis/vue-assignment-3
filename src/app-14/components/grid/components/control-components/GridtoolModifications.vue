
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
import { gridCellService } from '../../services/gridCell.service';
import { globalResetsService } from '../../../../services/globalResets.service';
import { gridHistoryService } from '../../../../models/grid/services/gridHistory.service';
import { gridLinksService } from '../../../../models/grid/services/gridLinks.service';
import { toolboxElementsEnum } from '../../../toolbox/enum/toolboxElements.enum';
export default {
  props: ['position'],
  methods: {
    onDelete(event) {
      globalResetsService.reset()

      const gridcell = VueUtils.traversePath(event, 'gridcell')
      gridCellService.resetCell(gridcell)
      
      gridLinksService.deleteAllLinks(this.position)
      gridLinksService.buildLinks()
      
      gridHistoryService.saveState()
    },
    onEdit(event) {
      globalResetsService.reset()

      const gridcell = VueUtils.traversePath(event, 'gridcell')
      const elementType = gridcell.__vue__.$options.propsData['cell'].type

      switch (elementType) {
        case toolboxElementsEnum.SEND_EMAIL:
          $('#sendEmailModal').modal();
          break;
        
        case toolboxElementsEnum.SEND_SMS:
          $('#sendSmsModal').modal();
          break;

        case toolboxElementsEnum.ADD_REMOVE_TAG:
          $('#addRemoveTagsModal').modal();
          break;
          
        case toolboxElementsEnum.SUBSCRIBE_LIST:
          $('#subscribeListModal').modal();
          break;
          
        case toolboxElementsEnum.SUBSCRIBE_SEQUENCE:
          $('#subscribeSequenceModal').modal();
          break;
          
        case toolboxElementsEnum.AUTOMATION:
          $('#automationModal').modal();
          break;
          
        case toolboxElementsEnum.SPLIT:
          $('#splitModal').modal();
          break;
          
        case toolboxElementsEnum.GO_TO:
          $('#goToModal').modal();
          break;
          
        case toolboxElementsEnum.WAIT:
          $('#waitModal').modal();
          break;
          
      }
    }
  },
  computed: {
    generalIconStyle() {
      const gc = globalConfig
      const fontSize = Math.floor(gc.gridCellElementWidth / 5)
      return {
        'font-size': `${fontSize}px`
      }
    },
    deleteIconStyle() {
      const gc = globalConfig
      const left =  Math.floor(gc.gridCellElementWidth / 14)
      const top = left + Math.floor(left / 2)

      return {
        'top': `-${top}px`,
        'left': `-${left}px`
      }
    },
    editIconStyle() {
      const gc = globalConfig
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