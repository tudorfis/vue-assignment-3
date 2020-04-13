import { gridDeleteService } from "../components/grid/services/gridDelete.service"
import { gridArrowService } from "../components/grid/services/gridArrow.service"

export const globalResetsService = {
    reset() {
       gridArrowService.hideArrowConnector()
       gridDeleteService.hideArrowDelete()
       gridDeleteService.resetLeftTop()
    }
}