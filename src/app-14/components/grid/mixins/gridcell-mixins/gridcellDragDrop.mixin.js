import { gridcellOperationsService } from '../../services/gridcellOperations.service'
import { dragElementsService } from '../../../../services/dragElements.service'
import { gridModel } from '../../../../models/grid/grid.model';
import { VueUtils } from '../../../../utils/vue.utils'
import { toolboxService } from '../../../toolbox/services/toolbox.service';
import { gridArrowService } from '../../services/gridArrow.service';

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
        onDrop() {
            gridArrowService.hideArrowConnector()
            gridcellOperationsService.previousCellOperations()

            if (this.isSameGrid()) return;

            let oldPosition, newPosition
            if (this.dropppointDirection) {
                newPosition = this.moveCellsByDroppoint()
                this.setCellActive(newPosition)
                this.removePreviousCell()
                gridModel.rearangeLinksAfterDroppoint(newPosition, this.dropppointDirection)
            }

            else if (this.allowDrop) {
                newPosition = this.position
                this.setCellActive()
                this.addRowOrColEnd()
                oldPosition = this.removePreviousCell()
                gridModel.rearangeLinks(oldPosition, newPosition)

                if (gridModel.hasNoLinks(this.position))
                    gridModel.rearangeLinksOnSinglePath(this.position)
            }

            gridModel.buildLinks()
        },
        onDragover(event) {
            if (this.isSameGrid()) return;

            const gridCell = this.$refs.gridcell;

            this.dropppointDirection = gridcellOperationsService.setDroppoints(event, gridCell, this.position)

            if (!this.dropppointDirection) {
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
        isSameGrid() {
            const sameElement = dragElementsService.isSameElement(event.target);
            if (sameElement) return true;

            return false
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
        setCellActive(position) {
            position = position || this.position
            gridModel.setCell(position, {
                is: 1,
                type: dragElementsService.activeDragElementType
            })
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