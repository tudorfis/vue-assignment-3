import { gridArrowConnectorService } from "../components/grid/services/gridArrowConnector.service"
import { gridCellService } from "../components/grid/services/gridCell.service"
import { gridArrowAttributesService } from "../components/grid/services/gridArrowAttributes.service"
import { toolboxDragService } from "../components/toolbox/services/toolboxDrag.service"
import { linkNameHelper } from "../models/grid/helpers/link-attributes/linkName.helper"

export const globalResetsService = {
    reset() {
       gridArrowConnectorService.hideArrowConnector()
       gridArrowAttributesService.hideArrowAttributes()
       gridArrowAttributesService.resetLeftTop()
    },
    resetGridView() {
        gridCellService.previousCellOperations()
        toolboxDragService.startedDrag = false
        linkNameHelper.rearangeGridLinkNamesElements()
    },
    stopArrowDrag() {
        gridArrowConnectorService.stopDrag()
    }
}