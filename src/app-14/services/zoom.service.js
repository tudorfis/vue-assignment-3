import { globalConfig } from "../config/global.config"
import { globalResetsService } from "./globalResets.service"
import { gridSvgService } from "../components/grid/services/gridSvg.service"

export const zoomService = {
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

        const gc = globalConfig
        gc.zoomLevel += gc.zoomDiff

        gc.gridCellWidth += 60
        gc.gridCellHeight += 60

        gc.gridCellElementWidth += 35
        gc.gridCellElementHeight += 35
        
        gc.arrowLineWidth += 2
        gc.droppointDimension += 10

        gc.arrowPointerWidth += 5
        gc.arrowPointerHeight += 5

        gridSvgService.calculateSvg(true)
    },
    zoomOut() {
        if (this.disableZoomOut()) return
        globalResetsService.reset

        const gc = globalConfig
        gc.zoomLevel -= gc.zoomDiff

        gc.gridCellWidth -= 60
        gc.gridCellHeight -= 60

        gc.gridCellElementWidth -= 35
        gc.gridCellElementHeight -= 35
        
        gc.arrowLineWidth -= 2
        gc.droppointDimension -= 10

        gc.arrowPointerWidth -= 5
        gc.arrowPointerHeight -= 5

        gridSvgService.calculateSvg(true)
    }
}