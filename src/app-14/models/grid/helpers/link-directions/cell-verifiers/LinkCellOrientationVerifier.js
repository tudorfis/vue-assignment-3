import { Utils } from "../../../../../utils/utils";
import { gridModel } from "../../../grid.model";

class LinkCellOrientationVerifier {
    static hasCellsOrientation(lh, orientation) {
        if (orientation === 'up') return LinkCellOrientationVerifier.hasCellsOrientationUp(lh)
        else if (orientation === 'down') return LinkCellOrientationVerifier.hasCellsOrientationDown(lh)
        else if (orientation === 'right') return LinkCellOrientationVerifier.hasCellsOrientationRight(lh)
        else if (orientation === 'left') return LinkCellOrientationVerifier.hasCellsOrientationLeft(lh)

        return false
    }

    static hasCellsOrientationUp(lh) {
        if (lh.row1 - 1 === 0) return false
        return LinkCellOrientationVerifier.hasCellsOrientationUpDown(lh, lh.row1 - 1)
    }

    static hasCellsOrientationDown(lh) {
        if (lh.row2 + 1 === gridModel.model.numRows) return false
        return LinkCellOrientationVerifier.hasCellsOrientationUpDown(lh, lh.row2 + 1)
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
        if (lh.col2 + 1 === gridModel.model.numCols) return false
        return LinkCellOrientationVerifier.hasCellsOrientationLeftRight(lh, lh.col2 + 1)
    }
    
    static hasCellsOrientationLeft(lh) {
        if (lh.col1 - 1 === 0) return false
        return LinkCellOrientationVerifier.hasCellsOrientationLeftRight(lh, lh.col1 - 1)
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
}

export { LinkCellOrientationVerifier }