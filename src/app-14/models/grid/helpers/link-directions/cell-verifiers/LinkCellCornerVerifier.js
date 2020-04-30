
import { gridModel } from "../../../grid.model";

class LinkCellCornerVerifier {
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

    static hasCellsCornerOutside(lh, orientation) {
        const { row1, row2, col1, col2 } = lh
        let row, col

        if (orientation === 'upLeft') {
            row = (lh.isUp) ? row2 - 1 : row1 - 1
            col = (lh.isLeft) ? col2 - 1 : col1 - 1
        }

        else if (orientation === 'upRight') {
            row = (lh.isUp) ? row2 - 1 : row1 - 1
            col = (lh.isRight) ? col2 + 1 : col1 + 1
        }

        else if (orientation === 'downLeft') {
            row = (lh.isDown) ? row2 + 1 : row1 + 1
            col = (lh.isLeft) ? col2 - 1 : col1 - 1
        }

        else if (orientation === 'downRight') {
            row = (lh.isDown) ? row2 + 1 : row1 + 1
            col = (lh.isRight) ? col2 + 1 : col1 + 1
        }

        if (row === 0 || row === gridModel.model.numRows)
            return false

        if (col === 0 || col === gridModel.model.numCols)
            return false

        const position = gridModel.getPosition(row, col)
        return !!gridModel.model.cells[position].is
    }
}

export { LinkCellCornerVerifier }
