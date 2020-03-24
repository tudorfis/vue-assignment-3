
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
            this.activeCell.classList[method](className);
    },
    isDifferentCell(gridCell) {
        return gridCell.__vue__._uid !== this.activeUid
    },
    previousCellOperations() {
        this.removeClasses(['allowed-drop', 'not-allowed-drop']);
    },
    saveActiveCell(gridCell) {
        this.activeCell = gridCell;
        this.activeUid = gridCell.__vue__._uid;
    },
    resetCell(gridCellElement) {
        gridCellElement.__vue__.$data.hasElement = false
    }
}