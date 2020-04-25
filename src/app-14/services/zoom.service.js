import { gridSvgService } from "../components/grid/services/gridSvg.service"
import { globalConfig } from "../config/global.config"
import { gridLinksService } from "../models/grid/services/gridLinks.service"
import { gridReduceService } from "../models/grid/services/gridReduce.service"
import { globalResetsService } from "./globalResets.service"

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

        gridReduceService.calculateGridSize()
        gridReduceService.increaseGrid()
        gridReduceService.reduceGrid()

        gridSvgService.calculateSvg()
        gridLinksService.buildLinks()
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

        gridReduceService.calculateGridSize()
        gridReduceService.increaseGrid()
        gridReduceService.reduceGrid()
        
        gridSvgService.calculateSvg()
        gridLinksService.buildLinks()
    }
}