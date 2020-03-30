
import Vue from 'vue'
import { cellBlueprint } from './grid.model'

export const gridModelOperations = {
    removeColumnEnd() {
        for (let row = 1; row <= this.model.numRows; row++) {
            const position = this.getPosition(row, this.model.numCols)
            delete this.model.cells[position]
        }

        this.model.numCols--
    },
    removeRowEnd() {
        for (let col = 1; col <= this.model.numCols; col++) {
            const position = this.getPosition(this.model.numRows, col)
            delete this.model.cells[position]
        }

        this.model.numRows--
    },
    addColumnAtEnd() {
        this.model.numCols++

        for (let row = 1; row <= this.model.numRows; row++) {
            const position = this.getPosition(row, this.model.numCols)
            Vue.set(this.model.cells, position, {...cellBlueprint})
        }
    },
    addRowAtEnd() {
        this.model.numRows++

        for (let col = 1; col <= this.model.numCols; col++) {
            const position = this.getPosition(this.model.numRows, col)
            Vue.set(this.model.cells, position, {...cellBlueprint})
        }
    },
    spliceCols(position) {
        if (this.isElementsColEnd(position))
            this.addColumnAtEnd()

        const row = this.getRow(position)
        const col = this.getCol(position)

        for (let i = this.model.numCols; i > col; i--) {
            const nextPos = this.getPosition(row, i)
            const prevPos = this.getPosition(row, i - 1)

            this.model.cells[nextPos] = this.model.cells[prevPos]
        }
        
        Vue.set(this.model.cells, position, {...cellBlueprint})
    },
    spliceRows(position) {
        if (this.isElementsRowEnd(position))
            this.addRowAtEnd()

        const row = this.getRow(position)
        const col = this.getCol(position)
        
        for (let i = this.model.numRows; i > row; i--) {
            const currentPosition = this.getPosition(i, col)
            const previousPosition = this.getPosition(i - 1, col)

            this.model.cells[currentPosition] = this.model.cells[previousPosition]
        }

        Vue.set(this.model.cells, position, {...cellBlueprint})
    }
}