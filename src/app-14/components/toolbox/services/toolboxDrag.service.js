
import { gridModel } from "../../../models/grid/grid.model"
import { globalResetsService } from "../../../services/globalResets.service"
import { toolboxDragStylesService } from "./toolboxDragStyles.service"

export const toolboxDragService = {
    dragType: '',
    dragPosition: null,
    dragGridcell: null,
    startedDrag: false,

    startDrag(event, dragType) {
        globalResetsService.reset()
        
        this.setDragTypeProperties(dragType, event)
        this.setDragGridcell()

        if (!this.dragGridcell) {
            this.setDragStyleForToolbox(event.target)
            return
        }

        this.hideGridcellElementIcons()
    },
    setDragTypeProperties(dragType, event) {
        this.dragType = dragType
        this.dragPosition = gridModel.getPositionByEventTarget(event)
    },
    setDragGridcell() {
        const vm = toolboxDragService
        this.dragGridcell = null

        Array.prototype.forEach.call(document.getElementsByClassName('gridcell'), function(el) { 
            if (el.__vue__.position === vm.dragPosition) {

                vm.dragGridcell = el
                return
            }
        })
    },
    setDragStyleForToolbox(element) {
        toolboxDragStylesService.setDragStylesToolbox(element)

        setTimeout(function(){
            toolboxDragStylesService.resetDragStylesToolbox(element)
        }, 0)
    },
    hideGridcellElementIcons() {
        const gridcellelement = this.dragGridcell ?
            this.dragGridcell.__vue__.$refs.gridcellelement : null

        if (gridcellelement)
            gridcellelement.showOtherIcons = false
    }
}