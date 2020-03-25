import { dragElementsEnum, dragElementsService } from "../../../services/dragElements.service"
import { globalConfig } from "../../../config/global.config"
import { VueUtils } from "../../../utils/vue.utils"

export const toolboxService = {
    tempElementBorderRadius: null,

    beforeStartDrag(event) {
        const vueElement = event.srcElement.__vue__

        if (VueUtils.traverseByProp(vueElement, 'isInsideCell'))
            VueUtils.traverseByQuery(vueElement, '.gridtool-modifications').style.visibility = 'hidden'

        this.tempElementBorderRadius = event.srcElement.style.borderRadius
        event.srcElement.style.borderRadius = 0
    },
    startDrag(event, type = '') {
        this.beforeStartDrag(event)

        const dragElement = event.target

        if (!type) return
        let dragType

        switch (type) {
            case 'sendemail': dragType = dragElementsEnum.SEND_EMAIL; break;
            case 'sendsms': dragType = dragElementsEnum.SEND_SMS; break;
            case 'addremovetag': dragType = dragElementsEnum.ADD_REMOVE_TAG; break;
        }

        dragElementsService.setActiveDragElement(dragElement, dragType)
        
        if (dragElementsService.insideCell)
            dragElementsService.setPreviousDragElement(dragElement, dragType)

        this.afterStartDrag(event)
    },
    afterStartDrag(event) {
        setTimeout(_ => {
            event.srcElement.style.borderRadius = this.tempElementBorderRadius
        }, 0)
    },
    setIconStyle(insideCell, extraStyles = {}) {
        const fontSize = Math.floor(globalConfig.gridCellElementHeight / 2.5)
        
        return !insideCell ? {} : {
            ...extraStyles,
            'font-size': `${fontSize}px !important`
        }
    }
}