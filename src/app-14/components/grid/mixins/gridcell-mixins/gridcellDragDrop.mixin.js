import { gridcellOperationsService } from '../../services/gridcellOperations.service'
import { dragElementsService } from '../../../../services/dragElements.service'
import { gridModel } from '../../../../models/grid/grid.model';
import { VueUtils } from '../../../../utils/vue.utils'
import { toolboxService } from '../../../toolbox/services/toolbox.service';
import { gridArrowService } from '../../services/gridArrow.service';
import { Utils } from '../../../../utils/utils';

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
            gridArrowService.hideArrowConnector()
            gridcellOperationsService.previousCellOperations()
            toolboxService.startedDrag = false

            if (dragElementsService.isSameElement(event.target)) return;

            let oldPosition, newPosition
            if (this.dropppointDirection) {
                newPosition = this.moveCellsByDroppoint()
                this.setCellActive(newPosition)
                this.removePreviousCell()

                gridModel.rearangeLinksAfterDroppoint(newPosition, this.dropppointDirection)
                const emptyPosition = gridModel.getEmptyPositionForDroppoint(newPosition, toolboxService.oldPosition)
                gridModel.deleteAllLinks(emptyPosition)
            }

            else if (this.allowDrop) {
                newPosition = this.position
                oldPosition = this.removePreviousCell()
                
                this.setCellActive(newPosition, oldPosition)
                this.addRowOrColEnd()
                gridModel.rearangeLinks(oldPosition, newPosition)
                
                if (gridModel.hasNoLinks(newPosition))
                    gridModel.rearangeLinksOnSinglePath(newPosition)
            }
            
            /** @TODO: remove temporary auto id, to simulate saved step */
            const newCell = gridModel.model.cells[newPosition]
            if (newCell && newCell.id === 0)
            gridModel.model.cells[newPosition].id = Utils.randomNumber(1, 100)
            
            gridModel.buildLinks()
            gridModel.saveModel()
            
        },
        onDragoverGridCellElement(event) {
            if (this.position === toolboxService.oldPosition) return
            const gridCell = this.$refs.gridcell;

            const hasMiddleDroppoint = gridModel.hasMiddleDroppoint(this.position)
            const isDroppointMiddle = gridModel.hasNoLinks(toolboxService.oldPosition) ? hasMiddleDroppoint : false
            if (isDroppointMiddle) gridcellOperationsService.setMiddleDroppoint(gridCell)

            this.dropppointDirection = gridcellOperationsService.setDroppoints(event, gridCell, this.position)
            if (!this.dropppointDirection && !isDroppointMiddle) {
                gridCell.classList.add(`${!this.allowDrop ? 'not-' : ''}allowed-drop`)
                gridcellOperationsService.hideDropPoints(gridCell)
            }

            else if (gridCell.classList.contains('not-allowed-drop'))
                gridCell.classList.remove('not-allowed-drop')

            this.handlePreviousCell(gridCell)
        },
        handlePreviousCell(gridCell) {
            if (gridcellOperationsService.isDifferentCell(gridCell))
                gridcellOperationsService.previousCellOperations();

            gridcellOperationsService.saveActiveCell(gridCell);
        },
        removePreviousCell() {
            if (dragElementsService.insideCell) {
                const dragElement = dragElementsService.previousDragElement;

                const gridCellElement = VueUtils.traverseByRef(dragElement.__vue__, 'gridcell');
                gridcellOperationsService.resetCell(gridCellElement);

                const oldPosition = gridCellElement.__vue__.position
                return oldPosition
            }
        },
        addRowOrColEnd() {
            if (gridModel.nearColEnd(this.position))
                gridModel.addColumnAtEnd()

            if (gridModel.nearRowEnd(this.position))
                gridModel.addRowAtEnd()
        },
        setCellActive(newPosition, oldPosition) {
            const cellObj = { is: 1, type: dragElementsService.activeDragElementType }

            const oldCell = gridModel.model.cells[oldPosition]
            if (oldCell && oldCell.id) cellObj.id = oldCell.id

            gridModel.setCell(newPosition, cellObj)
        },
        moveCellsByDroppoint() {
            let position

            if (this.dropppointDirection === 'down') {
                position = gridModel.getPositionDiff(this.position, 1, 0)
                gridModel.spliceRows(position)
            }

            else if (this.dropppointDirection === 'up') {
                position = gridModel.getPositionDiff(this.position, 0, 0)
                gridModel.spliceRows(position)
            }

            if (this.dropppointDirection === 'right') {
                position = gridModel.getPositionDiff(this.position, 0, 1)
                gridModel.spliceCols(position)
            }

            else if (this.dropppointDirection === 'left') {
                position = gridModel.getPositionDiff(this.position, 0, 0)
                gridModel.spliceCols(position)
            }

            return position
        }
    }
}