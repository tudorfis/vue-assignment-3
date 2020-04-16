import { gridCellService } from '../services/gridCell.service'
import { gridModel } from '../../../models/grid/grid.model';
import { toolboxDragService } from '../../toolbox/services/toolboxDrag.service';
import { Utils } from '../../../utils/utils';
import { globalResetsService } from '../../../services/globalResets.service';
import { gridAdjustService } from '../../../models/grid/services/gridAdjust.service';
import { gridHistoryService } from '../../../models/grid/services/gridHistory.service';
import { gridLinksService } from '../../../models/grid/services/gridLinks.service';
import { gridLinksDroppointService } from '../../../models/grid/services/gridLinksDroppoints.service';
import { gridReduceService } from '../../../models/grid/services/gridReduce.service';

export default {
    props: ['position'],
    data() {
        return {
            droppointsDisplay: false,
            dropppointDirection: '',
            isDroppointMiddle: false
        }
    },
    computed: {
        allowDrop() {
            const cell = gridModel.model.cells[this.position]
            return cell && !cell.is;
        }
    },
    methods: {
        onDropGridCellElement(event) {
            if (!this.onDropBefore(event)) return

            if (this.dropppointDirection)
                this.onDropDoDroppoints()

            else if (this.allowDrop)
                this.onDropDoAllowDrop()
            
            this.onDropAfter()
        },
        onDropBefore(event) {
            globalResetsService.reset()
    
            gridCellService.previousCellOperations()
            toolboxDragService.startedDrag = false
    
            if (toolboxDragService.isSameElement(event)) 
                return false;
            
            return true
        },
        onDropDoDroppoints() {
            const newPosition = gridCellService.moveCellsByDroppointDirection(this.dropppointDirection, this.position)
            
            gridCellService.setCellActive(newPosition)
            gridCellService.removePreviousCell()

            gridLinksDroppointService.rearangeLinksByDirection(newPosition, this.dropppointDirection)
            
            const emptyPosition = gridLinksDroppointService.getEmptyPosition(newPosition, toolboxDragService.dragPosition)
            gridLinksService.deleteAllLinks(emptyPosition)

            return newPosition
        },
        onDropDoAllowDrop() {
            const newPosition = this.position
            const oldPosition = gridCellService.removePreviousCell()
            
            gridAdjustService.addRowOrColEnd(newPosition)
            gridCellService.setCellActive(newPosition, oldPosition)
            gridLinksService.rearangeLinks(oldPosition, newPosition)
            
            if (gridLinksService.hasNoLinks(newPosition))
                gridLinksDroppointService.rearangeLinksByPaths(newPosition)
            
            gridReduceService.reduceGrid()
        },
        onDropAfter() {
            /** @TODO: remove temporary auto id, to simulate saved step */
            const cell = gridModel.model.cells[this.position]

            if (cell && cell.id === 0)
                gridModel.model.cells[this.position].id = Utils.randomNumber(1, 100)
            
            gridLinksService.buildLinks()
            gridHistoryService.saveState()
        },

        onDragoverGridCellElement(event) {
            if (this.position === toolboxDragService.dragPosition) return

            this.onDragoverSetDroppoints(event, this.$refs.gridcell)
            this.onDragoverSetActiveInactive(this.$refs.gridcell)
            this.onDragoverResetPreviousGridcell(this.$refs.gridcell)
        },
        onDragoverSetDroppoints(event, gridcell) {
            const hasMiddleDroppoint = gridLinksDroppointService.hasMiddleDroppoint(this.position)
            this.isDroppointMiddle = gridLinksService.hasNoLinks(toolboxDragService.dragPosition) ? hasMiddleDroppoint : false

            if (this.isDroppointMiddle)
                gridCellService.setMiddleDroppointActive(gridcell)

            this.dropppointDirection = gridCellService.getDroppointDirection(event, gridcell, this.position)
        },
        onDragoverSetActiveInactive(gridcell) {
            if (!this.dropppointDirection && !this.isDroppointMiddle) {
                gridcell.classList.add(`${!this.allowDrop ? 'not-' : ''}allowed-drop`)
                gridCellService.hideDroppoints(gridcell)
            }
            else if (gridcell.classList.contains('not-allowed-drop'))
                gridcell.classList.remove('not-allowed-drop')
        },
        onDragoverResetPreviousGridcell(gridcell) {
            if (gridCellService.isDifferentCell(gridcell))
                gridCellService.previousCellOperations();

            gridCellService.savePreviousCell(gridcell);
        }
    }
}