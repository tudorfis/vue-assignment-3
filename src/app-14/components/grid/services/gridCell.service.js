import { gridModel } from "../../../models/grid/grid.model"
import { gridMouseDroppointsService } from "../../../models/grid/services/gridMouseDroppoints.service"

export const droppointsDisplayBlueprint = {
    showUp: false,
    showRight: false,
    showDown: false,
    showLeft: false,
    showMiddle: false
}

export const gridCellService = {
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
    isDifferentCell(gridcell) {
        return gridcell.__vue__._uid !== this.activeUid
    },
    previousCellOperations() {
        this.hideDropPoints()
        this.removeClasses(['allowed-drop', 'not-allowed-drop'])
    },
    hideDropPoints(gridcell) {
        gridcell = gridcell || this.activeCell
        
        if (gridcell && gridcell.__vue__)
            gridcell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint}
    },
    saveActiveCell(gridcell) {
        this.activeCell = gridcell
        this.activeUid = gridcell.__vue__._uid
    },
    resetCell(gridcell) {
        gridModel.model.totalSteps--
        gridcell.__vue__.$options.propsData['cell'].is = false
    },
    setMiddleDroppoint(gridcell) {
        gridcell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint, showMiddle: true}
    },
    setDroppoints(event, gridcell, position) {
        const isCellBellow = gridMouseDroppointsService.hasElementBellow(position)
        const isMouseOnBottom = gridMouseDroppointsService.isMouseOnBottomOutside(event, gridcell)

        if (isCellBellow && isMouseOnBottom) {
            gridcell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint, showDown: true}
            return 'down'
        }

        const isCellAbove = gridMouseDroppointsService.hasElementAbove(position)
        const isMouseOnTop = gridMouseDroppointsService.isMouseOnTopOutside(event, gridcell)

        if (isCellAbove && isMouseOnTop) {
            gridcell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint, showUp: true}
            return 'up'
        }

        const isCellRight = gridMouseDroppointsService.hasElementRight(position)
        const isMouseOnRight = gridMouseDroppointsService.isMouseOnRightOutside(event, gridcell)

        if (isCellRight && isMouseOnRight) {
            gridcell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint, showRight: true}
            return 'right'
        }

        const isCellLeft = gridMouseDroppointsService.hasElementLeft(position)
        const isMouseOnLeft = gridMouseDroppointsService.isMouseOnLeftOutside(event, gridcell)

        if (isCellLeft && isMouseOnLeft) {
            gridcell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint, showLeft: true}
            return 'left'
        }
        
        return ''
    },

    
    
}