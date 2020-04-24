
import { globalConfig as gc } from "../../config/global.config"
import { VueUtils } from '../../utils/vue.utils'

export const gridModelBlueprint = {
    numRows: 0,
    numCols: 0,
    totalSteps: 0,
    steps: {},
    cells: {},
    links: []
}

export const gridcellBlueprint = {
    is: 0,
    type: '',
    id: 0
}

const gridModel = {
    model: null,
    getId(position) {
        if (!position || !this.model.cells[position] || !this.model.cells[position].id) 
            throw new Error('Argument Exception: Please provide a valid position on an existing cell that contains a valid id')

        return this.model.cells[position].id
    },
    getType(position) {
        if (!position || !this.model.cells[position] || !this.model.cells[position].type)
            throw new Error('Argument Exception: Please provide a valid position on an existing cell that contains a valid type')

        return this.model.cells[position].type
    },
    getRow(position) {
        if (!position || !this.model.cells[position])
            throw new Error('Argument Exception: Please provide a valid position on an existing cell')

        return parseInt(position.split(gc.positionSplitSymbol)[0])
    },
    getCol(position) {
        if (!position || !this.model.cells[position])
            throw new Error('Argument Exception: Please provide a valid position on an existing cell')

        return parseInt(position.split(gc.positionSplitSymbol)[1])
    },
    getPosition(row, col) {
        return `${row}${gc.positionSplitSymbol}${col}`
    },
    getPositionDiff(position, rowDiff = 0, colDiff = 0) {
        if (!position || !this.model.cells[position])
            throw new Error('Argument Exception: Please provide a valid position on an existing cell')

        const row = this.getRow(position)
        const col = this.getCol(position)

        if (typeof rowDiff !== 'number' || row + rowDiff > this.model.numRows || row + rowDiff < 1)
            throw new Error('Argument Exception: Please provide a valid rowDiff argument')

        if (typeof colDiff !== 'number' || col + colDiff > this.model.numCols || col + colDiff < 1)
            throw new Error('Argument Exception: Please provide a valid colDiff argument')
        
        return `${row + rowDiff}${gc.positionSplitSymbol}${col + colDiff}`
    },
    getPositionByEventTarget(event) {
        const gridcell = VueUtils.traverseByRef(event.target.__vue__, 'gridcell')

        if (gridcell.__vue__)
            return gridcell.__vue__.position

        return ''
    }
}

globalThis.gridModel = gridModel
export { gridModel }
