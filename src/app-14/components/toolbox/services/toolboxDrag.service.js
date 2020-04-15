
import { globalResetsService } from "../../../services/globalResets.service"
import { gridModel } from "../../../models/grid/grid.model"
import { toolboxDragStylesService } from "./toolboxDragStyles.service"

export const toolboxDragService = {
    startedDrag: false,
    dragGridcell: null,
    dragPosition: null,
    dragType: '',

    isSameElement(event) {
        const position = gridModel.getPositionByEventTarget(event)
        return position === this.dragPosition
    },
    startDrag(event, dragType) {
        globalResetsService.reset()

        this.dragType = dragType
        this.dragPosition = gridModel.getPositionByEventTarget(event)

        this.setDragGridcell()

        if (!this.dragGridcell) {
            toolboxDragStylesService.setDragStylesToolbox(event.target)
            setTimeout(function(){
                toolboxDragStylesService.resetDragStylesToolbox(event.target)
            }, 0)
            return
        }
    
        const gridcellelement = this.dragGridcell ?
            this.dragGridcell.__vue__.$refs.gridcellelement : null

        if (gridcellelement)
            gridcellelement.showOtherIcons = false
    },
    setDragGridcell() {
        toolboxDragService.dragGridcell = null
        Array.prototype.forEach.call(document.getElementsByClassName('gridcell'), function(el) { 
            if (el.__vue__.position === toolboxDragService.dragPosition) {
                toolboxDragService.dragGridcell = el
                return
            }
        })
    }
}