import { globalResetsService } from "../../../services/globalResets.service"
import { gridCellService } from "./gridCell.service"
import { gridLinksService } from "../../../models/grid/services/gridLinks.service"
import { gridHistoryService } from "../../../models/grid/services/gridHistory.service"
import { toolboxElementsEnum } from '../../toolbox/enum/toolboxElements.enum'
import { gridModel } from "../../../models/grid/grid.model"
import { gridReduceService } from "../../../models/grid/services/gridReduce.service"

export const gridToolService = {
    deleteGridcell(position) {
        globalResetsService.reset()

        gridCellService.resetCell(position)
        gridReduceService.reduceGrid()
        
        gridLinksService.deleteAllLinks(position)
        gridLinksService.buildLinks()
        
        gridHistoryService.saveState()
    },
    editGridcell(position) {
        globalResetsService.reset()
        
        const id = gridModel.getId(position)
        const type = gridModel.getType(position)

        switch (type) {
            case toolboxElementsEnum.SEND_EMAIL:
            $('#sendEmailModal').modal();
            break;
            
            case toolboxElementsEnum.SEND_SMS:
            $('#sendSmsModal').modal();
            break;

            case toolboxElementsEnum.ADD_REMOVE_TAG:
            $('#addRemoveTagsModal').modal();
            break;
            
            case toolboxElementsEnum.SUBSCRIBE_LIST:
            $('#subscribeListModal').modal();
            break;
            
            case toolboxElementsEnum.SUBSCRIBE_SEQUENCE:
            $('#subscribeSequenceModal').modal();
            break;
            
            case toolboxElementsEnum.AUTOMATION:
            $('#automationModal').modal();
            break;
            
            case toolboxElementsEnum.SPLIT:
            $('#splitModal').modal();
            break;
            
            case toolboxElementsEnum.GO_TO:
            $('#goToModal').modal();
            break;
            
            case toolboxElementsEnum.WAIT:
            $('#waitModal').modal();
            break;
            
        }
    }
}