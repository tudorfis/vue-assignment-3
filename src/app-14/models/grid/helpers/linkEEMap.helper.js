
import { gridArrowConnectorService } from '../../../components/grid/services/gridArrowConnector.service'
import { Utils } from '../../../utils/utils'
import { gridModel } from '../grid.model'
import { LinkKeyIterator } from '../iterators/LinkKeyIterator'
import { linkDirectionsHelper } from './linkDirections.helper'
import { LinkDrawHelper } from './linkDraw.helper'
import { linkEEOverlappingHelper } from './linkEEOverlapping.helper'

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
            const ldh = new LinkDrawHelper(lki.linkKey)
            
            this.setEEMapEmptyItems(ldh)
            this.setEEMapItemsTotals(ldh)
        }
    }
    setEEMapEmptyItems(ldh) {
        if (!this.eeMap[ldh.link1])
            this.eeMap[ldh.link1] = Utils.deepclone(this.eeMapItemBlueprint)
                
        if (!this.eeMap[ldh.link2])
            this.eeMap[ldh.link2] = Utils.deepclone(this.eeMapItemBlueprint)
    }
    setEEMapItemsTotals(ldh) {
        const ldh2 = new LinkDrawHelper(ldh.linkKey, true)
        const linkDirections = linkDirectionsHelper.getLinkDirections(ldh, ldh2)

        const eeMapItem1 = this.eeMap[ldh.link1][linkDirections[0]]
        const eeMapItem2 =  this.eeMap[ldh2.link1][linkDirections[1]]

        eeMapItem1.total++
        eeMapItem2.total++

        eeMapItem1.out[ldh.link2] = eeMapItem1.total
        eeMapItem2.in[ldh.link1] = eeMapItem2.total

        linkEEOverlappingHelper.adjust(eeMapItem1, linkDirections[0])
    }
    restoreEEMapState() {
        if (!this.eeMapState) return
        
        if (gridArrowConnectorService.restoreEEMapState)
            this.eeMap = Utils.deepclone(this.eeMapState)
    }
    saveEEMapState(ldh) {
        this.eeMapState = Utils.deepclone(this.eeMap)
        
        this.setEEMapEmptyItems(ldh)
        this.setEEMapItemsTotals(ldh)
    }
    
}

const linkEEMapHelper = new LinkEntryExitPointsMapHelper()
globalThis.linkEEMapHelper = linkEEMapHelper

export default linkEEMapHelper
