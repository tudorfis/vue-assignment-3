import { gridModel } from "../grid.model"
import { LinkDrawHelper } from "./linkDraw.helper"

const linkEEOverlappingHelper = {
    adjust(eeMapItem, linkDirection) {
        const outPositions = Object.keys(eeMapItem.out)
        if (outPositions.length !== 2) return
            
        switchHelperService.buildSwitchHelper({
            eeMapItem,
            linkDirection,
            position1: outPositions[0],
            position2: outPositions[1]
        })

        if (this.needsSwitch)
            eeMapItem = this.switcheeMapItemPositions(eeMapItem, 'out', outPositions[0], outPositions[1])

        return eeMapItem
    },
    get needsSwitch() {
        const leftRightEqualCol = switchHelper.isLeftOrRight && switchHelper.isEqualCol
        const upDownEqualRow = switchHelper.isUpOrDown && switchHelper.isEqualRow
        
        return switchHelper.isSmallerEE && (leftRightEqualCol || upDownEqualRow)
    },
    switcheeMapItemPositions(eeMapItem, type, position1, position2) {
        const lot = eeMapItem[type]

        const tempPosition = lot[position1]
        lot[position1] = lot[position2]
        lot[position2] = tempPosition
    }
}

const switchHelper = {
    isLeftOrRight: false,
    isUpOrDown: false,
    isSameCol: false,
    isSameRow: false,
    isSmallerEE: false,
}

const switchHelperService = {
    buildSwitchHelper(query) {
        this.buildSwitchHelperDirections(query.linkDirection)
        this.buildSwitchHelperEqualColRow(query.position1, query.position2)
        this.buildSwitchHelperSmallerEE(query.eeMapItem, query.position1, query.position2)
    },
    buildSwitchHelperDirections(linkDirection) {
        switchHelper.isLeftOrRight = LinkDrawHelper.leftOrRight(linkDirection)
        switchHelper.isUpOrDown = LinkDrawHelper.upOrDown(linkDirection)
    },
    buildSwitchHelperEqualColRow(position1, position2) {
        switchHelper.isEqualCol = gridModel.getCol(position1) === gridModel.getCol(position2)
        switchHelper.isEqualRow = gridModel.getRow(position1) === gridModel.getRow(position2)
    },
    buildSwitchHelperSmallerEE(eeMapItem, position1, position2) {
        switchHelper.isSmallerEE = eeMapItem.out[position1] < eeMapItem.out[position2]
    }
}

globalThis.linkEEOverlappingHelper = linkEEOverlappingHelper
export { linkEEOverlappingHelper }

