import { gridModel } from '../../../models/grid/grid.model';
import { gridLinksBuilderService } from '../../../models/grid/services/grid-links/gridLinksBuilder.service';
import { gridLinksDroppointService } from '../../../models/grid/services/grid-links/gridLinksDroppoints.service';
import { gridLinksOperatorService } from '../../../models/grid/services/grid-links/gridLinksOperator.service';
import { gridAdjustService } from '../../../models/grid/services/gridAdjust.service';
import { gridHistoryService } from '../../../models/grid/services/gridHistory.service';
import { gridReduceService } from '../../../models/grid/services/gridReduce.service';
import { globalResetsService } from '../../../services/globalResets.service';
import { Utils } from '../../../utils/utils';
import { toolboxDragService } from '../../toolbox/services/toolboxDrag.service';
import { gridCellService } from '../services/gridCell.service';
import { gridSvgService } from '../services/gridSvg.service';

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
        onDropGridCellElement() {
            this.onDropBefore()

            if (this.dropppointDirection)
                this.onDropDoDroppoints()

            else if (this.allowDrop)
                this.onDropDoAllowDrop()
            
            this.onDropAfter()
        },
        onDropBefore() {
            globalResetsService.reset()
    
            gridCellService.previousCellOperations()
            toolboxDragService.startedDrag = false
        },
        onDropDoDroppoints() {
            const oldPosition = toolboxDragService.dragPosition
            const newPosition = gridCellService.moveCellsByDroppointDirection(this.dropppointDirection, this.position)

            gridCellService.setCellActive(newPosition)
            const emptyDroppointPosition = gridLinksDroppointService.getEmptyPositionAfterDroppoint(newPosition, oldPosition)
            
            if (!emptyDroppointPosition) 
                gridCellService.removePreviousCell()

            else {
                !gridModel.model.cells[emptyDroppointPosition].is ?
                    gridLinksOperatorService.deleteAllLinks(emptyDroppointPosition) :
                    gridLinksOperatorService.moveLinksToNewPosition(emptyDroppointPosition, newPosition)

                gridCellService.resetCell(emptyDroppointPosition)
            }

            gridLinksDroppointService.setDroppointLinksByDirection(newPosition, this.dropppointDirection)
        },
        onDropDoAllowDrop() {
            const newPosition = this.position
            const oldPosition = gridCellService.removePreviousCell()

            const isNearColOrRowEnd = gridAdjustService.isNearColOrRowEnd(newPosition)
            
            if (isNearColOrRowEnd) {
                gridAdjustService.addRowOrColEnd(newPosition)
                gridSvgService.calculateSvg()
            }

            gridCellService.setCellActive(newPosition, oldPosition)
            gridLinksOperatorService.rearangeLinks(oldPosition, newPosition)
            
            gridLinksDroppointService.setDroppointLinksByMiddle(newPosition)
            
            if (!gridLinksOperatorService.hasNoLinks(newPosition))
                gridLinksOperatorService.deleteAllLinks(oldPosition)
            
            if (!isNearColOrRowEnd) {
                gridReduceService.reduceGrid()
                gridSvgService.calculateSvg()
            }
        },
        onDropAfter() {
            /** @TODO: remove temporary auto id, to simulate saved step */
            const cell = gridModel.model.cells[this.position]

            if (cell && cell.id === 0)
                gridModel.model.cells[this.position].id = Utils.randomNumber(1, 100)
            
            gridLinksBuilderService.buildLinks()
            gridHistoryService.saveState()
        },

        onDragoverGridCellElement(event) {
            if (this.position === toolboxDragService.dragPosition) return

            this.onDragoverSetDroppoints(event, this.$refs.gridcell)
            this.onDragoverSetActiveInactive(this.$refs.gridcell)
            this.onDragoverResetPreviousGridcell(this.$refs.gridcell)
        },
        onDragoverSetDroppoints(event, gridcell) {
            const newPosition = this.position
            const oldPosition = toolboxDragService.dragPosition

            this.isDroppointMiddle = gridLinksDroppointService.hasDroppointMiddle(newPosition, oldPosition)

            if (this.isDroppointMiddle) {
                gridCellService.showMiddleDroppoint(gridcell)
                return
            }

            const droppointResult = gridCellService.getDroppointDirectionAndDisplay(event, gridcell, newPosition)
            this.dropppointDirection = droppointResult.droppointDirection

            if (this.dropppointDirection)
                gridcell.__vue__.$data.droppointsDisplay = droppointResult.droppointsDisplay
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