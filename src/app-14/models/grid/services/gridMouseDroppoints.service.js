import { toolboxDragService } from "../../../components/toolbox/services/toolboxDrag.service"
import { globalConfig as gc } from "../../../config/global.config"
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
    isMouseOnTopOutside(event, gridcell) {
        const mouseY = event.pageY
        const rect = gridcell.getBoundingClientRect()
        const control = rect.top + (rect.height / 2) - gc.droppointDimension

        return mouseY <= control
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
    isMouseOnBottomOutside(event, gridcell) {
        const mouseY = event.pageY
        const rect = gridcell.getBoundingClientRect()
        const control = rect.top + rect.height - gc.droppointDimension

        return mouseY >= control
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
    isMouseOnRightOutside(event, gridcell) {
        const mouseX = event.pageX
        const rect = gridcell.getBoundingClientRect()
        const control = rect.left + rect.width - gc.droppointDimension

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
    isMouseOnLeftOutside(event, gridcell) {
        const mouseX = event.pageX
        const rect = gridcell.getBoundingClientRect()
        const control = rect.left + (rect.width / 2) - gc.droppointDimension

        return mouseX <= control
    },
    isSameGridCells(prev, next) {
        return [prev, next].includes(toolboxDragService.dragPosition)
    }
}