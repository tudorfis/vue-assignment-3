
import Vue from 'vue'
import { cellBlueprint } from './grid.model'
import { globalConfig } from '../config/global.config'

export const gridModelOperations = {
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