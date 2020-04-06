
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
    <!-- <i
      @mousedown="mousedownArrow"
      @mouseup="mouseupArrow"
      class="fas fa-sign-in-alt drag-arrow-icon"
      :style="{...generalIconStyle, ...dragArrowIconStyle}"></i> -->
  </div>
</template>

<script>
import { VueUtils } from '../../../utils/vue.utils';
import { globalConfig } from '../../../config/global.config';
import { gridcellOperationsService } from '../services/gridcellOperations.service';
import { dragElementsEnum } from '../../../services/dragElements.service';
export default {
  props: ['position'],
  methods: {
    onDelete(event) {
      const gridCellElement = VueUtils.traversePath(event, 'gridcell')
      gridcellOperationsService.resetCell(gridCellElement)
      
      gridModel.deleteAllLinks(this.position)
      gridModel.buildLinks()
    },
    onEdit(event) {
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
      }
    },
    // onDragArrow(event) {
    //   console.log('onDragArrow', event)
    // },
    // mouseupArrow(event) {
    //   console.log('mouseupArrow', event)
    // },
    // mousedownArrow(event) {
      

    //   console.log(dragI)
    //   // event.srcElement.style.position = 'fixed'
    //   // event.srcElement.style.top = '60px'
    //   // event.srcElement.style.left = '200px'
    //   // event.srcElement.draggable = true

    //   console.log('mousedownArrow', event)
    // },
    
  },
  mounted(event) {
    console.log(this.$parent)
      const parent = this.$parent.$el
      const parentRect = parent.getBoundingClientRect()

      const element = this.$el
      const uid = element.__vue__._uid
      let dragI

      if (!document.querySelector(`#dragArrow${uid}`)) {
        
        dragI = document.createElement('i')
        dragI.id = `dragArrow${uid}`

        dragI.classList = 'fas fa-sign-in-alt drag-arrow-icon'
        dragI.style.position = 'fixed'
        dragI.style.fontSize = '30px'
        dragI.style.zIndex = '4'
        dragI.style.color = '#4D80CC'
        dragI.style.cursor = 'pointer'

        // const rect = element.getBoundingClientRect()
        dragI.style.top = `${parentRect.top + parentRect.height - 30}px`
        dragI.style.left = `${parentRect.left + parentRect.width - 30}px`

        document.body.append(dragI)
      } else {
        dragI = document.querySelector(`#dragArrow${uid}`)
        console.log(`dragI`, dragI)
      }
  },
  beforeDestroy() {
      const element = this.$el
      const uid = element.__vue__._uid
      const dragI = document.querySelector(`#dragArrow${uid}`)

      console.log('uid', uid)
      dragI.style.display = 'none'
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
    },
    // dragArrowIconStyle() {
    //   const left =  globalConfig.gridCellElementWidth - Math.floor(globalConfig.gridCellElementWidth / 15)
    //   let top = globalConfig.gridCellElementHeight - Math.floor(globalConfig.gridCellElementHeight / 7)

    //   return {
    //     'top': `${top}px`,
    //     'left': `${left}px`
    //   }
    // }
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
      color: lightcoral;
    }
    &.edit-icon {
      color: #4DB380;
    }
    // &.drag-arrow-icon {
    //   color: #4D80CC;
    //   transform: scale(1.20);
    //   &:hover {
    //     transition: transform 0.20s;
    //     transform: scale(1.50);
    //   }
    // }
    
  }
}
</style>