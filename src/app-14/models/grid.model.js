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
        for (let index = 0; index < this.model.numRows; index++) {
            const position = `${this.getLetterByI(index)}${this.model.numCols + 1}`
            Vue.set(this.model.cells, [position][0], {...cellBlueprint})
        }
        this.model.numCols++
    },
    addRowEnd() {
        for (let index = 1; index <= this.model.numCols; index++) {
            const position = `${this.getLetterByI(this.model.numRows)}${index}`
            Vue.set(this.model.cells, [position][0], {...cellBlueprint})
        }
        this.model.numRows++
        // console.log(this.model.cells)
    } 
}

export const gridModel = {
    model: null,
    getCell(number) {
        const position = this.getPosition(number)
        return this.model.cells[position]
    },
    getPosition(n) {
        const position = `${this.getLetterByN(n)}${this.getNumberByN(n)}`;
        return position;
    },
    buildGrid(type) {
        if (!type) throw new Error(`Please provide a type`)

        if (type === 'new')
            this.newGridModel()
    },
    saveGridModel() {
        return JSON.stringify(this.model)
    },
    loadGridModel(model) {
        if (!model) return

        this.model = JSON.parse(model)
    },
    newGridModel() {
        this.model = {...newGridBlueprint}

        this.model.numRows = globalConfig.gridRows
        this.model.numCols = globalConfig.gridColumns

        this.generateNewCells()
    },
    generateNewCells() {
        const total = this.model.numRows * this.model.numCols

        for (let n = 1; n <= total; n++) {
            const gridPosition = this.getPosition(n)
            this.model.cells[gridPosition] = {...cellBlueprint}
        }
    },
    getLetterByN(n) {
        return this.getLetterByI(Math.ceil(n / this.model.numCols) - 1)
    },
    getLetterByI(index) {
        return globalConfig.alphabet[index]
    },
    getNumberByN(n) {
        return n % this.model.numCols || this.model.numCols
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
    }
}