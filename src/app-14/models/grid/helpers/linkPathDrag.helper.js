import { gridArrowConnectorService } from "../../../components/grid/services/gridArrowConnector.service"
import { gridModel } from "../grid.model"
import { gridLinksService } from "../services/gridLinks.service"
import linkEEMapHelper from "./linkEEMap.helper"
import { Utils } from "../../../utils/utils"

const linkPathDragHelper = {
    tempLh: null,
    hasTempPotential: false,
    tempEEMapState: null,
    
    handleLinkDraw(lh, isDrag) {
        this.restore()
        if (isDrag) {
            this.save(lh)
        }
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
        gridLinksService.buildLinks()
    },
    handleNoPotentialConnection() {
        this.hasTempPotential = false
    },
    handleLinkConnected() {
        this.tempLh = null
        this.hasTempPotential = false
    }
}

globalThis.linkPathDragHelper = linkPathDragHelper
export { linkPathDragHelper }

