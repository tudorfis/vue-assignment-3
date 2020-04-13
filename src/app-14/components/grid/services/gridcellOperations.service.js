import { gridModel } from "../../../models/grid/grid.model"

export const droppointsDisplayBlueprint = {
    showUp: false,
    showRight: false,
    showDown: false,
    showLeft: false,
    showMiddle: false
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
        gridModel.model.totalSteps--
        gridCellElement.__vue__.$options.propsData['cell'].is = false
    },
    setMiddleDroppoint(gridCell) {
        gridCell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint, showMiddle: true}
    },
    setDroppoints(event, gridCell, position) {
        const isCellBellow = gridModel.hasElementBellow(position)
        const isMouseOnBottom = gridModel.isMouseOnBottomOutside(event, gridCell)

        if (isCellBellow && isMouseOnBottom) {
            gridCell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint, showDown: true}
            return 'down'
        }

        const isCellAbove = gridModel.hasElementAbove(position)
        const isMouseOnTop = gridModel.isMouseOnTopOutside(event, gridCell)

        if (isCellAbove && isMouseOnTop) {
            gridCell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint, showUp: true}
            return 'up'
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
    
}