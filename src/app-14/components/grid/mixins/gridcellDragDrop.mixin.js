import { gridcellOperationsService } from '../services/gridcellOperations.service'
import { dragElementsService } from '../../../services/dragElements.service'
import { gridModel } from '../../../models/grid/grid.model';
import { VueUtils } from '../../../utils/vue.utils'

export default {
    props: ['position', 'cell'],
    data() {
        return {
            is: this.cell.is,
            type: this.cell.type,
            droppointsDisplay: false,
            dropppointInfo: ''
        }
    },
    computed: {
        allowDrop() {
            return !this.cell.is;
        }
    },
    methods: {
        onDrop() {
            gridcellOperationsService.previousCellOperations()
            if (this.isSameGrid()) return;

            if (this.dropppointInfo) {
                const newPosition = this.moveCellsByDroppoint()

                this.setCellActive(newPosition)
                this.removePreviousCell(newPosition)
            } 
            
            else if (this.allowDrop) {
                this.setCellActive()
                this.addRowOrColEnd()

                const oldPosition = this.removePreviousCell(this.position) 
                gridModel.regenerateLinkPath(oldPosition, this.position)
            }

             /** @TODO: build the functionality to change 
             * arrows and links if it's between a straight line */
        },
        onDragover(event) {
            if (this.isSameGrid()) return;

            const gridCell = this.$refs.gridcell;

            this.dropppointInfo = gridcellOperationsService.setDroppoints(event, gridCell, this.position)

            if (!this.dropppointInfo) {
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
        removePreviousCell(newPosition) {
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

            if (this.dropppointInfo === 'bottom') {
                position = gridModel.getPositionDiff(this.position, 1, 0)
                gridModel.spliceRows(position)
            }
    
            else if (this.dropppointInfo === 'top') {
                position = gridModel.getPositionDiff(this.position, 0, 0)
                gridModel.spliceRows(position)
            }
    
            if (this.dropppointInfo === 'right') {
                position = gridModel.getPositionDiff(this.position, 0, 1)
                gridModel.spliceCols(position)
            }
    
            else if (this.dropppointInfo === 'left') {
                position = gridModel.getPositionDiff(this.position, 0, 0)
                gridModel.spliceCols(position)
            }

            return position
        }
    }
}