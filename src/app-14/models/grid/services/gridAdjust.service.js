
import Vue from "vue"
import { gridSvgService } from '../../../components/grid/services/gridSvg.service'
import { globalConfig as gc } from '../../../config/global.config'
import { Utils } from '../../../utils/utils'
import { gridcellBlueprint, gridModel } from '../grid.model'
import { GridPositionIterator } from '../iterators/GridPositionIterator'
import { gridLinksService } from './gridLinks.service'

export const gridAdjustService = {
    removeColAtEnd() {
        GridPositionIterator.goOverLastCol(position => {
            gridModel.deleteCell(position)
        })

        gridModel.model.numCols--
    },
    removeRowAtEnd() {
        GridPositionIterator.goOverLastRow(position => {
            gridModel.deleteCell(position)
        })

        gridModel.model.numRows--
    },
    addColAtEnd() {
        gridModel.model.numCols++

        GridPositionIterator.goOverLastCol(position => {
            Vue.set(gridModel.model.cells, position, Utils.deepclone(gridcellBlueprint))
        })
    },
    addRowAtEnd() {
        gridModel.model.numRows++

        GridPositionIterator.goOverLastRow(position => {
            Vue.set(gridModel.model.cells, position, Utils.deepclone(gridcellBlueprint))
        })
    },
    spliceCols(position) {
        if (this.isElementNearColEnd(position)) {
            this.addColAtEnd()
            gridSvgService.calculateSvg()
        }

        GridPositionIterator.goOverNextPrevFromLastCol(position, (nextPos, prevPos) => { 
            gridModel.model.cells[nextPos] = gridModel.model.cells[prevPos]
            gridLinksService.rearangeLinks(prevPos, nextPos)
        })

        gridModel.model.cells[position] = Utils.deepclone(gridcellBlueprint)
    },
    spliceRows(position) {
        if (this.isElementNearRowEnd(position)) {
            this.addRowAtEnd()
            gridSvgService.calculateSvg()
        }

        GridPositionIterator.goOverNextPrevFromLastRow(position, (nextPos, prevPos) => { 
            gridModel.model.cells[nextPos] = gridModel.model.cells[prevPos]
            gridLinksService.rearangeLinks(prevPos, nextPos)
        })

        gridModel.model.cells[position] = Utils.deepclone(gridcellBlueprint)
    },
    addRowOrColEnd(position) {
        if (this.isNearColEnd(position))
            this.addColAtEnd()

        if (this.isNearRowEnd(position))
            this.addRowAtEnd()
    },
    isNearColEnd(position) {
        return gridModel.getCol(position) > gridModel.model.numCols - gc.colsFromTheEnd
    },
    isNearRowEnd(position) {
        return gridModel.getRow(position) > gridModel.model.numRows - gc.rowsFromTheEnd
    },
    isNearColOrRowEnd(position) {
        return this.isNearColEnd(position) || this.isNearRowEnd(position)
    },
    isElementNearColEnd(position) {
        let foundIt = false

        GridPositionIterator.goOverNearEndCol(position, position => {
            if (gridModel.model.cells[position].is) foundIt = true
        })
        
        return foundIt
    },
    isElementNearRowEnd(position) {
        let foundIt = false

        GridPositionIterator.goOverNearEndRow(position, position => {
            if (gridModel.model.cells[position].is) foundIt = true
        })
        
        return foundIt
    }
}
