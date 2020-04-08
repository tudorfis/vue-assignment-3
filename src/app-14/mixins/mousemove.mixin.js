import { gridcellOperationsService } from "../components/grid/services/gridcellOperations.service"
import { gridArrowService } from "../components/grid/services/gridArrow.service"
import { toolboxService } from "../components/toolbox/services/toolbox.service"

export default {
    methods: {
        resetGridView() {
            gridcellOperationsService.previousCellOperations()
            toolboxService.startedDrag = false
        },
        stopArrowDrag() {
            gridArrowService.stopDrag()
        }
    }
}