
import { gridArrowConnectorService } from '../../../../components/grid/services/gridArrowConnector.service'
import { Utils } from '../../../../utils/utils'
import { gridModel } from '../../grid.model'
import { LinkKeyIterator } from '../../iterators/LinkKeyIterator'
import { linkDirectionsHelper } from './../link-directions/linkDirections.helper'
import { LinkHelper } from '../link.helper'
import { linkEECrossOverlapHelper } from "./linkEECrossOverlap.helper"

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
            linkDirectionsHelper.generateLinkDirectionsMap(lh)
            this.setEEMapItemsTotals(lh)
        }
    }
    setEEMapEmptyItems(lh) {
        if (!this.eeMap[lh.link1])
            this.eeMap[lh.link1] = Utils.deepclone(this.eeMapItemBlueprint)
                
        if (!this.eeMap[lh.link2])
            this.eeMap[lh.link2] = Utils.deepclone(this.eeMapItemBlueprint)
    }
    setEEMapItemsTotals(lh) {
        const linkDirections = linkDirectionsHelper.getLinkDirections(lh)

        const eeMapItem1 = this.eeMap[lh.link1][linkDirections[0]]
        const eeMapItem2 =  this.eeMap[lh.link2][linkDirections[1]]

        eeMapItem1.total++
        eeMapItem2.total++

        eeMapItem1.out[lh.link2] = eeMapItem1.total
        eeMapItem2.in[lh.link1] = eeMapItem2.total

        linkEECrossOverlapHelper.adjust(eeMapItem1, linkDirections[0])
        linkEECrossOverlapHelper.adjust(eeMapItem2, linkDirections[1])
    }
    restoreEEMapState() {
        if (!this.eeMapState) return
        
        if (gridArrowConnectorService.restoreEEMapState)
            this.eeMap = Utils.deepclone(this.eeMapState)
    }
    saveEEMapState(lh) {
        this.eeMapState = Utils.deepclone(this.eeMap)
        
        this.setEEMapEmptyItems(lh)
        linkDirectionsHelper.generateLinkDirectionsMap(lh)
        this.setEEMapItemsTotals(lh)
    }
}

const linkEEMapHelper = new LinkEntryExitPointsMapHelper()
globalThis.linkEEMapHelper = linkEEMapHelper

export default linkEEMapHelper
