import { gridCellService } from "../components/grid/services/gridcell.service"

export default {
    methods: {
        resetGridView() {
            gridCellService.previousCellOperations()
        }
    }
}