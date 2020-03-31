import { globalConfig } from "../config/global.config"
import { gridModel } from "../models/grid/grid.model"

/**
    <button class="btn btn-info" @click="zoomService.zoomIn()" :disabled="zoomService.disableZoomIn()">z in</button>
    <button class="btn btn-info" @click="zoomService.zoomOut()" :disabled="zoomService.disableZoomOut()">z out</button>
 */

export const zoomService = {
    svgViewBox: '0 0 0 0',
    disableZoomIn() {
        const gc = globalConfig
        return (gc.zoomLevel + gc.zoomDiff > gc.zoomMax)
    },
    disableZoomOut() {
        const gc = globalConfig
        return (gc.zoomLevel - gc.zoomDiff < gc.zoomMin)
    },
    zoomIn() {
        globalConfig.zoomLevel += globalConfig.zoomDiff

        globalConfig.gridCellWidth += 60
        globalConfig.gridCellHeight += 60

        globalConfig.gridCellElementWidth += 35
        globalConfig.gridCellElementHeight += 35
        
        globalConfig.arrowWidth += 2
        globalConfig.droppointDimension += 10
    },
    zoomOut() {
        globalConfig.zoomLevel -= globalConfig.zoomDiff

        globalConfig.gridCellWidth -= 60
        globalConfig.gridCellHeight -= 60

        globalConfig.gridCellElementWidth -= 35
        globalConfig.gridCellElementHeight -= 35
        
        globalConfig.arrowWidth -= 2
        globalConfig.droppointDimension -= 10
    },
    calculateSvgViewBox() {
        const gc = globalConfig
        const gm = gridModel.model

        const width = (240 * gm.numCols) + (gc.arrowWidth * 2)
        const height = (240 * gm.numRows) + (gc.arrowWidth * 2)
            
        const viewBox = `0 0 ${width} ${height}`
        this.svgViewBox = viewBox
    }
}