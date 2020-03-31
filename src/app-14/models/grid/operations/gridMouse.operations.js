import { globalConfig } from "../../../config/global.config"
import { VueUtils } from "../../../utils/vue.utils"
import { dragElementsService } from "../../../services/dragElements.service"

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
    hasElementAbove(position) {
        const row = this.getRow(position)

        if (row === 1)
            return false
        
        const abovePosition = this.getPositionDiff(position, -1, 0)
        const isSameGridCells = gridMouseOperations.isSameGridCells.call(this, position, abovePosition)

        const hasElementAbove = this.model.cells[abovePosition].is
        const hasElement = this.model.cells[position].is

        return !isSameGridCells && hasElement && hasElementAbove
    },
    isMouseOnTopOutside(event, gridCell) {
        const mouseY = event.pageY - gridCell.offsetTop;

        const gc = globalConfig
        const halfCellHeight = Math.round(gc.gridCellHeight / 2)
        const halfDroppoint = Math.round(gc.droppointDimension / 2)

        let isAbovePoint = (mouseY >= (halfCellHeight - halfDroppoint))
        isAbovePoint &= (mouseY <= (halfCellHeight + halfDroppoint))

        return isAbovePoint
    },
    hasElementBellow(position) {
        const row = this.getRow(position)

        if (row === this.model.numRows)
            return false
        
        const bellowPosition = this.getPositionDiff(position, 1, 0)
        const isSameGridCells = gridMouseOperations.isSameGridCells.call(this, bellowPosition, position)

        const hasElementBellow = this.model.cells[bellowPosition].is
        const hasElement = this.model.cells[position].is

        return !isSameGridCells && hasElement && hasElementBellow
    },
    isMouseOnBottomOutside(event, gridCell) {
        const mouseY = event.pageY - gridCell.offsetTop;
        const gc = globalConfig

        return mouseY >= gc.gridCellHeight + gc.droppointDimension
    },
    hasElementRight(position) {
        const col = this.getCol(position)

        if (col === this.model.numCols)
            return false

        const nextPosition = this.getPositionDiff(position, 0, 1)
        const isSameGridCells = gridMouseOperations.isSameGridCells.call(this, position, nextPosition)

        const hasElementNext = this.model.cells[nextPosition].is
        const hasElement = this.model.cells[position].is

        return !isSameGridCells && hasElement && hasElementNext
    },
    isMouseOnRightOutside(event, gridCell) {
        const mouseX = event.pageX - gridCell.offsetLeft;
        const gc = globalConfig

        const halfDroppoint = Math.round(gc.droppointDimension / 2)
        const control = (gc.gridCellWidth * 2) - gc.droppointDimension - halfDroppoint

        return mouseX >= control
    },
    hasElementLeft(position) {
        const col = this.getCol(position)

        if (col === 1)
            return false

        const prevPosition = this.getPositionDiff(position, 0, -1)
        const isSameGridCells = gridMouseOperations.isSameGridCells.call(this, prevPosition, position)

        const hasElementPrev = this.model.cells[prevPosition].is
        const hasElement = this.model.cells[position].is

        return !isSameGridCells && hasElement && hasElementPrev
    },
    isMouseOnLeftOutside(event, gridCell) {
        const mouseX = event.pageX - gridCell.offsetLeft;
        const gc = globalConfig

        const halfDroppoint = Math.round(gc.droppointDimension / 2)
        const control = gc.gridCellWidth + gc.droppointDimension + halfDroppoint

        return mouseX <= control
    }
}