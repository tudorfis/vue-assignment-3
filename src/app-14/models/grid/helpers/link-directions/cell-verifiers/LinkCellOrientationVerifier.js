import { Utils } from "../../../../../utils/utils";
import { gridModel } from "../../../grid.model";

class LinkCellOrientationVerifier {
    static hasCellsOrientation(lh, orientation) {
        if (orientation === 'up') return LinkCellOrientationVerifier.hasCellsOrientationUp(lh)
        else if (orientation === 'down') return LinkCellOrientationVerifier.hasCellsOrientationDown(lh)
        else if (orientation === 'right') return LinkCellOrientationVerifier.hasCellsOrientationRight(lh)
        else if (orientation === 'left') return LinkCellOrientationVerifier.hasCellsOrientationLeft(lh)

        if (orientation === 'upAfter') return LinkCellOrientationVerifier.hasCellsOrientationUpAfter(lh)
        else if (orientation === 'downAfter') return LinkCellOrientationVerifier.hasCellsOrientationDownAfter(lh)
        else if (orientation === 'rightAfter') return LinkCellOrientationVerifier.hasCellsOrientationRightAfter(lh)
        else if (orientation === 'leftAfter') return LinkCellOrientationVerifier.hasCellsOrientationLeftAfter(lh)

        return true
    }

    static hasCellsOrientationUp(lh) {
        if (lh.isUp) {
            if (lh.row2 - 1 === 0) return true
            return LinkCellOrientationVerifier.hasCellsOrientationUpDown(lh, lh.row2 - 1)
        }
        else {
            if (lh.row1 - 1 === 0) return true
            return LinkCellOrientationVerifier.hasCellsOrientationUpDown(lh, lh.row1 - 1)
        }
    }

    static hasCellsOrientationDown(lh) {
        if (lh.isDown) {
            if (lh.row2 + 1 === gridModel.model.numRows) return true
            return LinkCellOrientationVerifier.hasCellsOrientationUpDown(lh, lh.row2 + 1)
        }
        else {
            if (lh.row1 + 1 === gridModel.model.numRows) return true
            return LinkCellOrientationVerifier.hasCellsOrientationUpDown(lh, lh.row1 + 1)
        }
    }

    static hasCellsOrientationUpDown(lh, rowControl) {
        const { col1, col2 } = lh

        const cells = 
            Utils.rangeArray(col1, col2)
             .map(col => gridModel.getPosition(rowControl, col))
             .map(position => gridModel.model.cells[position].is)
             .filter(is => !!is)

        return cells.length > 0
    }

    static hasCellsOrientationRight(lh) {
        if (lh.isRight) {
            if (lh.col2 + 1 === gridModel.model.numCols) return true
            return LinkCellOrientationVerifier.hasCellsOrientationLeftRight(lh, lh.col2 + 1)
        } else {
            if (lh.col1 + 1 === gridModel.model.numCols) return true
            return LinkCellOrientationVerifier.hasCellsOrientationLeftRight(lh, lh.col1 + 1)
        }
    }
    
    static hasCellsOrientationLeft(lh) {
        if (lh.isLeft) {
            if (lh.col2 - 1 === 0) return true
            return LinkCellOrientationVerifier.hasCellsOrientationLeftRight(lh, lh.col2 - 1)
        } else {
            if (lh.col1 - 1 === 0) return true
            return LinkCellOrientationVerifier.hasCellsOrientationLeftRight(lh, lh.col1 - 1)
        }
    }

    static hasCellsOrientationLeftRight(lh, colControl) {
        const { row1, row2 } = lh

        const cells = 
            Utils.rangeArray(row1, row2)
             .map(row => gridModel.getPosition(row, colControl))
             .map(position => gridModel.model.cells[position].is)
             .filter(is => !!is)

        return cells.length > 0
    }

    static hasCellsOrientationUpAfter(lh) {
        if (lh.isUp) {
            if (lh.row2 - 1 === 0) return true
            return LinkCellOrientationVerifier.hasCellsOrientationUpDownAfter(lh, lh.row2 - 1)
        }
        else {
            if (lh.row1 - 1 === 0) return true
            return LinkCellOrientationVerifier.hasCellsOrientationUpDownAfter(lh, lh.row1 - 1)
        }
    }

    static hasCellsOrientationDownAfter(lh) {
        if (lh.isDown) {
            if (lh.row2 + 1 === gridModel.model.numRows) return true
            return LinkCellOrientationVerifier.hasCellsOrientationUpDownAfter(lh, lh.row2 + 1)
        }
        else {
            if (lh.row1 + 1 === gridModel.model.numRows) return true
            return LinkCellOrientationVerifier.hasCellsOrientationUpDownAfter(lh, lh.row1 + 1)
        }
    }

    static hasCellsOrientationUpDownAfter(lh, rowControl) {
        const { col1, col2 } = lh

        const colControl = lh.isRight ? col1 + 1 : col1 - 1
        if (colControl === gridModel.model.numCols || colControl === 0) return true

        const cells = 
            Utils.rangeArray(colControl, col2)
             .map(col => gridModel.getPosition(rowControl, col))
             .map(position => gridModel.model.cells[position].is)
             .filter(is => !!is)

        return cells.length > 0
    }

    static hasCellsOrientationRightAfter(lh) {
        if (lh.isRight) {
            if (lh.col2 + 1 === gridModel.model.numCols) return true
            return LinkCellOrientationVerifier.hasCellsOrientationLeftRightAfter(lh, lh.col2 + 1)
        } 
        else {
            if (lh.col1 + 1 === gridModel.model.numCols) return true
            return LinkCellOrientationVerifier.hasCellsOrientationLeftRightAfter(lh, lh.col1 + 1)
        }
    }
    
    static hasCellsOrientationLeftAfter(lh) {
        if (lh.isLeft) {
            if (lh.col2 - 1 === 0) return true
            return LinkCellOrientationVerifier.hasCellsOrientationLeftRightAfter(lh, lh.col2 - 1)
        }
        else {
            if (lh.col1 - 1 === 0) return true
            return LinkCellOrientationVerifier.hasCellsOrientationLeftRightAfter(lh, lh.col1 - 1)
        }
    }

    static hasCellsOrientationLeftRightAfter(lh, colControl) {
        const { row1, row2 } = lh

        const rowControl = lh.isDown ? row1 + 1 : row1 - 1
        if (rowControl === gridModel.model.numRows || rowControl === 0) return true

        const cells = 
            Utils.rangeArray(rowControl, row2)
             .map(row => gridModel.getPosition(row, colControl))
             .map(position => gridModel.model.cells[position].is)
             .filter(is => !!is)

        return cells.length > 0
    }
}

export { LinkCellOrientationVerifier }