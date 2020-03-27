import { globalConfig } from "../config/global.config"
import { VueUtils } from "../utils/vue.utils"
import { dragElementsService } from "../services/dragElements.service"

export const gridMouseOperations = {
    isSameGridCells(prev, next) {

        const dragElement = dragElementsService.activeDragElement
        const gridCellElement = VueUtils.traverseByRef(dragElement.__vue__, 'gridcell');

        if (gridCellElement.__vue__) {
            const cell = gridCellElement.__vue__.$options.propsData['cell']
            const prevCell = this.model.cells[prev]
            const nextCell = this.model.cells[next]
            
            return !(cell !== prevCell && cell !== nextCell)
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
        return gridMouseOperations.hasElementAboveBellowHandler.call(this, position, -1, 0)
    },
    isMouseOnTopOutside(event, gridCell) {
        const mouseY = event.pageY - gridCell.offsetTop;

        const gc = globalConfig
        const halfCellHeight = Math.round(gc.gridCellHeight / 2)
        const halfDroppoint = Math.round(gc.droppointDimension / 2)

        let isAbovePoint = (mouseY >= (halfCellHeight - halfDroppoint))
        isAbovePoint &= (mouseY <= (halfCellHeight + halfDroppoint))

        return  isAbovePoint
    },
    isMouseOnBottomOutside(event, gridCell) {
        const mouseY = event.pageY - gridCell.offsetTop;
        const gc = globalConfig

        return mouseY >= gc.gridCellHeight + gc.droppointDimension
    },
    hasElementLeft(position) {
        const letter = position.split('')[0]
        const number = this.getNumberByP(position)

        if (number === 1)
            return false
        
        const prevNumber = number - 1
        const prevPosition = `${letter}${prevNumber}`

        const isSameGridCells = gridMouseOperations.isSameGridCells.call(this, prevPosition, position)

        const hasElementPrev = this.model.cells[prevPosition].hasElement
        const hasElementCurrent = this.model.cells[position].hasElement

        return !isSameGridCells && hasElementPrev && hasElementCurrent
    },
    hasElementRight(position) {
        const letter = position.split('')[0]
        const number = this.getNumberByP(position)

        if (number === this.model.numCols)
            return false

        const nextNumber = number + 1
        const nextPosition = `${letter}${nextNumber}`

        const isSameGridCells = gridMouseOperations.isSameGridCells.call(this, position, nextPosition)

        const hasElementNext = this.model.cells[nextPosition].hasElement
        const hasElementCurrent = this.model.cells[position].hasElement

        return !isSameGridCells && hasElementNext && hasElementCurrent
    },
    isMouseOnLeftOutside(event, gridCell) {
        const mouseX = event.pageX - gridCell.offsetLeft;
        const gc = globalConfig

        const tinyDroppoint = Math.round(gc.droppointDimension / 10)
        const isLeftPoint = mouseX <= (gc.gridCellWidth + gc.droppointDimension * 2 - tinyDroppoint)

        return  isLeftPoint
    },
    isMouseOnRightOutside(event, gridCell) {
        const mouseX = event.pageX - gridCell.offsetLeft;
        const gc = globalConfig

        const tinyDroppoint = Math.round(gc.droppointDimension / 10)
        const control = (gc.gridCellWidth * 2) - gc.droppointDimension - tinyDroppoint

        const isRightPoint = (mouseX >= control)
        return  isRightPoint
    }
}