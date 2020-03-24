import { dragElementsEnum, dragElementsService } from "../../../services/dragElements.service"
import { gridCellService } from "../../grid/services/gridcell.service"
import { globalConfig } from "../../../config/global.config"

export const toolboxService = {
    startDrag(dragElement, type = '') {
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
    },
    setIconStyle(insideCell, extraStyles = {}) {
        const fontSize = Math.floor(globalConfig.gridCellElementHeight / 2.5)
        
        return !insideCell ? {} : {
            ...extraStyles,
            'font-size': `${fontSize}px !important`
        }
    }
}