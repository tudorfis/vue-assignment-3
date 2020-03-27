
import { globalConfig } from "../config/global.config"
import { gridModelOperations } from './gridModel.operations'
import { gridMouseOperations } from './gridMouse.operations'

const newGridBlueprint = {
    numRows: 0,
    numCols: 0,
    cells: {}
}

export const cellBlueprint = {
    hasElement: false,
    gridElementType: ''
}

export const gridModel = {
    model: null,
    buildGrid(type) {
        if (!type) throw new Error(`Please provide a type`)

        if (type === 'new')
            this.newGridModel()
    },
    newGridModel() {
        this.model = {...newGridBlueprint}

        this.model.numRows = globalConfig.gridRows
        this.model.numCols = globalConfig.gridColumns

        this.generateNewCells()
    },
    generateNewCells() {
        for (let n = 1; n <= (this.model.numRows * this.model.numCols); n++)
            this.model.cells[this.getPosition(n)] = {...cellBlueprint}
    },
    getCell(n) {
        return this.model.cells[this.getPosition(n)]
    },
    setCell(position, properties) {
        this.model.cells[position].hasElement = properties.hasElement
        this.model.cells[position].gridElementType = properties.gridElementType
    },
    getPosition(n) {
        return `${this.getLetterByN(n)}${this.getNumberByN(n)}`;
    },
    getLetterByN(n) {
        return this.getLetterByI(Math.ceil(n / this.model.numCols) - 1)
    },
    getLetterByI(index) {
        return globalConfig.alphabet[index]
    },
    getLetterIndexByP(position) {
        return globalConfig.alphabet.indexOf(position.split('')[0]) + 1
    },
    getNumberByN(number) {
        return number % this.model.numCols || this.model.numCols
    },
    getNumberByP(position) {
        return parseInt(position.split('')[1]) 
    },
    nearColEnd(position) {
        return this.getNumberByP(position) > this.model.numCols - globalConfig.colsFromTheEnd
    },
    nearRowEnd(position) {
        return this.getLetterIndexByP(position) > (this.model.numRows - globalConfig.rowsFromTheEnd)
    },
    saveGridModel() {
        return JSON.stringify(this.model)
    },
    loadGridModel(model) {
        this.model = JSON.parse(model)
    },
    removeColumnEnd() {
        gridModelOperations.removeColumnEnd.call(this)
    },
    removeRowEnd() {
        gridModelOperations.removeRowEnd.call(this)
    },
    addColumnEnd() {
        gridModelOperations.addColumnEnd.call(this)
    },
    addRowEnd() {
        gridModelOperations.addRowEnd.call(this)
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
    }
}