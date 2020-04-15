import { gridOperationsService } from "../components/grid/services/gridOperations.service"
import { gridArrowService } from "../components/grid/services/gridArrow.service"
import { toolboxService } from "../components/toolbox/services/toolbox.service"

export default {
    methods: {
        resetGridView() {
            gridOperationsService.previousCellOperations()
            toolboxService.startedDrag = false
        },
        stopArrowDrag() {
            gridArrowService.stopDrag()
        }
    }
}