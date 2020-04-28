import { Utils } from "../../../../../utils/utils";
import { gridModel } from "../../../grid.model";

class LinkCellInVerifier {
    static hasCellsIn(lh, directionIn) {
        if (directionIn === 'up') return LinkCellInVerifier.hasUpCellsIn(lh)
        else if (directionIn === 'right') return LinkCellInVerifier.hasRightCellsIn(lh)
        else if (directionIn === 'down') return LinkCellInVerifier.hasDownCellsIn(lh)
        else if (directionIn === 'left') return LinkCellInVerifier.hasLeftCellsIn(lh)

        return false
    }

    static hasDownCellsIn(lh) {
        const rowControl1 = lh.row2 - 1
        const rowControl2 = lh.row1 + 1
        const colControl = lh.col2

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
    static hasUpCellsIn(lh) {
        const rowControl1 = lh.row2 + 1
        const rowControl2 = lh.row1 - 1
        const colControl = lh.col2

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
    static hasRightCellsIn(lh) {
        const colControl1 = lh.col2 - 1
        const colControl2 = lh.col1 + 1
        const rowControl = lh.row2

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
    static hasLeftCellsIn(lh) {
        const colControl1 = lh.col2 + 1
        const colControl2 = lh.col1 - 1
        const rowControl = lh.row2

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
}

export { LinkCellInVerifier }