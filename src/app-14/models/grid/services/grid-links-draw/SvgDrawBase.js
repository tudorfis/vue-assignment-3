import { globalConfig } from '../../../../config/global.config'

class SvgDrawBase {
    constructor(lh) {
        this.lh = lh
    }

    get horizontal_M() {
        return (this.lh.col1 - 1) * this.cell_size
    }
    get vertical_M() {
        return (this.lh.row1 - 1) * this.cell_size
    }
    get cell_size() { 
        return globalConfig.gridCellWidth
    }
    get cell_center_size() {
        return globalConfig.gridCellWidth / 2
    }
    get cellelement_center_size() {
        const { gridCellWidth, gridCellElementWidth } = globalConfig
        return (gridCellWidth - gridCellElementWidth) / 2
    }
    get arrow_width() { 
        return globalConfig.arrowPointerWidth + 3
    }

    getSvgD(direction) {
        if (direction === 'up') return 'v-'
        else if (direction === 'down') return 'v'
        else if (direction === 'right') return 'h'
        else if (direction === 'left') return 'h-'
    }
}

export { SvgDrawBase }