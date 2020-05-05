
import { DimensionsConfigEnum } from "../../config/dimensions/DimensionsConfigEnum"
import { ZoomDimensionAdjustSquare } from "./ZoomDimensionAdjustSquare"
import { ZoomDimensionAdjustRectangular } from "./ZoomDimensionAdjustRectangular"

class ZoomDimensionAdjust {
    constructor(dimensionType) {
        switch (dimensionType) {
            case DimensionsConfigEnum.SQUARE:
                this.adjuster = new ZoomDimensionAdjustSquare()
                break

            case DimensionsConfigEnum.RECTANGULAR:
                this.adjuster = new ZoomDimensionAdjustRectangular()
                break
        }
    }
    zoomIn(config) {
        if (!this.adjuster) return
        this.adjuster.zoomIn(config)
    }
    zoomOut(config) {
        if (!this.adjuster) return
        this.adjuster.zoomOut(config)
    }
}

export { ZoomDimensionAdjust }