import { globalConfig as gc } from "../../../config/global.config"
import { Utils } from "../../../utils/utils"
import { gridModel } from "../grid.model"

export class GridPositionIterator {
    static goOverLastCol(handle) {
        if (!handle) return
        const gm = gridModel.model

        Utils.rangeArray(1, gm.numRows)
            .map(row => gridModel.getPosition(row, gm.numCols))
            .forEach(handle)
    }

    static goOverLastRow(handle) {
        if (!handle) return
        const gm = gridModel.model

        Utils.rangeArray(1, gm.numCols)
            .map(col => gridModel.getPosition(gm.numRows, col))
            .forEach(handle)
    }

    static goOverNearEndCol(position, handle) {
        if (!handle) return
        const gm = gridModel.model

        const row = gridModel.getRow(position)
        Utils.rangeArray(gm.numCols, gm.numCols - gc.colsFromTheEnd)
            .map(col => gridModel.getPosition(row, col))
            .forEach(handle)
    }

    static goOverNearEndRow(position, handle) {
        if (!handle) return
        const gm = gridModel.model

        const col = gridModel.getCol(position)
        Utils.rangeArray(gm.numRows, gm.numRows - gc.rowsFromTheEnd)
            .map(row => gridModel.getPosition(row, col))
            .forEach(handle)
    }

    static goOverNextPrevFromLastCol(position, handle) {
        if (!handle) return
        const gm = gridModel.model

        const row = gridModel.getRow(position)
        const col = gridModel.getCol(position)

        Utils.rangeArray(gm.numCols, col + 1)
            .map(col => ({
                nextPos: gridModel.getPosition(row, col),
                prevPos: gridModel.getPosition(row, col - 1)
            }))
            .forEach(data => {
                handle(data.nextPos, data.prevPos)
            })
    }

    static goOverNextPrevFromLastRow(position, handle) {
        if (!handle) return
        const gm = gridModel.model

        const row = gridModel.getRow(position)
        const col = gridModel.getCol(position)

        Utils.rangeArray(gm.numRows, row + 1)
            .map(row => ({
                nextPos: gridModel.getPosition(row, col),
                prevPos: gridModel.getPosition(row - 1, col)
            }))
            .forEach(data => {
                handle(data.nextPos, data.prevPos)
            })
    }

    static getPositionsMatrix(handle) {
        const gm = gridModel.model
        const output = []

        Utils.rangeArray(1, gm.numRows).forEach(row => {
            Utils.rangeArray(1, gm.numCols).forEach(col => {
                output.push(gridModel.getPosition(row, col))
            })
        })
        if (handle) {
            output.forEach(position => {
                handle(position)
            })
            return
        }

        return output
    }
}
