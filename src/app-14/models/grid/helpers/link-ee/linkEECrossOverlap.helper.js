import { gridModel } from "../../grid.model"
import { LinkHelper } from "../link.helper"

const linkEECrossOverlapHelper = {
    adjust(eeMapItem, linkDirection) {
        this.adjustEEOut(eeMapItem, linkDirection)
        this.adjustEEIn(eeMapItem, linkDirection)
    },
    adjustEEOut(eeMapItem, linkDirection) {
        const outPositions = Object.keys(eeMapItem.out)
        if (outPositions.length !== 2) return
            
        switchHelperService.buildSwitchHelperEEOut({
            eeMapItem,
            linkDirection,
            position1: outPositions[0],
            position2: outPositions[1]
        })

        if (this.needsSwitch)
            this.switchEEMapItemPositions(eeMapItem, 'out', outPositions[0], outPositions[1])
    },
    adjustEEIn(eeMapItem, linkDirection) {
        const inPositions = Object.keys(eeMapItem.in)
        if (inPositions.length !== 2) return
            
        switchHelperService.buildSwitchHelperEEIn({
            eeMapItem,
            linkDirection,
            position1: inPositions[0],
            position2: inPositions[1]
        })

        if (this.needsSwitch)
            this.switchEEMapItemPositions(eeMapItem, 'in', inPositions[0], inPositions[1])
    },
    get needsSwitch() {
        const isRightLeftEqualCol = switchHelper.isLeftOrRight && switchHelper.isEqualCol
        const isDownUpEqualRow = switchHelper.isUpOrDown && switchHelper.isEqualRow
        
        return switchHelper.isSmallerEE && (isRightLeftEqualCol || isDownUpEqualRow)
    },
    switchEEMapItemPositions(eeMapItem, inOut, position1, position2) {
        const item = eeMapItem[inOut]

        const tempPosition = item[position1]
        item[position1] = item[position2]
        item[position2] = tempPosition
    }
}

const switchHelper = {
    isLeftOrRight: false,
    isUpOrDown: false,
    isSmallerEE: false,
}

const switchHelperService = {
    buildSwitchHelperEEOut(query) {
        this.buildSwitchHelperDirections(query.linkDirection)
        this.buildSwitchHelperEqualColRow(query.position1, query.position2)
        this.buildSwitchHelperSmallerEEOut(query.eeMapItem, query.position1, query.position2)
    },
    buildSwitchHelperEEIn(query) {
        this.buildSwitchHelperDirections(query.linkDirection)
        this.buildSwitchHelperEqualColRow(query.position1, query.position2)
        this.buildSwitchHelperSmallerEEIn(query.eeMapItem, query.position1, query.position2)
    },
    buildSwitchHelperDirections(linkDirection) {
        switchHelper.isLeftOrRight = LinkHelper.isLeftOrRight(linkDirection)
        switchHelper.isUpOrDown = LinkHelper.isUpOrDown(linkDirection)
    },
    buildSwitchHelperEqualColRow(position1, position2) {
        switchHelper.isEqualCol = gridModel.getCol(position1) === gridModel.getCol(position2)
        switchHelper.isEqualRow = gridModel.getRow(position1) === gridModel.getRow(position2)
    },
    buildSwitchHelperSmallerEEOut(eeMapItem, position1, position2) {
        switchHelper.isSmallerEE = eeMapItem.out[position1] < eeMapItem.out[position2]
    },
    buildSwitchHelperSmallerEEIn(eeMapItem, position1, position2) {
        switchHelper.isSmallerEE = eeMapItem.in[position1] < eeMapItem.in[position2]
    }
}

globalThis.linkEECrossOverlapHelper = linkEECrossOverlapHelper
export { linkEECrossOverlapHelper }
