import { globalConfig } from "../config/global.config"
import { globalResetsService } from "./globalResets.service"
import { gridSvgService } from "../components/grid/services/gridSvg.service"
import { gridReduceService } from "../models/grid/services/gridReduce.service"

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

        this.recalculateGridSize()
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

        this.recalculateGridSize()
        gridSvgService.calculateSvg(true)
    },
    recalculateGridSize() {
        const gc = globalConfig

        if (gc.zoomLevel === 150) {
            gc.minGridCols = 6
            gc.minGridRows = 3

            gridReduceService.increaseGrid()
            gridReduceService.reduceGrid()
        }
        else if (gc.zoomLevel === 125) {
            gc.minGridCols = 7
            gc.minGridRows = 4

            gridReduceService.increaseGrid()
            gridReduceService.reduceGrid()
        }
        else if (gc.zoomLevel === 100) {
            gc.minGridCols = 9
            gc.minGridRows = 5

            gridReduceService.increaseGrid()
            gridReduceService.reduceGrid()
        }
        else if (gc.zoomLevel === 75) {
            gc.minGridCols = 14
            gc.minGridRows = 7

            gridReduceService.increaseGrid()
            gridReduceService.reduceGrid()
        }
        else if (gc.zoomLevel === 50) {
            gc.minGridCols = 27
            gc.minGridRows = 15

            gridReduceService.increaseGrid()
            gridReduceService.reduceGrid()
        }
    }
}