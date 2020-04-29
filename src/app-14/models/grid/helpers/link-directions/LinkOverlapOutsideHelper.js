
class LinkOverlapOutsideHelper {
    constructor(query) {
        this.isUpLeftCorner = query.isUpLeftCorner
        this.isUpRightCorner = query.isUpRightCorner
        this.isDownLeftCorner = query.isDownLeftCorner
        this.isDownRightCorner = query.isDownRightCorner

        this.isUpCells = query.isUpCells
        this.isRightCells = query.isRightCells
        this.isLeftCells = query.isLeftCells
        this.isDownCells = query.isDownCells

        this.isUpCellsAfter = query.isUpCellsAfter
        this.isRightCellsAfter = query.isRightCellsAfter
        this.isLeftCellsAfter = query.isLeftCellsAfter
        this.isDownCellsAfter = query.isDownCellsAfter
    }
}

export { LinkOverlapOutsideHelper }
