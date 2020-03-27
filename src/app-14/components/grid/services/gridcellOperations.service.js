import { gridModel } from "../../../models/grid.model"
import { globalConfig } from "../../../config/global.config"

export const droppointsDisplayBlueprint = {
    showTop: false,
    showRight: false,
    showBottom: false,
    showLeft: false
}

export const gridcellOperationsService = {
    activeUid: null,
    activeCell: null,
    addClasses(classListArr = []) {
        this.handleAddingRemoving(classListArr, 'add')
    },
    removeClasses(classListArr = []) {
        this.handleAddingRemoving(classListArr, 'remove')
    },
    handleAddingRemoving(classListArr = [], method = '') {
        if (!this.activeCell) return

        for (const className of classListArr)
            this.activeCell.classList[method](className)
    },
    isDifferentCell(gridCell) {
        return gridCell.__vue__._uid !== this.activeUid
    },
    previousCellOperations() {
        this.hideDropPoints()
        this.removeClasses(['allowed-drop', 'not-allowed-drop'])
    },
    hideDropPoints(gridCell) {
        gridCell = gridCell || this.activeCell
        
        if (gridCell && gridCell.__vue__)
            gridCell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint}
    },
    saveActiveCell(gridCell) {
        this.activeCell = gridCell
        this.activeUid = gridCell.__vue__._uid
    },
    resetCell(gridCellElement) {
        gridCellElement.__vue__.$options.propsData['cell'].hasElement = false
    },
    setDroppoints(event, gridCell, position) {
        const isCellBellow = gridModel.hasElementBellow(position)
        const isMouseOnBottom = gridModel.isMouseOnBottomOutside(event, gridCell)

        if (isCellBellow && isMouseOnBottom) {
            gridCell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint, showBottom: true}
            return 'bottom'
        }

        const isCellAbove = gridModel.hasElementAbove(position)
        const isMouseOnTop = gridModel.isMouseOnTopOutside(event, gridCell)
  
        if (isCellAbove && isMouseOnTop) {
            gridCell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint, showTop: true}
            return 'top'
        }

        const isCellRight = gridModel.hasElementRight(position)
        const isMouseOnRight = gridModel.isMouseOnRightOutside(event, gridCell)

        if (isCellRight && isMouseOnRight) {
            gridCell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint, showRight: true}
            return 'right'
        }

        const isCellLeft = gridModel.hasElementLeft(position)
        const isMouseOnLeft = gridModel.isMouseOnLeftOutside(event, gridCell)

        if (isCellLeft && isMouseOnLeft) {
            gridCell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint, showLeft: true}
            return 'left'
        }
        
        return ''
    },
    moveCellsByDroppoint(position, dropppointInfo) {
        if (dropppointInfo === 'bottom') {
            gridModel.spliceRows(position)
        }

        else if (dropppointInfo === 'top') {
            const letterIndex = gridModel.getLetterIndexByP(position)
            const bellowLetter = globalConfig.alphabet[letterIndex - 2]
            const number = gridModel.getNumberByP(position)
            
            const splicePosition = `${bellowLetter}${number}`
            gridModel.spliceRows(splicePosition)
        }

        if (dropppointInfo === 'right') {
            gridModel.spliceCols(position)
        }

        else if (dropppointInfo === 'left') {
            const letter = position.split('')[0];
            const number = gridModel.getNumberByP(position);

            const splicePosition = `${letter}${number - 1}`
            gridModel.spliceCols(splicePosition)
        
        }
    }
}