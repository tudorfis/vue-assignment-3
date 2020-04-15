
import { globalConfig } from "../../../config/global.config"
import { gridModel } from "../../../models/grid/grid.model"
import { gridLinksService } from "../../../models/grid/services/gridLinks.service"

export const gridSvgService = {
    svgStyle: null,
    svgViewBox: '0 0 0 0',
    calculateSvg(rebuildLinks = false) {
        const gc = globalConfig
        const gm = gridModel.model

        const width = gc.gridCellWidth * gm.numCols
        const height = gc.gridCellWidth * gm.numRows
            
        this.svgStyle = { width, height }
        this.svgViewBox = `0 0 ${width} ${height}`

        if (rebuildLinks)
            gridLinksService.buildLinks()
    }
}