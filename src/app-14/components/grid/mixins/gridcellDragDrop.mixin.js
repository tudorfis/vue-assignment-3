import { gridCellService } from '../services/gridCell.service'
import { gridModel } from '../../../models/grid/grid.model';
import { toolboxDragService } from '../../toolbox/services/toolboxDrag.service';
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
        }
    },
    methods: {
        onDropGridCellElement(event) {
            if (!gridCellService.onDropBefore(event)) return

            if (this.dropppointDirection)
                this.onDropDoDroppoints()

            else if (this.allowDrop)
                this.onDropDoAllowDrop()
            
                console.log('aa')
            this.onDropAfter()
        },
        onDragoverGridCellElement(event) {
            if (this.position === toolboxDragService.dragPosition) return

            const gridcell = this.$refs.gridcell;
            this.onDragoverDoDroppoints(event, gridcell)
            this.handlePreviousCell(gridcell)
        },
        onDropBefore(event) {
            globalResetsService.reset()
    
            gridCellService.previousCellOperations()
            toolboxDragService.startedDrag = false
    
            if (toolboxDragService.isSameElement(event)) 
                return false;
            
            return true
        },
        onDropAfter() {
            /** @TODO: remove temporary auto id, to simulate saved step */
            const cell = gridModel.model.cells[this.position]

            if (cell && cell.id === 0)
                gridModel.model.cells[this.position].id = Utils.randomNumber(1, 100)
            
            gridLinksService.buildLinks()
            gridHistoryService.saveState()
        },
        onDropDoDroppoints() {
            const newPosition = this.moveCellsByDroppoint()
            
            this.setCellActive(newPosition)
            this.removePreviousCell()

            gridLinksDroppointService.rearangeLinksByDirection(newPosition, this.dropppointDirection)
            
            const emptyPosition = gridLinksDroppointService.getEmptyPosition(newPosition, toolboxDragService.dragPosition)
            gridLinksService.deleteAllLinks(emptyPosition)

            return newPosition
        },
        onDropDoAllowDrop() {
            const newPosition = this.position
            const oldPosition = this.removePreviousCell()
            
            this.setCellActive(newPosition, oldPosition)
            this.addRowOrColEnd()
            gridLinksService.rearangeLinks(oldPosition, newPosition)
            
            if (gridLinksService.hasNoLinks(newPosition))
                gridLinksDroppointService.rearangeLinksByPaths(newPosition)
        },
        onDragoverDoDroppoints(event, gridcell) {
            const hasMiddleDroppoint = gridLinksDroppointService.hasMiddleDroppoint(this.position)
            const isDroppointMiddle = gridLinksService.hasNoLinks(toolboxDragService.dragPosition) ? hasMiddleDroppoint : false

            if (isDroppointMiddle)
                gridCellService.setMiddleDroppoint(gridcell)

            this.dropppointDirection = gridCellService.setDroppoints(event, gridcell, this.position)
            
            if (!this.dropppointDirection && !isDroppointMiddle) {
                gridcell.classList.add(`${!this.allowDrop ? 'not-' : ''}allowed-drop`)
                gridCellService.hideDropPoints(gridcell)
            }
            else if (gridcell.classList.contains('not-allowed-drop'))
                gridcell.classList.remove('not-allowed-drop')
        },
        handlePreviousCell(gridcell) {
            if (gridCellService.isDifferentCell(gridcell))
                gridCellService.previousCellOperations();

            gridCellService.saveActiveCell(gridcell);
        },
        removePreviousCell() {
            if (!toolboxDragService.dragGridcell) return
                
            gridCellService.resetCell(toolboxDragService.dragGridcell);
            return toolboxDragService.dragPosition
        },
        addRowOrColEnd() {
            if (gridAdjustService.nearColEnd(this.position))
                gridAdjustService.addColumnAtEnd()

            if (gridAdjustService.nearRowEnd(this.position))
                gridAdjustService.addRowAtEnd()
        },
        setCellActive(newPosition, oldPosition) {
            const cellObj = { is: 1, type: toolboxDragService.dragType }

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