
import Vue from 'vue'
import { cellBlueprint } from '../grid.model'
import { globalConfig } from '../../../config/global.config'
import { gridSvgService } from '../../../components/grid/services/gridSvg.service'
import { gridModel } from '../grid.model'
import { gridLinksService } from './gridLinks.service'

export const gridAdjustService = {
    removeColumnAtEnd() {
        for (let row = 1; row <= gridModel.model.numRows; row++) {
            const position = gridModel.getPosition(row, gridModel.model.numCols)
            delete gridModel.model.cells[position]
        }

        gridModel.model.numCols--
        gridSvgService.calculateSvg()
    },
    removeRowAtEnd() {
        for (let col = 1; col <= gridModel.model.numCols; col++) {
            const position = gridModel.getPosition(gridModel.model.numRows, col)
            delete gridModel.model.cells[position]
        }

        gridModel.model.numRows--
        gridSvgService.calculateSvg()
    },
    addColumnAtEnd() {
        gridModel.model.numCols++

        for (let row = 1; row <= gridModel.model.numRows; row++) {
            const position = gridModel.getPosition(row, gridModel.model.numCols)
            gridModel.model.cells[position] = {...cellBlueprint}
        }

        gridSvgService.calculateSvg()
    },
    addRowAtEnd() {
        gridModel.model.numRows++

        for (let col = 1; col <= gridModel.model.numCols; col++) {
            const position = gridModel.getPosition(gridModel.model.numRows, col)
            gridModel.model.cells[position] = {...cellBlueprint}
        }

        gridSvgService.calculateSvg()
    },
    spliceCols(position) {
        if (this.isElementsColEnd(position))
            this.addColumnAtEnd()

        const row = gridModel.getRow(position)
        const col = gridModel.getCol(position)

        for (let i = gridModel.model.numCols; i > col; i--) {
            const nextPos = gridModel.getPosition(row, i)
            const prevPos = gridModel.getPosition(row, i - 1)

            gridModel.model.cells[nextPos] = gridModel.model.cells[prevPos]
            gridLinksService.rearangeLinks(prevPos, nextPos)
        }
        
        gridModel.model.cells[position] = {...cellBlueprint}
    },
    spliceRows(position) {
        if (this.isElementsRowEnd(position))
            this.addRowAtEnd()

        const row = gridModel.getRow(position)
        const col = gridModel.getCol(position)
        
        for (let i = gridModel.model.numRows; i > row; i--) {
            const currPos = gridModel.getPosition(i, col)
            const prevPos = gridModel.getPosition(i - 1, col)

            gridModel.model.cells[currPos] = gridModel.model.cells[prevPos]
            gridLinksService.rearangeLinks(prevPos, currPos)
        }

        gridModel.model.cells[position] = {...cellBlueprint}
    },
    reduceGridSize(model) {
        let numRows = 0, 
            numCols = 0

        const rowLength = model.numRows - globalConfig.rowsFromTheEnd
        const colLength = model.numCols - globalConfig.colsFromTheEnd

        for (let row = 1; row <= rowLength; row++)
            for (let col = 1; col <= colLength; col++)
                if (model.steps[gridModel.getPosition(row, col)] && col > numCols)
                    numCols = col

        for (let col = 1; col <= colLength; col++)
            for (let row = 1; row <= rowLength; row++)
                if (model.steps[gridModel.getPosition(row, col)] && row > numRows)
                    numRows = row

        numRows += globalConfig.rowsFromTheEnd
        numCols += globalConfig.colsFromTheEnd

        numRows = (numRows < globalConfig.minGridRows) ? globalConfig.minGridRows : numRows
        numCols = (numCols < globalConfig.minGridColumns) ? globalConfig.minGridColumns : numCols

        return { numRows, numCols }
    },
    nearColEnd(position) {
        return gridModel.getCol(position) > (gridModel.model.numCols - globalConfig.colsFromTheEnd)
    },
    nearRowEnd(position) {
        return gridModel.getRow(position) > (gridModel.model.numRows - globalConfig.rowsFromTheEnd)
    },
    isElementsColEnd(position) {
        const row = gridModel.getRow(position)
        const colNearEnd = gridModel.model.numCols - globalConfig.colsFromTheEnd
        
        for (let i = gridModel.model.numCols; i >= colNearEnd; i--) {
            if (gridModel.model.cells[gridModel.getPosition(row, i)].is)
                return true
        }
        
        return false
    },
    isElementsRowEnd(position) {
        const col = gridModel.getCol(position)
        const rowNearEnd = gridModel.model.numRows - globalConfig.rowsFromTheEnd

        for (let i = gridModel.model.numRows; i >= rowNearEnd; i--) {
            if (gridModel.model.cells[gridModel.getPosition(i, col)].is)
                return true
        }
        
        return false
    }
}