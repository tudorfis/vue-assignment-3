import { globalConfig } from "../config/global.config"
import { VueUtils } from "../utils/vue.utils"
import { dragElementsService } from "../services/dragElements.service"

export const gridMouseOperations = {
    isSameGridCells(bellowPosition, abovePosition) {

        const dragElement = dragElementsService.activeDragElement
        const gridCellElement = VueUtils.traverseByRef(dragElement.__vue__, 'gridcell');

        if (gridCellElement.__vue__) {
            const cell = gridCellElement.__vue__.$options.propsData['cell']
            const bellowCell = this.model.cells[bellowPosition]
            const aboveCell = this.model.cells[abovePosition]
            
            return !(cell !== bellowCell && cell !== aboveCell)
        }

        return false
    },
    hasElementAboveBellowHandler(position, aboveN, bellowN) {
        const number = this.getNumberByP(position)
        const letterIndex = this.getLetterIndexByP(position)

        if (letterIndex === 0)
            return false
        
        const aboveLetter = globalConfig.alphabet[letterIndex + aboveN]
        if (!aboveLetter) return false
        const abovePosition = `${aboveLetter}${number}`
        
        const belloweLetter = globalConfig.alphabet[letterIndex + bellowN]
        if (!belloweLetter) return false
        const bellowPosition = `${belloweLetter}${number}`

        const isSameGridCells = gridMouseOperations.isSameGridCells.call(this, bellowPosition, abovePosition)

        const hasElementAbove = this.model.cells[abovePosition].hasElement
        const hasElementBellow = this.model.cells[bellowPosition].hasElement

        return !isSameGridCells && hasElementAbove && hasElementBellow
    },
    hasElementAbove(position) {
        return gridMouseOperations.hasElementAboveBellowHandler.call(this, position, -2, -1)
    },
    hasElementBellow(position) {
        return gridMouseOperations.hasElementAboveBellowHandler.call(this, position, -1, -2)
    },
    isMouseOnTopOutside(event, gridCell) {
        // const mouseX = event.pageX - gridCell.offsetLeft;
        const mouseY = event.pageY - gridCell.offsetTop;
    
        const gc = globalConfig
        const halfCellHeight = Math.round(gc.gridCellHeight / 2)
        const halfDroppoint = Math.round(gc.droppointDimension / 2)

        const isAbovePoint = (mouseY >= (halfCellHeight - halfDroppoint))
        return  isAbovePoint
    },
    isMouseOnBottomOutside(event, gridCell) {
        // const mouseX = event.pageX - gridCell.offsetLeft;
        const mouseY = event.pageY - gridCell.offsetTop;
            
        const gc = globalConfig
        const isBellowPoint = (mouseY >= gc.gridCellHeight + (gc.droppointDimension * 2))

        return  isBellowPoint
    }
}