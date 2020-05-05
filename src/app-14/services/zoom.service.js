import { gridSvgService } from "../components/grid/services/gridSvg.service"
import { globalConfig as gc } from "../config/global.config"
import { gridLinksService } from "../models/grid/services/gridLinks.service"
import { gridReduceService } from "../models/grid/services/gridReduce.service"
import { globalResetsService } from "./globalResets.service"
import { ZoomDimensionAdjust } from "./zoom-dimensions/ZoomDimensionAdjust"

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

        gc.zoomLevel += gc.zoomDiff
        this.zoomDimensionAdjust.zoomIn(gc)
       
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

        gc.zoomLevel -= gc.zoomDiff
        this.zoomDimensionAdjust.zoomOut(gc)
        
        gc.arrowLineWidth -= 2
        gc.droppointDimension -= 10

        gc.arrowPointerWidth -= 5
        gc.arrowPointerHeight -= 5

        gridReduceService.calculateGridSize()
        gridReduceService.increaseGrid()
        gridReduceService.reduceGrid()
        
        gridSvgService.calculateSvg()
        gridLinksService.buildLinks()
    },

    get zoomDimensionAdjust() {
        if (!this.zoomDimensionAdjuster)
            this.zoomDimensionAdjuster = new ZoomDimensionAdjust(gc.dimensionType)

        return this.zoomDimensionAdjuster
    }
}