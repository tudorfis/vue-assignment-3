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
    hideDropPoints() {
        if (this.activeCell && this.activeCell.__vue__)
            this.activeCell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint}
    },
    saveActiveCell(gridCell) {
        this.activeCell = gridCell
        this.activeUid = gridCell.__vue__._uid
    },
    resetCell(gridCellElement) {
        gridCellElement.__vue__.$options.propsData['cell'].hasElement = false
    },
    setDroppoints(event, gridCell, position) {
        let dropppointInfo = ''

        const isMouseOnTop = gridModel.isMouseOnTopOutside(event, gridCell)
        const isCellAbove = gridModel.hasElementAbove(position)
  
        /**
         console.log(`
            isCellAbove=${isCellAbove}
            isMouseOnTop=${isMouseOnTop}
            bothTrue=${isCellAbove && isMouseOnTop}
        `)
        */

        if (isMouseOnTop && isCellAbove) {
            dropppointInfo = 'top'
            gridCell.__vue__.$data.droppointsDisplay = {...droppointsDisplayBlueprint, showTop: true}
        }
        
        /** @TODO: EXTEND FOR OTHER POINTS */
        
        return dropppointInfo
    },
    moveCellsByDroppoint(position, dropppointInfo) {
        if (dropppointInfo === 'top') {
            const letterIndex = gridModel.getLetterIndexByP(position)
            const bellowLetter = globalConfig.alphabet[letterIndex - 2]
            const number = gridModel.getNumberByP(position)
            
            const splicePosition = `${bellowLetter}${number}`

            // console.log(`position=${position} splicePosition=${splicePosition}`)

            gridModel.spliceRows(splicePosition)
        }

        /** @TODO: EXTEND FOR OTHER POINTS */
    }
}