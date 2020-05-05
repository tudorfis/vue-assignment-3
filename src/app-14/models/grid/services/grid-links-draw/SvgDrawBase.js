import { globalConfig } from '../../../../config/global.config'

class SvgDrawBase {
    constructor(lh) {
        this.lh = lh
    }

    get horizontal_M() {
        return (this.lh.col1 - 1) * this.cell_size_width
    }
    get vertical_M() {
        return (this.lh.row1 - 1) * this.cell_size_height
    }
        
    get cell_size_width() { 
        return globalConfig.gridCellWidth
    }
    get cell_size_height() { 
        return globalConfig.gridCellHeight
    }
    
    get cell_center_size_width() {
        return globalConfig.gridCellWidth / 2
    }
    get cell_center_size_height() {
        return globalConfig.gridCellHeight / 2
    }

    get cellelement_center_size_width() {
        const { gridCellWidth, gridCellElementWidth } = globalConfig
        return (gridCellWidth - gridCellElementWidth) / 2
    }
    get cellelement_center_size_height() {
        const { gridCellHeight, gridCellElementHeight } = globalConfig
        return (gridCellHeight - gridCellElementHeight) / 2
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
    getCellsSizes(direction) {
        let cell_size, cell_center_size, cellelement_center_size
         
        if (direction === 'up') {
            cell_size = this.cell_size_height
            cell_center_size = this.cell_center_size_height
            cellelement_center_size = this.cellelement_center_size_height
        }
        else if (direction === 'down') {
            cell_size = this.cell_size_height
            cell_center_size = this.cell_center_size_height
            cellelement_center_size = this.cellelement_center_size_height
        }
        else if (direction === 'right') {
            cell_size = this.cell_size_width
            cell_center_size = this.cell_center_size_width
            cellelement_center_size = this.cellelement_center_size_width
        }
        else if (direction === 'left') {
            cell_size = this.cell_size_width
            cell_center_size = this.cell_center_size_width
            cellelement_center_size = this.cellelement_center_size_width
        }

        return { cell_size, cell_center_size, cellelement_center_size }
    }
}

export { SvgDrawBase }