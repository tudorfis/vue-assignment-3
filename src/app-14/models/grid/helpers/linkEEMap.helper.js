
import { globalConfig } from "../../../config/global.config"
import { Utils } from "../../../utils/utils"
import { LinkHelper } from "./link.helper"

class LinkEntryExitPointsMapHelper {
    get eeMap() {
        return this.entryExitPointsMap
    }
    set eeMap(entryExitPointsMap) {
        this.entryExitPointsMap = entryExitPointsMap
    }
    constructor() {
        this.resetEEMap()

        const eeMapItemDirectionBlueprint = {
            out: {},
            in: {},
            total: 0
        }

        this.eeMapItemBlueprint = {
            up: Utils.deepclone(eeMapItemDirectionBlueprint),
            down: Utils.deepclone(eeMapItemDirectionBlueprint),
            right: Utils.deepclone(eeMapItemDirectionBlueprint),
            left: Utils.deepclone(eeMapItemDirectionBlueprint)
        }
    }
    resetEEMap() {
        this.eeMap = {}
    }
    createEEDifferenceForArrow(lh, direction) {
        this.createEEMapItemIfItDoesntExist(lh.link2)

        const eeMap = this.eeMap[lh.link2][LinkHelper.getOpositeDirection(direction)]
        eeMap.in[lh.link1] = ++eeMap.total

        return this.getDiffByPoint(eeMap.total) || 0
    }
    createEEDifferenceForPath(lh, direction) {
        this.createEEMapItemIfItDoesntExist(lh.link1)

        const eeMap = this.eeMap[lh.link1][direction]
        eeMap.out[lh.link2] = ++eeMap.total

        return this.getDiffByPoint(eeMap.total) || 0
    }
    createEEMapItemIfItDoesntExist(link) {
        if (!this.eeMap[link])
            this.eeMap[link] = Utils.deepclone(this.eeMapItemBlueprint)
    }
    getDiffByPoint(pointNr) {
        /** always returns 0 to go 
         * in/out from the same point
         * might require to have lines go 
         * in/out multiple entry/exit points */
        return 0

        if (pointNr > 8) return 0

        const diff = globalConfig.arrowPointerHeight * Math.floor(pointNr / 2)

        return (pointNr % 2) ? -diff : diff
    }
}

const linkEEMapHelper = new LinkEntryExitPointsMapHelper()
globalThis.linkEEMapHelper = linkEEMapHelper

export default linkEEMapHelper
