import { gridDeleteService } from "../components/grid/services/gridDelete.service"
import { gridArrowService } from "../components/grid/services/gridArrow.service"
import { gridCellService } from "../components/grid/services/gridCell.service"
import { toolboxDragService } from "../components/toolbox/services/toolboxDrag.service"

export const globalResetsService = {
    reset() {
       gridArrowService.hideArrowConnector()
       gridDeleteService.hideArrowDelete()
       gridDeleteService.resetLeftTop()
    },
    resetGridView() {
        gridCellService.previousCellOperations()
        toolboxDragService.startedDrag = false
    },
    stopArrowDrag() {
        gridArrowService.stopDrag()
    }
}