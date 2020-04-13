import { globalConfig } from "../config/global.config"
import { gridModel } from "../models/grid/grid.model"
import { globalResetsService } from "./globalResets.service"

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
        if (this.disableZoomIn()) return
        globalResetsService.reset

        globalConfig.zoomLevel += globalConfig.zoomDiff

        globalConfig.gridCellWidth += 60
        globalConfig.gridCellHeight += 60

        globalConfig.gridCellElementWidth += 35
        globalConfig.gridCellElementHeight += 35
        
        globalConfig.arrowWidth += 2
        globalConfig.droppointDimension += 10

        globalConfig.arrowSizeW += 2
        globalConfig.arrowSizeH += 1
    },
    zoomOut() {
        if (this.disableZoomOut()) return
        globalResetsService.reset

        globalConfig.zoomLevel -= globalConfig.zoomDiff

        globalConfig.gridCellWidth -= 60
        globalConfig.gridCellHeight -= 60

        globalConfig.gridCellElementWidth -= 35
        globalConfig.gridCellElementHeight -= 35
        
        globalConfig.arrowWidth -= 2
        globalConfig.droppointDimension -= 10

        globalConfig.arrowSizeW -= 2
        globalConfig.arrowSizeH -= 1
    },
    calculateSvgViewBox() {
        const gc = globalConfig
        const gm = gridModel.model

        const width = (gc.cellSizeCalculation * gm.numCols) + (gc.arrowWidth * 2)
        const height = (gc.cellSizeCalculation * gm.numRows) + (gc.arrowWidth * 2)
            
        const viewBox = `0 0 ${width} ${height}`
        this.svgViewBox = viewBox
    }
}