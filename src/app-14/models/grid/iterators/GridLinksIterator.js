import { Utils } from "../../../utils/utils";
import { gridModel } from "../grid.model";

export class GridLinksIterator {
    static hasDownCells(ldh) {
        if (ldh.row1 + 1 === gridModel.model.numRows) return 0

        const cells = 
            Utils.rangeArray(ldh.row1 + 1, ldh.row2)
             .map(row => gridModel.getPosition(row, ldh.col1))
             .map(position => gridModel.model.cells[position].is)
             .filter(is => !!is)

        return cells.length > 0
    }
    static hasUpCells(ldh) {
        if (ldh.row1 - 1 === 0) return 0

        const cells = 
            Utils.rangeArray(ldh.row1 - 1, ldh.row2)
             .map(row => gridModel.getPosition(row, ldh.col1))
             .map(position => gridModel.model.cells[position].is)
             .filter(is => !!is)

        return cells.length > 0
    }
    static hasRightCells(ldh) {
        if (ldh.col1 + 1 === gridModel.model.numCols) return 0

        const cells = 
            Utils.rangeArray(ldh.col1 + 1, ldh.col2)
             .map(col => gridModel.getPosition(ldh.row1, col))
             .map(position => gridModel.model.cells[position].is)
             .filter(is => !!is)

        return cells.length > 0
    }
    static hasLeftCells(ldh) {
        if (ldh.col1 - 1 === 0) return 0

        const cells = 
            Utils.rangeArray(ldh.col1 - 1, ldh.col2)
             .map(col => gridModel.getPosition(ldh.row1, col))
             .map(position => gridModel.model.cells[position].is)
             .filter(is => !!is)

        return cells.length > 0
    }
}