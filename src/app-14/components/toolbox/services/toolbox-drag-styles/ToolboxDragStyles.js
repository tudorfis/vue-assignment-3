import { DimensionsConfigEnum } from "../../../../config/dimensions/DimensionsConfigEnum"
import { ToolboxDragStylesSquare } from "./ToolboxDragStylesSquare"
import { ToolboxDragStylesRectangular } from "./ToolboxDragStylesRectangular"

class ToolboxDragStyles {
    constructor(dimensionType) {
        switch (dimensionType) {
            case DimensionsConfigEnum.SQUARE:
                this.handler = new ToolboxDragStylesSquare()
                break

            case DimensionsConfigEnum.RECTANGULAR:
                this.handler = new ToolboxDragStylesRectangular()
                break
        }
    }
    setNewStyles(element, config) {
        if (!this.handler) return

        this.handler.setNewStyles(element, config)
    }
}

export { ToolboxDragStyles }
