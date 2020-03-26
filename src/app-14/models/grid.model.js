import Vue from 'vue'
import { globalConfig } from "../config/global.config"

const newGridBlueprint = {
    numRows: 0,
    numCols: 0,
    cells: {}
}

const cellBlueprint = {
    hasElement: false,
    gridElementType: ''
}

const gridModelOperations = {
    removeColumnEnd() {
        for (let index = 0; index < this.model.numRows; index++) {
            const position = `${this.getLetterByI(index)}${this.model.numCols}`
            delete this.model.cells[position]
        }
        this.model.numCols--
    },
    removeRowEnd() {
        for (let index = 1; index <= this.model.numCols; index++) {
            const position = `${this.getLetterByI(this.model.numRows - 1)}${index}`
            delete this.model.cells[position]
        }
        this.model.numRows--
    },
    addColumnEnd() {
        this.model.numCols++
        for (let index = 0; index < this.model.numRows; index++) {
            const position = `${this.getLetterByI(index)}${this.model.numCols}`
            Vue.set(this.model.cells, [position][0], {...cellBlueprint})
        }
        
    },
    addRowEnd() {
        this.model.numRows++
        for (let index = 1; index <= this.model.numCols; index++) {
            const position = `${this.getLetterByI(this.model.numRows - 1)}${index}`
            Vue.set(this.model.cells, [position][0], {...cellBlueprint})
        }
    },
    spliceCols(position) {
        this.addColumnEnd()
        
        const letter = position.split('')[0]
        const number = this.getNumberByP(position)

        for (let i = this.model.numCols; i > number + 1; i--) {
            const nextPos = `${letter}${i}`
            const prevPos = `${letter}${i - 1}`

            this.model.cells[nextPos] = this.model.cells[prevPos]
        }
        position = `${letter}${number + 1}`
        Vue.set(this.model.cells, [position][0], {...cellBlueprint})
    },
    spliceRows(position) {
        this.addRowEnd()
        
        const number = this.getNumberByP(position)
        const letterIndex = this.getLetterIndexByP(position)

        for (let i = this.model.numRows - 1; i > letterIndex; i--) {
            const nextPos = `${globalConfig.alphabet[i]}${number}`
            const prevPos = `${globalConfig.alphabet[i - 1]}${number}`
            
            this.model.cells[nextPos] = this.model.cells[prevPos]
        }

        position = `${globalConfig.alphabet[letterIndex]}${number}`
        Vue.set(this.model.cells, [position][0], {...cellBlueprint})
    }
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
    }
}