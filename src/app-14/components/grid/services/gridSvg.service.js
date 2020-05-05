
import { globalConfig } from "../../../config/global.config"
import { gridModel } from "../../../models/grid/grid.model"

const gridSvgService = {
    svgStyle: null,
    svgViewBox: '0 0 0 0',
    calculateSvg() {
        const { numCols, numRows } = gridModel.model
        const { gridCellWidth, gridCellHeight } = globalConfig

        const width = gridCellWidth * numCols
        const height = gridCellHeight * numRows
            
        this.svgStyle = { width, height }
        this.svgViewBox = `0 0 ${width} ${height}`
    }
}

globalThis.gridSvgService = gridSvgService
export { gridSvgService }
