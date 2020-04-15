import { gridDeleteService } from "../components/grid/services/gridDelete.service"
import { gridArrowService } from "../components/grid/services/gridArrow.service"
import { gridOperationsService } from "../components/grid/services/gridOperations.service"
import { toolboxService } from "../components/toolbox/services/toolbox.service"

export const globalResetsService = {
    reset() {
       gridArrowService.hideArrowConnector()
       gridDeleteService.hideArrowDelete()
       gridDeleteService.resetLeftTop()
    },
    resetGridView() {
        gridOperationsService.previousCellOperations()
        toolboxService.startedDrag = false
    },
    stopArrowDrag() {
        gridArrowService.stopDrag()
    }
}