import { gridCellService } from "../components/grid/services/gridcell.service"

export default {
    methods: {
        resetGridView(event) {
            gridCellService.removeClasses(['allowed-drop', 'not-allowed-drop'])
        }
    }
}