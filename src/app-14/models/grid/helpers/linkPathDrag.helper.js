import { gridArrowConnectorService } from "../../../components/grid/services/gridArrowConnector.service"
import { globalConfig as gc } from "../../../config/global.config"
import { Utils } from "../../../utils/utils"
import { gridModel } from "../grid.model"
import { gridLinksBuilderService } from "../services/grid-links/gridLinksBuilder.service"
import { gridIOservice } from "../services/gridIO.service"
import linkEEMapHelper from "./linkEEMap.helper"

const linkPathDragHelper = {
    tempLh: null,
    hasTempPotential: false,
    tempEEMapState: null,
    tempLinkAttributeLinkKeys: [],
    
    handleLinkDraw(lh, isDrag) {
        this.restore()
        if (!isDrag) return

        gridArrowConnectorService.hideArrowConnector()
        this.handleSplitGridcellCase(lh)

        this.save(lh)
    },
    restore() {
        if (!this.tempEEMapState) return
        
        if (gridArrowConnectorService.restoreEEMapState && !this.hasTempPotential) {
            linkEEMapHelper.eeMap = Utils.deepclone(this.tempEEMapState)

            if (this.tempLh) 
                gridModel.deleteLink(this.tempLh.linkKey)
        }
    },
    save(lh) {
        this.tempLh = lh
        this.tempEEMapState = Utils.deepclone(linkEEMapHelper.eeMap)
        
        linkEEMapHelper.createEEMapItemIfItDoesntExist(lh.link1)
        linkEEMapHelper.createEEMapItemIfItDoesntExist(lh.link2)
    },
    handleFoundPotentialConnection() {
        this.hasTempPotential = true

        gridModel.model.links.push(this.tempLh.linkKey)
        gridLinksBuilderService.buildLinks()
    },
    handleNoPotentialConnection() {
        this.hasTempPotential = false
    },
    handleLinkConnected() {
        this.tempLh = null
        this.hasTempPotential = false
    },
    handleSplitGridcellCase(lh) {
        const { isElementOfTypeSplit, isSplitYesDrag, isSplitNoDrag } = gridArrowConnectorService
        if (!isElementOfTypeSplit) return

        const { linkKey } = lh
        gridIOservice.setNewLinkAttribute(linkKey)
        this.tempLinkAttributeLinkKeys.push(linkKey)

        const linkAttribute = gridModel.getLinkAttribute(linkKey)
        linkAttribute.outDirection = 'down'

        if (isSplitYesDrag) linkAttribute.color = gc.pathSplitYesColor
        else if (isSplitNoDrag) linkAttribute.color = gc.pathSplitNoColor
    },
    deletePreviousSplitGridcellCase(dontDeleteLastOne = false) {
        if (!this.tempLinkAttributeLinkKeys.length) return

        if (dontDeleteLastOne)
            this.tempLinkAttributeLinkKeys.pop()
        
        for (const linkKey of this.tempLinkAttributeLinkKeys) {
            gridModel.deleteLinkAttribute(linkKey)
        }
    }
}

globalThis.linkPathDragHelper = linkPathDragHelper
export { linkPathDragHelper }

