
import { globalConfig as gc } from "../../../config/global.config"
import { gridModel } from "../../../models/grid/grid.model"

export const gridSvgService = {
    svgStyle: null,
    svgViewBox: '0 0 0 0',
    calculateSvg() {
        const width = gc.gridCellWidth * gridModel.model.numCols
        const height = gc.gridCellWidth * gridModel.model.numRows
            
        this.svgStyle = { width, height }
        this.svgViewBox = `0 0 ${width} ${height}`
    }
}