import { gridOperationsService } from '../services/gridOperations.service'
import { dragElementsService } from '../../../services/dragElements.service'
import { gridModel } from '../../../models/grid/grid.model';
import { VueUtils } from '../../../utils/vue.utils'
import { toolboxService } from '../../toolbox/services/toolbox.service';
import { Utils } from '../../../utils/utils';
import { globalResetsService } from '../../../services/globalResets.service';
import { gridAdjustService } from '../../../models/grid/services/gridAdjust.service';
import { gridHistoryService } from '../../../models/grid/services/gridHistory.service';
import { gridIOservice } from '../../../models/grid/services/gridIO.service';
import { gridLinksService } from '../../../models/grid/services/gridLinks.service';
import { gridLinksDroppointService } from '../../../models/grid/services/gridLinksDroppoints.service';

export default {
    props: ['position', 'cell'],
    data() {
        return {
            is: this.cell.is,
            type: this.cell.type,
            droppointsDisplay: false,
            dropppointDirection: ''
        }
    },
    computed: {
        allowDrop() {
            return !this.cell.is;
        },
        isInsideCell() {
            return toolboxService.isInsideCell
        }
    },
    methods: {
        onDropGridCellElement(event) {
            this.onDropBefore(event)
            let oldPosition, newPosition

            if (this.dropppointDirection)
                this.onDropDoDroppoints(newPosition)

            else if (this.allowDrop)
                this.onDropDoAllowDrop(newPosition, oldPosition)
            
            this.onDropAfter(newPosition)
        },
        onDragoverGridCellElement(event) {
            if (this.position === toolboxService.oldPosition) return

            const gridCell = this.$refs.gridcell;
            this.onDragoverDoDroppoints(event, gridCell)
            this.handlePreviousCell(gridCell)
        },
        onDropBefore(event) {
            globalResetsService.reset()

            gridOperationsService.previousCellOperations()
            toolboxService.startedDrag = false

            if (dragElementsService.isSameElement(event.target)) return;
        },
        onDropAfter(newPosition) {
            /** @TODO: remove temporary auto id, to simulate saved step */
            const newCell = gridModel.model.cells[newPosition]
            if (newCell && newCell.id === 0)
            gridModel.model.cells[newPosition].id = Utils.randomNumber(1, 100)
            
            gridLinksService.buildLinks()
            gridHistoryService.saveState()
        },
        onDropDoDroppoints(newPosition) {
            newPosition = this.moveCellsByDroppoint()
            this.setCellActive(newPosition)
            this.removePreviousCell()

            gridLinksDroppointService.rearangeLinksByDirection(newPosition, this.dropppointDirection)
            
            const emptyPosition = gridLinksDroppointService.getEmptyPosition(newPosition, toolboxService.oldPosition)
            gridLinksService.deleteAllLinks(emptyPosition)
        },
        onDropDoAllowDrop(newPosition, oldPosition) {
            newPosition = this.position
            oldPosition = this.removePreviousCell()
            
            this.setCellActive(newPosition, oldPosition)
            this.addRowOrColEnd()
            gridLinksService.rearangeLinks(oldPosition, newPosition)
            
            if (gridLinksService.hasNoLinks(newPosition))
                gridLinksDroppointService.rearangeLinksByPaths(newPosition)
        },
        onDragoverDoDroppoints(event, gridCell) {
            const hasMiddleDroppoint = gridLinksDroppointService.hasMiddleDroppoint(this.position)
            const isDroppointMiddle = gridLinksService.hasNoLinks(toolboxService.oldPosition) ? hasMiddleDroppoint : false

            if (isDroppointMiddle)
                gridOperationsService.setMiddleDroppoint(gridCell)

            this.dropppointDirection = gridOperationsService.setDroppoints(event, gridCell, this.position)
            
            if (!this.dropppointDirection && !isDroppointMiddle) {
                gridCell.classList.add(`${!this.allowDrop ? 'not-' : ''}allowed-drop`)
                gridOperationsService.hideDropPoints(gridCell)
            }
            else if (gridCell.classList.contains('not-allowed-drop'))
                gridCell.classList.remove('not-allowed-drop')
        },
        handlePreviousCell(gridCell) {
            if (gridOperationsService.isDifferentCell(gridCell))
                gridOperationsService.previousCellOperations();

            gridOperationsService.saveActiveCell(gridCell);
        },
        removePreviousCell() {
            if (!dragElementsService.insideCell) return
                
            const dragElement = dragElementsService.previousDragElement;

            const gridcell = VueUtils.traverseByRef(dragElement.__vue__, 'gridcell');
            gridOperationsService.resetCell(gridcell);

            const oldPosition = gridcell.__vue__.position
            return oldPosition
        },
        addRowOrColEnd() {
            if (gridAdjustService.nearColEnd(this.position))
                gridAdjustService.addColumnAtEnd()

            if (gridAdjustService.nearRowEnd(this.position))
                gridAdjustService.addRowAtEnd()
        },
        setCellActive(newPosition, oldPosition) {
            const cellObj = { is: 1, type: dragElementsService.activeDragElementType }

            const oldCell = gridModel.model.cells[oldPosition]
            if (oldCell && oldCell.id) cellObj.id = oldCell.id

            gridIOservice.setCell(newPosition, cellObj)
        },
        moveCellsByDroppoint() {
            let position

            if (this.dropppointDirection === 'down') {
                position = gridModel.getPositionDiff(this.position, 1, 0)
                gridAdjustService.spliceRows(position)
            }

            else if (this.dropppointDirection === 'up') {
                position = gridModel.getPositionDiff(this.position, 0, 0)
                gridAdjustService.spliceRows(position)
            }

            if (this.dropppointDirection === 'right') {
                position = gridModel.getPositionDiff(this.position, 0, 1)
                gridAdjustService.spliceCols(position)
            }

            else if (this.dropppointDirection === 'left') {
                position = gridModel.getPositionDiff(this.position, 0, 0)
                gridAdjustService.spliceCols(position)
            }

            return position
        }
    }
}