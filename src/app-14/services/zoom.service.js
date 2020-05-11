import { gridSvgService } from "../components/grid/services/gridSvg.service"
import { globalConfig as gc } from "../config/global.config"
import { gridLinksBuilderService } from "../models/grid/services/grid-links/gridLinksBuilder.service"
import { gridReduceService } from "../models/grid/services/gridReduce.service"
import { globalResetsService } from "./globalResets.service"
import { ZoomDimensionAdjust } from "./zoom-dimensions/ZoomDimensionAdjust"
import { linkNameHelper } from "../models/grid/helpers/link-attributes/linkName.helper"

const zoomService = {
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

        gc.zoomLevel += gc.zoomDiff
        this.zoomDimensionAdjust.zoomIn(gc)
       
        gc.arrowLineWidth += 2
        gc.droppointDimension += 10

        gc.arrowPointerWidth += 5
        gc.arrowPointerHeight += 5

        recalculateRebuildServices()
    },
    zoomOut() {
        if (this.disableZoomOut()) return

        gc.zoomLevel -= gc.zoomDiff
        this.zoomDimensionAdjust.zoomOut(gc)
        
        gc.arrowLineWidth -= 2
        gc.droppointDimension -= 10

        gc.arrowPointerWidth -= 5
        gc.arrowPointerHeight -= 5

        recalculateRebuildServices()
    },

    get zoomDimensionAdjust() {
        if (!this.zoomDimensionAdjuster)
            this.zoomDimensionAdjuster = new ZoomDimensionAdjust(gc.dimensionType)

        return this.zoomDimensionAdjuster
    }
}

function recalculateRebuildServices() {
    globalResetsService.reset

    gridReduceService.calculateGridSize()
    gridReduceService.increaseGrid()
    gridReduceService.reduceGrid()

    gridSvgService.calculateSvg()
    gridLinksBuilderService.buildLinks()

    gridArrowAttributesService.resetLeftTop()

    linkNameHelper.rearangeGridLinkNamesElements()
}

globalThis.zoomService = zoomService
export { zoomService }
