import { globalConfig } from "../../../config/global.config"
import { gridModel } from "../../../models/grid.model"

export default {
    computed: {
        svgStyle() {
            const gc = globalConfig
            const gm = gridModel.model

            const svgWidth = (gc.gridCellWidth * gm.numCols) + (gc.arrowWidth * 2)
            const svgHeight = (gc.gridCellHeight * gm.numRows) + (gc.arrowWidth * 2)
            const svgLeft = gc.toolboxWidth + gc.gridContentLeftPadding + gc.arrowWidth + gc.svgBorderSize
            const svgTop = gc.topmenuHeight + gc.gridContentTopPadding + gc.arrowWidth + gc.svgBorderSize
            const svgBorder = `${gc.svgBorderSize}px solid ${gc.svgBorderColor}`

            return {
            width: `${svgWidth}px`,
            height: `${svgHeight}px`,
            left: `${svgLeft}px`,
            top: `${svgTop}px`,
            border: `${svgBorder}`
            }
        },
        svgViewBox() {
            const gc = globalConfig
            const gm = gridModel.model

            const width = gc.gridCellWidth * gm.numCols
            const height = gc.gridCellHeight * gm.numRows
            
            return `0 0 ${width} ${height}`
        },
        gridLayoutStyle() {
            const gc = globalConfig
            const gm = gridModel.model

            const left = gc.toolboxWidth + gc.gridContentLeftPadding + (gc.arrowWidth * 2) + gc.svgBorderSize
            const top = gc.topmenuHeight + gc.gridContentTopPadding + (gc.arrowWidth * 2) + gc.svgBorderSize

            return {
            top: `${top}px`,
            left: `${left}px`,
            'grid-template-columns': `repeat(${gm.numCols}, 1fr)`,
            'grid-template-rows': `repeat(${gm.numRows}, 1fr)`
            }
        }
    }
}