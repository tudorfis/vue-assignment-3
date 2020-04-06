import { gridcellOperationsService } from "../components/grid/services/gridcellOperations.service"
import { gridArrowService } from "../components/grid/services/gridArrow.service"

export default {
    methods: {
        resetGridView() {
            gridcellOperationsService.previousCellOperations()
        },
        stopArrowDrag() {
            gridArrowService.stopDrag()
        }
    }
}