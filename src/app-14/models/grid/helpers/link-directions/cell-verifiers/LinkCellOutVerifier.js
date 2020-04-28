import { Utils } from "../../../../../utils/utils";
import { gridModel } from "../../../grid.model";

class LinkCellOutVerifier {
    static hasCellsOut(lh, directionOut) {
        if (directionOut === 'up') return LinkCellOutVerifier.hasUpCellsOut(lh)
        else if (directionOut === 'right') return LinkCellOutVerifier.hasRightCellsOut(lh)
        else if (directionOut === 'down') return LinkCellOutVerifier.hasDownCellsOut(lh)
        else if (directionOut === 'left') return LinkCellOutVerifier.hasLeftCellsOut(lh)

        return false
    }

    static hasDownCellsOut(lh) {
        const rowControl1 = lh.row1 + 1
        const rowControl2 = lh.row2 - 1
        const colControl = lh.col1

        if (rowControl2 === 0) return false
        if (rowControl1 === rowControl2 + 1) return false
        if (colControl === 0) return false

        if (rowControl1 === rowControl2) {
            const position = gridModel.getPosition(rowControl1, colControl)
            return !!gridModel.model.cells[position].is
        }

        const cells = 
            Utils.rangeArray(rowControl1, rowControl2)
             .map(row => gridModel.getPosition(row, colControl))
             .map(position => gridModel.model.cells[position].is)
             .filter(is => !!is)

        return cells.length > 0
    }
    static hasUpCellsOut(lh) {
        const rowControl1 = lh.row1 - 1
        const rowControl2 = lh.row2 + 1
        const colControl = lh.col1

        if (rowControl1 === 0) return false
        if (rowControl1 === rowControl2 - 1) return false
        if (colControl === 0) return false

        if (rowControl1 === rowControl2) {
            const position = gridModel.getPosition(rowControl1, colControl)
            return !!gridModel.model.cells[position].is
        }

        const cells = 
            Utils.rangeArray(rowControl1, rowControl2)
             .map(row => gridModel.getPosition(row, colControl))
             .map(position => gridModel.model.cells[position].is)
             .filter(is => !!is)

        return cells.length > 0
    }
    static hasRightCellsOut(lh) {
        const colControl1 = lh.col1 + 1
        const colControl2 = lh.col2 - 1
        const rowControl = lh.row1

        if (colControl2 === 0) return false
        if (colControl1 === colControl2 + 1) return false
        if (rowControl === 0) return false

        if (colControl1 === colControl2) {
            const position = gridModel.getPosition(rowControl, colControl1)
            return !!gridModel.model.cells[position].is
        }

        const cells = 
            Utils.rangeArray(colControl1, colControl2)
             .map(col => gridModel.getPosition(rowControl, col))
             .map(position => gridModel.model.cells[position].is)
             .filter(is => !!is)

        return cells.length > 0
    }
    static hasLeftCellsOut(lh) {
        const colControl1 = lh.col1 - 1
        const colControl2 = lh.col2 + 1
        const rowControl = lh.row1
        
        if (colControl1 === 0) return false
        if (colControl1 === colControl2 - 1) return false
        if (rowControl === 0) return false

        if (colControl1 === colControl2) {
            const position = gridModel.getPosition(rowControl, colControl1)
            return !!gridModel.model.cells[position].is
        }

        const cells = 
            Utils.rangeArray(colControl1, colControl2)
             .map(col => gridModel.getPosition(rowControl, col))
             .map(position => gridModel.model.cells[position].is)
             .filter(is => !!is)

        return cells.length > 0
    }
}

export { LinkCellOutVerifier }
