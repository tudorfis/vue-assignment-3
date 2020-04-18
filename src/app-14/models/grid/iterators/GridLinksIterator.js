import { Utils } from "../../../utils/utils";
import { gridModel } from "../grid.model";


export class GridLinksIterator {
    static hasDownCellsOut(ldh) {
        const rowControl1 = ldh.row1 + 1
        const rowControl2 = ldh.row2 - 1
        const colControl = ldh.col1

        if (rowControl2 === 0) return false
        if (rowControl1 === rowControl2 + 1) return false

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
    static hasUpCellsOut(ldh) {
        const rowControl1 = ldh.row1 - 1
        const rowControl2 = ldh.row2 + 1
        const colControl = ldh.col1

        if (rowControl1 === 0) return false
        if (rowControl1 === rowControl2 - 1) return false

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
    static hasRightCellsOut(ldh) {
        const colControl1 = ldh.col1 + 1
        const colControl2 = ldh.col2 - 1
        const rowControl = ldh.row1

        if (colControl2 === 0) return false
        if (colControl1 === colControl2 + 1) return false

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
    static hasLeftCellsOut(ldh) {
        const colControl1 = ldh.col1 - 1
        const colControl2 = ldh.col2 + 1
        const rowControl = ldh.row1
        
        if (colControl1 === 0) return false
        if (colControl1 === colControl2 - 1) return false

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

    static hasDownCellsIn(ldh) {
        const rowControl1 = ldh.row2 - 1
        const rowControl2 = ldh.row1 + 1
        const colControl = ldh.col2

        if (rowControl1 === 0) return false
        if (rowControl1 === rowControl2 - 1) return false

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
    static hasUpCellsIn(ldh) {
        const rowControl1 = ldh.row2 + 1
        const rowControl2 = ldh.row1 - 1
        const colControl = ldh.col2

        if (rowControl2 === 0) return false
        if (rowControl1 === rowControl2 + 1) return false

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
    static hasRightCellsIn(ldh) {
        const colControl1 = ldh.col2 - 1
        const colControl2 = ldh.col1 + 1
        const rowControl = ldh.row2

        if (colControl1 === 0) return false
        if (colControl1 === colControl2 - 1) return false

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
    static hasLeftCellsIn(ldh) {
        const colControl1 = ldh.col2 + 1
        const colControl2 = ldh.col1 - 1
        const rowControl = ldh.row2

        if (colControl2 === 0) return false
        if (colControl1 === colControl2 + 1) return false

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


    static hasCellsOut(ldh, directionOut) {
        if (directionOut === 'up') return GridLinksIterator.hasUpCellsOut(ldh)
        else if (directionOut === 'right') return GridLinksIterator.hasRightCellsOut(ldh)
        else if (directionOut === 'down') return GridLinksIterator.hasDownCellsOut(ldh)
        else if (directionOut === 'left') return GridLinksIterator.hasLeftCellsOut(ldh)

        return false
    }
    static hasCellsIn(ldh, directionIn) {
        if (directionIn === 'up') return GridLinksIterator.hasUpCellsIn(ldh)
        else if (directionIn === 'right') return GridLinksIterator.hasRightCellsIn(ldh)
        else if (directionIn === 'down') return GridLinksIterator.hasDownCellsIn(ldh)
        else if (directionIn === 'left') return GridLinksIterator.hasLeftCellsIn(ldh)

        return false
    }

    static hasCellsOutCorner(ldh, directionOut) {
        if (ldh.sameRow || ldh.sameCol) return false

        let position
        if (['down','up'].includes(directionOut))
            position = gridModel.getPosition(ldh.row2, ldh.col1)

        else if (['left','right'].includes(directionOut))
            position = gridModel.getPosition(ldh.row1, ldh.col2)

        return !!gridModel.model.cells[position].is
    }
    static hasCellsInCorner(ldh, directionIn) {
        if (ldh.sameRow || ldh.sameCol) return false

        let position
        if (['down','up'].includes(directionIn))
            position = gridModel.getPosition(ldh.row1, ldh.col2)
        
        else if (['left','right'].includes(directionIn))
            position = gridModel.getPosition(ldh.row2, ldh.col1)

        return !!gridModel.model.cells[position].is
    }
    
}