
import { gridArrowConnectorService } from '../../../../components/grid/services/gridArrowConnector.service'
import { Utils } from '../../../../utils/utils'
import { gridModel } from '../../grid.model'
import { LinkKeyIterator } from '../../iterators/LinkKeyIterator'
import { LinkHelper } from '../link.helper'
import { globalConfig } from '../../../../config/global.config'

class LinkEntryExitPointsMapHelper {
    get eeMap() {
        return this.entryExitPointsMap
    }
    set eeMap(entryExitPointsMap) {
        this.entryExitPointsMap = entryExitPointsMap
    }
    constructor() {
        this.eeMap = {}

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
    generateEEmap() {
        this.eeMap = {}

        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            const lh = new LinkHelper(lki.linkKey)
            this.setEEMapEmptyItems(lh)
        }
    }
    setEEMapEmptyItems(lh) {
        if (!this.eeMap[lh.link1])
            this.eeMap[lh.link1] = Utils.deepclone(this.eeMapItemBlueprint)
                
        if (!this.eeMap[lh.link2])
            this.eeMap[lh.link2] = Utils.deepclone(this.eeMapItemBlueprint)
    }
    restoreEEMapState() {
        if (!this.eeMapState) return
        
        if (gridArrowConnectorService.restoreEEMapState)
            this.eeMap = Utils.deepclone(this.eeMapState)
    }
    saveEEMapState(lh) {
        this.eeMapState = Utils.deepclone(this.eeMap)
        this.setEEMapEmptyItems(lh)
    }
    
    createEEDifferenceForArrow(lh, direction) {
        const eeMap = this.eeMap[lh.link2][LinkHelper.getOpositeDirection(direction)]
        eeMap.in[lh.link1] = ++eeMap.total

        return this.getDiffByPoint(eeMap.total) || 0
    }
    createEEDifferenceForPath(lh, direction) {
        const eeMap = this.eeMap[lh.link1][direction]
        eeMap.out[lh.link2] = ++eeMap.total
        
        return this.getDiffByPoint(eeMap.total) || 0
    }
    getDiffByPoint(pointNr) {
        if (pointNr > 9) return 0

        const diff = globalConfig.arrowPointerHeight * Math.floor(pointNr / 2)

        return (pointNr % 2) ? -diff : diff
    }
}

const linkEEMapHelper = new LinkEntryExitPointsMapHelper()
globalThis.linkEEMapHelper = linkEEMapHelper

export default linkEEMapHelper
