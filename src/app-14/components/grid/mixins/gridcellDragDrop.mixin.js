import { gridcellOperationsService } from '../services/gridcellOperations.service'
import { dragElementsService } from '../../../services/dragElements.service'
import { gridModel } from '../../../models/grid.model';
import { VueUtils } from '../../../utils/vue.utils'
import { globalConfig } from '../../../config/global.config';

export default {
    props: ['position', 'cell'],
    data() {
        return {
            hasElement: this.cell.hasElement,
            gridElement: this.cell.gridElement,
            gridElementType: this.cell.gridElementType,
            droppointsDisplay: false,
            dropppointInfo: ''
        }
    },
    computed: {
        allowDrop() {
            return !this.cell.hasElement;
        }
    },
    methods: {
        onDrop(event) {
            gridcellOperationsService.previousCellOperations()

            if (this.isSameGrid()) return;

            if (this.dropppointInfo) {
                gridcellOperationsService.moveCellsByDroppoint(this.position, this.dropppointInfo)
            
                this.removePreviousCell()

                this.setCellActive(
                    this.getNextDropPosition())

            } else if (this.allowDrop) {
                this.setCellActive()

                this.addRowOrColEnd()
                this.removePreviousCell() 
            }
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
            }
        },
        addRowOrColEnd() {
            if (gridModel.nearColEnd(this.position))
            gridModel.addColumnEnd()

            if (gridModel.nearRowEnd(this.position))
            gridModel.addRowEnd()
        },
        setCellActive(position) {
            position = position || this.position

            gridModel.setCell(position, { 
                hasElement: true,
                gridElementType: dragElementsService.activeDragElementType
            })
        },
        handlePreviousCell(gridCell) {
            if (gridcellOperationsService.isDifferentCell(gridCell))
                gridcellOperationsService.previousCellOperations();

            gridcellOperationsService.saveActiveCell(gridCell);
        },
        getNextDropPosition() {
            if (this.dropppointInfo === 'right')
                return this.getNextDropPositionRight()

            if (this.dropppointInfo === 'bottom')
                return this.getNextDropPositionBottom()

            return this.position
        },
        getNextDropPositionRight() {
            const letter = this.position.split('')[0]
            const number = gridModel.getNumberByP(this.position)

            return `${letter}${number + 1}`
        },
        getNextDropPositionBottom() {
            const letterIndex = gridModel.getLetterIndexByP(this.position)
                
            const letter = globalConfig.alphabet[letterIndex]
            const number = gridModel.getNumberByP(this.position)

            return `${letter}${number}`
        }
    }
}