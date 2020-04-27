
import { Utils } from "../../../../utils/utils";
import { gridModel } from "../../grid.model";

class LinkDirectionsCellVerifier {
    static hasCellsOut(lh, directionOut) {
        if (directionOut === 'up') return LinkDirectionsCellVerifier.hasUpCellsOut(lh)
        else if (directionOut === 'right') return LinkDirectionsCellVerifier.hasRightCellsOut(lh)
        else if (directionOut === 'down') return LinkDirectionsCellVerifier.hasDownCellsOut(lh)
        else if (directionOut === 'left') return LinkDirectionsCellVerifier.hasLeftCellsOut(lh)

        return false
    }
    static hasCellsIn(lh, directionIn) {
        if (directionIn === 'up') return LinkDirectionsCellVerifier.hasUpCellsIn(lh)
        else if (directionIn === 'right') return LinkDirectionsCellVerifier.hasRightCellsIn(lh)
        else if (directionIn === 'down') return LinkDirectionsCellVerifier.hasDownCellsIn(lh)
        else if (directionIn === 'left') return LinkDirectionsCellVerifier.hasLeftCellsIn(lh)

        return false
    }
    static hasCellsCorner(lh, direction) {
        if (lh.isSameRowCol) return false

        let position
        if (['down','up'].includes(direction))
            position = gridModel.getPosition(lh.row2, lh.col1)

        else if (['left','right'].includes(direction))
            position = gridModel.getPosition(lh.row1, lh.col2)

        if (!position) return false
        
        return !!gridModel.model.cells[position].is
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

export { LinkDirectionsCellVerifier }
