import { dragElementsEnum, dragElementsService } from "../../../services/dragElements.service"
import { globalConfig } from "../../../config/global.config"
import { VueUtils } from "../../../utils/vue.utils"
import { gridDeleteService } from "../../grid/services/gridDelete.service"

export const toolboxService = {
    isInsideCell: false,
    startedDrag: false,
    tempDragStyles: {
        borderRadius: null,
        width: null,
        height: null,
        padding: null,
        iconFontSize: null
    },
    startDrag(event, type = '') {
        if (!type) return

        this.beforeStartDrag(event)

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
        gridDeleteService.hideArrowDelete()

        const vueElement = event.srcElement.__vue__
        this.isInsideCell = VueUtils.traverseByProp(vueElement, 'isInsideCell') || false

        if (this.isInsideCell)
            VueUtils.traverseByQuery(vueElement, '.gridtool-modifications').style.visibility = 'hidden'

        else this.setDragStyles(event.srcElement)
    },
    setDragStyles(element) {
        this.tempDragStyles = {
            borderRadius: element.style.borderRadius,
            width: element.style.width,
            height: element.style.height,
            padding: element.style.padding,
            iconFontSize: element.querySelector('i').style.fontSize
        }

        element.style.borderRadius = `0px`
        element.style.width = `${globalConfig.gridCellElementWidth}px`
        element.style.height = `${globalConfig.gridCellElementHeight}px`
        element.style.padding = `${Math.floor(globalConfig.gridCellElementWidth / 3.3)}px`

        element.querySelector('i').style.fontSize = `${Math.floor(globalConfig.gridCellElementWidth / 2.7)}px`
        element.querySelector('label').style.display = `none`
    },
    afterStartDrag(event) {
        setTimeout(_ => {
            const vueElement = event.srcElement.__vue__

            if (VueUtils.traverseByProp(vueElement, 'isInsideCell'))
                VueUtils.traverseByQuery(vueElement, '.gridtool-modifications').style.visibility = 'visible'

            else this.resetDragStyles(event.srcElement)
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