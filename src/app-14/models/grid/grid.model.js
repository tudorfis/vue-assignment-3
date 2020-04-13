
import Vue from 'vue'
import { Utils } from "../../utils/utils"
import { globalConfig } from "../../config/global.config"
import { gridModelOperations } from './operations/gridModel.operations'
import { gridMouseOperations } from './operations/gridMouse.operations'
import { gridLinksOperations } from './operations/gridLinks.operations'
import { zoomService } from "../../services/zoom.service"

globalThis.Vue = Vue
globalThis.gridLinksOperations = gridLinksOperations

const cellSplitSymbol = globalConfig.cellSplitSymbol

const newGridBlueprint = {
    numRows: 0,
    numCols: 0,
    totalSteps: 0,
    steps: {},
    cells: {},
    links: []
}

export const cellBlueprint = {
    is: 0,
    type: '',
    id: 0
}

export const gridModel = {
    paths: {},
    model: null,
    modelHistory: [],
    modelVersion: -1,

    newGridModel(numRows, numCols, doAfterGridLoaded = false) {
        this.model = {...newGridBlueprint}

        this.model.numRows = numRows || globalConfig.gridRows
        this.model.numCols = numCols || globalConfig.gridColumns

        this.model.cells = this.buildGridCells('new')

        if (doAfterGridLoaded)
            this.afterGridLoaded()
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
            steps: Utils.objfilter(this.model.cells, cell => cell.is),
            links: this.model.links
        }
        
        return JSON.stringify(output)
    },
    loadGridModel(model) {
        const gridSize = gridModelOperations.reduceGridSize.call(this, model)
        this.newGridModel(gridSize.numRows, gridSize.numCols)

        for (const position in model.steps)
            this.setCell(position, {
                is: 1,
                type: model.steps[position].type,
                id: model.steps[position].id
            })
        
        this.model.steps = model.steps
        this.model.links = model.links

        this.afterGridLoaded()
    },
    afterGridLoaded() {
        zoomService.calculateSvgViewBox()
        document.querySelector('.loading-icon').style.visibility = 'hidden'
        gridModel.buildLinks()
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
        this.model.cells[position] = this.model.cells[position] || { ...cellBlueprint }

        this.model.cells[position].is = properties.is
        this.model.cells[position].type = properties.type
        this.model.cells[position].id = properties.id || 0
        
        this.model.totalSteps++
    },
    isElementsColEnd(position) {
        const row = this.getRow(position)
        const colNearEnd = this.model.numCols - globalConfig.colsFromTheEnd
        
        for (let i = this.model.numCols; i >= colNearEnd; i--) {
            if (this.model.cells[this.getPosition(row, i)].is)
                return true
        }
        
        return false
    },
    isElementsRowEnd(position) {
        const col = this.getCol(position)
        const rowNearEnd = this.model.numRows - globalConfig.rowsFromTheEnd

        for (let i = this.model.numRows; i >= rowNearEnd; i--) {
            if (this.model.cells[this.getPosition(i, col)].is)
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
    saveModel() {
        this.modelHistory.push(this.saveGridModel())
        this.modelVersion++
    },
    newModel() {
        this.newGridModel()
        this.buildLinks()
        this.saveModel()
    },
    undoModel() {
        if (this.modelHistory[this.modelVersion - 1]) {
            this.modelVersion--
            this.loadGridModel(JSON.parse(this.modelHistory[this.modelVersion]))
        }
    },
    redoModel() {
        if (this.modelHistory[this.modelVersion + 1]) {
            this.modelVersion++
            this.loadGridModel(JSON.parse(this.modelHistory[this.modelVersion]))
        }
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
    },
    buildLinks() {
        return gridLinksOperations.buildLinks.call(this) 
    },
    rearangeLinks(oldPosition, newPosition) {
        gridLinksOperations.rearangeLinks.call(this, oldPosition, newPosition) 
    },
    rearangeLinksAfterDroppoint(position, direction) {
        gridLinksOperations.rearangeLinksAfterDroppoint(position, direction) 
    },
    getEmptyPositionForDroppoint(newPosition, oldPosition) {
        return gridLinksOperations.getEmptyPositionForDroppoint.call(this, newPosition, oldPosition)
    },
    rearangeLinksOnSinglePath(position) {
        gridLinksOperations.rearangeLinksOnSinglePath(position)
    },
    hasMiddleDroppoint(position) {
        return gridLinksOperations.rearangeLinksOnSinglePath(position, true)
    },
    hasNoLinks(position) {
        return gridLinksOperations.hasNoLinks(position)
    },
    deleteAllLinks(position) {
        gridLinksOperations.deleteAllLinks.call(this, position)
    }
}