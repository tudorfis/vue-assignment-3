
import { globalConfig } from "../config/global.config"
import { gridModelOperations } from './gridModel.operations'
import { gridMouseOperations } from './gridMouse.operations'
import { Utils } from '../utils/utils'

const cellSplitSymbol = globalConfig.cellSplitSymbol

const newGridBlueprint = {
    numRows: 0,
    numCols: 0,
    totalSteps: 0,
    steps: {},
    cells: {}
}

export const cellBlueprint = {
    hasElement: false,
    gridElementType: ''
}

export const gridModel = {
    model: null,
    newGridModel(numRows, numCols) {
        this.model = {...newGridBlueprint}

        this.model.numRows = numRows || globalConfig.gridRows
        this.model.numCols = numCols || globalConfig.gridColumns

        this.model.cells = this.buildGridCells('new')
    },
    buildGridCells(type = '') {
      if (!this.model) return {}

      const output = {}
      for (let row = 1; row <= this.model.numRows; row++) 
        for (let col = 1; col <= this.model.numCols; col++) {

          const position = this.getPosition(row, col)
          output[position] = type === 'new' ? {...cellBlueprint} : this.model.cells[position]
        }

      return output
    },
    saveGridModel() {
        const output = {
            numCols: this.model.numCols,
            numRows: this.model.numRows,
            totalSteps: this.model.totalSteps,
            steps: Utils.objfilter(this.model.cells, cell => cell.hasElement),
        }
        
        return JSON.stringify(output)
    },
    loadGridModel(model, modelJSON) {
        model = model || {}

        if (modelJSON)
            model = JSON.parse(modelJSON)
        
        this.newGridModel(model.numRows, model.numCols)

        for (const position in model.steps) {
            const step = model.steps[position]
            
            this.setCell(position, {
                hasElement: true,
                gridElementType: step.gridElementType
            })
        }
    },
    getRow(position) {
        return parseInt(position.split(cellSplitSymbol)[0])
    },
    getCol(position) {
        return parseInt(position.split(cellSplitSymbol)[1])
    },
    getPosition(row, col) {
        return `${row}${cellSplitSymbol}${col}`
    },
    getPositionDiff(position, rowDiff = 0, colDiff = 0) {
        const row = this.getRow(position)
        const col = this.getCol(position)

        return `${row + rowDiff}${cellSplitSymbol}${col + colDiff}`
    },
    setCell(position, properties) {
        this.model.cells[position].hasElement = properties.hasElement
        this.model.cells[position].gridElementType = properties.gridElementType
        this.model.totalSteps++
    },
    isElementsColEnd(position) {
        const row = this.getRow(position)
        const colNearEnd = this.model.numCols - globalConfig.colsFromTheEnd
        
        for (let i = this.model.numCols; i >= colNearEnd; i--) {
            if (this.model.cells[this.getPosition(row, i)].hasElement)
                return true
        }
        
        return false
    },
    isElementsRowEnd(position) {
        const col = this.getCol(position)
        const rowNearEnd = this.model.numRows - globalConfig.rowsFromTheEnd

        for (let i = this.model.numRows; i >= rowNearEnd; i--) {
            if (this.model.cells[this.getPosition(i, col)].hasElement)
                return true
        }
        
        return false
    },
    nearColEnd(position) {
        return this.getCol(position) > (this.model.numCols - globalConfig.colsFromTheEnd)
    },
    nearRowEnd(position) {
        return this.getRow(position) > (this.model.numRows - globalConfig.rowsFromTheEnd)
    },
    removeColumnAtEnd() {
        gridModelOperations.removeColumnAtEnd.call(this)
    },
    removeRowAtEnd() {
        gridModelOperations.removeRowAtEnd.call(this)
    },
    addColumnAtEnd() {
        gridModelOperations.addColumnAtEnd.call(this)
    },
    addRowAtEnd() {
        gridModelOperations.addRowAtEnd.call(this)
    },
    spliceCols(position) {
        gridModelOperations.spliceCols.call(this, position)
    },
    spliceRows(position) {
        gridModelOperations.spliceRows.call(this, position)
    },
    hasElementAbove(position) {
        return gridMouseOperations.hasElementAbove.call(this, position)
    },
    hasElementBellow(position) {
        return gridMouseOperations.hasElementBellow.call(this, position)
    },
    isMouseOnTopOutside(event, gridCell) {
        return gridMouseOperations.isMouseOnTopOutside(event, gridCell)
    },
    isMouseOnBottomOutside(event, gridCell) {
        return gridMouseOperations.isMouseOnBottomOutside(event, gridCell) 
    },
    hasElementLeft(position) {
        return gridMouseOperations.hasElementLeft.call(this, position)
    },
    hasElementRight(position) {
        return gridMouseOperations.hasElementRight.call(this, position)
    },
    isMouseOnLeftOutside(event, gridCell) {
        return gridMouseOperations.isMouseOnLeftOutside(event, gridCell)
    },
    isMouseOnRightOutside(event, gridCell) {
        return gridMouseOperations.isMouseOnRightOutside(event, gridCell) 
    }
}