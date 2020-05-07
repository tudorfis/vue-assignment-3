import { gridModel } from "../../../models/grid/grid.model"
import { gridHistoryService } from "../../../models/grid/services/gridHistory.service"

import { gridLinksOperatorService } from "../../../models/grid/services/grid-links/gridLinksOperator.service"
import { gridLinksBuilderService } from "../../../models/grid/services/grid-links/gridLinksBuilder.service"

import { gridReduceService } from "../../../models/grid/services/gridReduce.service"
import { globalResetsService } from "../../../services/globalResets.service"
import { toolboxElementsEnum } from '../../toolbox/enum/toolboxElements.enum'
import { gridCellService } from "./gridCell.service"
import { gridSvgService } from "../services/gridSvg.service"

export const gridToolService = {
    deleteGridcell(position) {
        globalResetsService.reset()
        
        gridCellService.resetCell(position)
        gridReduceService.reduceGrid()
        
        gridSvgService.calculateSvg()

        gridLinksOperatorService.deleteAllLinks(position)
        gridLinksBuilderService.buildLinks()
        
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