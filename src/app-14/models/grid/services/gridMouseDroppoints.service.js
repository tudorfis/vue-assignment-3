import { globalConfig } from "../../../config/global.config"
import { VueUtils } from "../../../utils/vue.utils"
import { dragElementsService } from "../../../services/dragElements.service"
import { gridModel } from "../grid.model"

export const gridMouseDroppointsService = {
    hasElementAbove(position) {
        const row = gridModel.getRow(position)

        if (row === 1)
            return false
        
        const abovePosition = gridModel.getPositionDiff(position, -1, 0)
        const isSameGridCells = this.isSameGridCells(position, abovePosition)

        const hasElementAbove = gridModel.model.cells[abovePosition].is
        const hasElement = gridModel.model.cells[position].is

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
        const row = gridModel.getRow(position)

        if (row === gridModel.model.numRows)
            return false
        
        const bellowPosition = gridModel.getPositionDiff(position, 1, 0)
        const isSameGridCells = this.isSameGridCells(bellowPosition, position)

        const hasElementBellow = gridModel.model.cells[bellowPosition].is
        const hasElement = gridModel.model.cells[position].is

        return !isSameGridCells && hasElement && hasElementBellow
    },
    isMouseOnBottomOutside(event, gridCell) {
        const mouseY = event.pageY - gridCell.offsetTop;
        const gc = globalConfig

        return mouseY >= gc.gridCellHeight + gc.droppointDimension
    },
    hasElementRight(position) {
        const col = gridModel.getCol(position)

        if (col === gridModel.model.numCols)
            return false

        const nextPosition = gridModel.getPositionDiff(position, 0, 1)
        const isSameGridCells = this.isSameGridCells(position, nextPosition)

        const hasElementNext = gridModel.model.cells[nextPosition].is
        const hasElement = gridModel.model.cells[position].is

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
        const col = gridModel.getCol(position)

        if (col === 1)
            return false

        const prevPosition = gridModel.getPositionDiff(position, 0, -1)
        const isSameGridCells = this.isSameGridCells(prevPosition, position)

        const hasElementPrev = gridModel.model.cells[prevPosition].is
        const hasElement = gridModel.model.cells[position].is

        return !isSameGridCells && hasElement && hasElementPrev
    },
    isMouseOnLeftOutside(event, gridCell) {
        const mouseX = event.pageX - gridCell.offsetLeft;
        const gc = globalConfig

        const halfDroppoint = Math.round(gc.droppointDimension / 2)
        const control = gc.gridCellWidth + gc.droppointDimension + halfDroppoint

        return mouseX <= control
    },
    isSameGridCells(prev, next) {
        const dragElement = dragElementsService.activeDragElement
        const gridcell = VueUtils.traverseByRef(dragElement.__vue__, 'gridcell');

        if (gridcell.__vue__) {
            const cell = gridcell.__vue__.$options.propsData['cell']
            const prevCell = gridModel.model.cells[prev]
            const nextCell = gridModel.model.cells[next]
            
            return !(cell !== prevCell && cell !== nextCell)
        }

        return false
    }
}