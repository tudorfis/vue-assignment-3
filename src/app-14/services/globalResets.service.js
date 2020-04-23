import { gridArrowConnectorService } from "../components/grid/services/gridArrowConnector.service"
import { gridCellService } from "../components/grid/services/gridCell.service"
import { gridDeleteArrowService } from "../components/grid/services/gridDeleteArrow.service"
import { toolboxDragService } from "../components/toolbox/services/toolboxDrag.service"

export const globalResetsService = {
    reset() {
       gridArrowConnectorService.hideArrowConnector()
       gridDeleteArrowService.hideArrowDelete()
       gridDeleteArrowService.resetLeftTop()
    },
    resetGridView() {
        gridCellService.previousCellOperations()
        toolboxDragService.startedDrag = false
    },
    stopArrowDrag() {
        gridArrowConnectorService.stopDrag()
    }
}