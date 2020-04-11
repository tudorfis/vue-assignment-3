import { dragElementsEnum, dragElementsService } from "../../../services/dragElements.service"
import { globalConfig } from "../../../config/global.config"
import { VueUtils } from "../../../utils/vue.utils"
import { gridArrowService } from "../../grid/services/gridArrow.service"

export const toolboxService = {
    isInsideCell: false,
    startedDrag: false,
    tempDragStyles: {
        borderRadius: '',
        width: '',
        height: '',
        padding: '',
        iconFontSize: ''
    },
    startDrag(event, type = '') {
        if (!type) return

        this.beforeStartDrag(event)

        if (!this.startedDrag) return

        const dragElement = event.target
        dragElementsService.activeDragElement = dragElement

        let dragType
        switch (type) {
            case 'sendemail': dragType = dragElementsEnum.SEND_EMAIL; break;
            case 'sendsms': dragType = dragElementsEnum.SEND_SMS; break;
            case 'addremovetag': dragType = dragElementsEnum.ADD_REMOVE_TAG; break;
            case 'subscribelist': dragType = dragElementsEnum.SUBSCRIBE_LIST; break;
            case 'subscribesequence': dragType = dragElementsEnum.SUBSCRIBE_SEQUENCE; break;
            case 'automation': dragType = dragElementsEnum.AUTOMATION; break;
            case 'split': dragType = dragElementsEnum.SPLIT; break;
            case 'go_to': dragType = dragElementsEnum.GO_TO; break;
            case 'wait': dragType = dragElementsEnum.WAIT; break;
            case 'complete': dragType = dragElementsEnum.COMPLETE; break;
        }
        dragElementsService.activeDragElementType = dragType

        if (dragElementsService.insideCell)
            dragElementsService.previousDragElement = dragElement

        this.afterStartDrag(event)
    },
    beforeStartDrag(event) {
        this.startedDrag = true
        this.oldPosition = VueUtils.traverseByProp(event.srcElement.__vue__, 'position')
        this.isInsideCell = VueUtils.traverseByProp(event.srcElement.__vue__, 'isInsideCell') || false

        if (!this.isInsideCell) {
            this.setDragStyles(event.srcElement)
            return
        }

        const gridcellelement = VueUtils.traverseByRef(event.srcElement.__vue__, 'gridcellelement')
        if (gridcellelement) {
            gridArrowService.hideArrowConnector()
            gridcellelement.showOtherIcons = false
            return
        }

        this.startedDrag = false
    },
    setDragStyles(element) {
        const gc = globalConfig

        this.tempDragStyles = {
            borderRadius: element.style.borderRadius,
            width: element.style.width,
            height: element.style.height,
            padding: element.style.padding,
            iconFontSize: element.querySelector('i').style.fontSize
        }

        const padding = Math.floor(gc.gridCellElementWidth / 3.3)
        const fontSize = Math.floor(gc.gridCellElementWidth / 2.7)
        
        element.style.borderRadius = `0px`
        element.style.width = `${gc.gridCellElementWidth}px`
        element.style.height = `${gc.gridCellElementHeight}px`
        element.style.padding = (gc.zoomLevel === 50) ? '5px' : `${padding}px`

        element.querySelector('i').style.fontSize = `${fontSize}px`
        element.querySelector('label').style.display = `none`
    },
    afterStartDrag(event) {
        setTimeout(_ => {
            if (!this.isInsideCell) 
                this.resetDragStyles(event.srcElement)
        }, 0)
    },
    resetDragStyles(element) {
        element.style.borderRadius = this.tempDragStyles.borderRadius
        element.style.width = this.tempDragStyles.width
        element.style.height = this.tempDragStyles.height
        element.style.padding = this.tempDragStyles.padding
        
        element.querySelector('i').style.fontSize = this.tempDragStyles.iconFontSize
        element.querySelector('label').style.display = `block`
    }
}