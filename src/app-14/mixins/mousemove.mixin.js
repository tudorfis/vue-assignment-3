import { gridcellOperationsService } from "../components/grid/services/gridcellOperations.service"

export default {
    methods: {
        resetGridView() {
            gridcellOperationsService.previousCellOperations()
        }
    }
}