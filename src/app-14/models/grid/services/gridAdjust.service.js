
import Vue from "vue"
import { cellBlueprint } from '../grid.model'
import { globalConfig } from '../../../config/global.config'
import { gridSvgService } from '../../../components/grid/services/gridSvg.service'
import { gridModel } from '../grid.model'
import { gridLinksService } from './gridLinks.service'
import { GridPositionIterator } from '../iterators/GridPositionIterator'

export const gridAdjustService = {
    removeColAtEnd() {
        GridPositionIterator.goOverLastCol(position => {
            delete gridModel.model.cells[position]
        })

        gridModel.model.numCols--
        gridSvgService.calculateSvg()
    },
    removeRowAtEnd() {
        GridPositionIterator.goOverLastRow(position => {
            delete gridModel.model.cells[position]
        })

        gridModel.model.numRows--
        gridSvgService.calculateSvg()
    },
    addColAtEnd() {
        gridModel.model.numCols++

        GridPositionIterator.goOverLastCol(position => {
            Vue.set(gridModel.model.cells, position, {...cellBlueprint})
        })

        gridSvgService.calculateSvg()
    },
    addRowAtEnd() {
        gridModel.model.numRows++

        GridPositionIterator.goOverLastRow(position => {
            Vue.set(gridModel.model.cells, position, {...cellBlueprint})
        })

        gridSvgService.calculateSvg()
    },
    spliceCols(position) {
        if (this.isElementNearColEnd(position))
            this.addColAtEnd()

        GridPositionIterator.goOverNextPrevFromLastCol(position, (nextPos, prevPos) => { 
            gridModel.model.cells[nextPos] = gridModel.model.cells[prevPos]
            gridLinksService.rearangeLinks(prevPos, nextPos)
        })

        gridModel.model.cells[position] = {...cellBlueprint}
    },
    spliceRows(position) {
        if (this.isElementNearRowEnd(position))
            this.addRowAtEnd()

        GridPositionIterator.goOverNextPrevFromLastRow(position, (nextPos, prevPos) => { 
            gridModel.model.cells[nextPos] = gridModel.model.cells[prevPos]
            gridLinksService.rearangeLinks(prevPos, nextPos)
        })

        gridModel.model.cells[position] = {...cellBlueprint}
    },
    addRowOrColEnd(position) {
        if (this.nearColEnd(position))
            this.addColAtEnd()

        if (this.nearRowEnd(position))
            this.addRowAtEnd()
    },

    nearColEnd(position) {
        const gm = gridModel.model
        const gc = globalConfig

        return gridModel.getCol(position) > gm.numCols - gc.colsFromTheEnd
    },
    nearRowEnd(position) {
        const gm = gridModel.model
        const gc = globalConfig

        return gridModel.getRow(position) > gm.numRows - gc.rowsFromTheEnd
    },
    isNearColOrRowEnd(position) {
        return this.nearColEnd(position) || this.nearRowEnd(position)
    },
    isElementNearColEnd(position) {
        const gm = gridModel.model
        let foundIt = false

        GridPositionIterator.goOverNearEndCol(position, position => {
            if (gm.cells[position].is) foundIt = true
        })
        
        return foundIt
    },
    isElementNearRowEnd(position) {
        const gm = gridModel.model
        let foundIt = false

        GridPositionIterator.goOverNearEndRow(position, position => {
            if (gm.cells[position].is) foundIt = true
        })
        
        return foundIt
    }
}
