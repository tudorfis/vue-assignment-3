
import Vue from 'vue'
import { globalConfig } from "../../config/global.config"
import { VueUtils } from '../../utils/vue.utils'

globalThis.Vue = Vue
globalThis.globalConfig = globalConfig

export const gridBlueprint = {
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
    model: null,
    getRow(position) {
        if (!position) return -1
        return parseInt(position.split(globalConfig.positionSplitSymbol)[0])
    },
    getCol(position) {
        if (!position) return -1
        return parseInt(position.split(globalConfig.positionSplitSymbol)[1])
    },
    getPosition(row, col) {
        return `${row}${globalConfig.positionSplitSymbol}${col}`
    },
    getPositionDiff(position, rowDiff = 0, colDiff = 0) {
        const row = this.getRow(position)
        const col = this.getCol(position)

        return `${row + rowDiff}${globalConfig.positionSplitSymbol}${col + colDiff}`
    },
    getPositionByEventTarget(event) {
        const gridcell = VueUtils.traverseByRef(event.target.__vue__, 'gridcell')
        return (!gridcell.__vue__) ? null : gridcell.__vue__.position
    }
}