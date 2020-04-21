
import { Utils } from '../../../utils/utils'
import { LinkDrawHelper } from './linkDraw.helper'
import { globalConfig } from '../../../config/global.config'
import { gridModel } from '../grid.model'
import { LinkKeyIterator } from '../iterators/LinkKeyIterator'
import { gridArrowConnectorService } from '../../../components/grid/services/gridArrowConnector.service'
import { linkDirectionsHelper } from './linkDirections.helper'

const gc = globalConfig

class LinkEntryExitPointsMapHelper {
    constructor() {
        this.eeMap = {}

        const directionEEBlueprint = { out: {}, in: {}, total: 0 }
        this.linkEEblueprint = {
            up: Utils.deepclone(directionEEBlueprint),
            down: Utils.deepclone(directionEEBlueprint),
            right: Utils.deepclone(directionEEBlueprint),
            left: Utils.deepclone(directionEEBlueprint)
        }
    }
    get eeMap() {
        return this.entryExitPointsMap
    }
    set eeMap(entryExitPointsMap) {
        this.entryExitPointsMap = entryExitPointsMap
    }
    generateEEmap() {
        this.eeMap = {}

        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            const ldh = new LinkDrawHelper(lki.linkKey)
            
            this.setEELinks(ldh)
            this.setEEConnectionMaps(ldh)
        }
    }
    generateEEforGenPath(ldh, isDrag) {
        if (!isDrag) return
        
        this.backup_eeMap = Utils.deepclone(this.eeMap)
        
        this.setEELinks(ldh)
        this.setEEConnectionMaps(ldh)
    }
    restoreEEforGenPath() {
        if (!this.backup_eeMap) return
        
        if (!gridArrowConnectorService.recentLink && gridArrowConnectorService.startedDrag)
            this.eeMap = Utils.deepclone(this.backup_eeMap)
    }
    setEELinks(ldh) {
        if (!this.eeMap[ldh.link1])
            this.eeMap[ldh.link1] = Utils.deepclone(this.linkEEblueprint)
                
        if (!this.eeMap[ldh.link2])
            this.eeMap[ldh.link2] = Utils.deepclone(this.linkEEblueprint)
    }
    setEEConnectionMaps(ldh) {
        const ldh2 = new LinkDrawHelper(ldh.linkKey, true)
        const linkDirections = linkDirectionsHelper.getLinkDirections(ldh, ldh2)

        const link1Obj = this.eeMap[ldh.link1][linkDirections[0]]
        const link2Obj =  this.eeMap[ldh2.link1][linkDirections[1]]

        link1Obj.total++
        link2Obj.total++

        link1Obj.out[ldh.link2] = link1Obj.total
        link2Obj.in[ldh.link1] = link2Obj.total

        this.adjustOverlappingEE(link1Obj, linkDirections[0])
    }
    adjustOverlappingEE(linkObj, linkDirection) {
        const outPositions = Object.keys(linkObj.out)
        if (outPositions.length === 2) {
            const row1 = gridModel.getRow(outPositions[0])
            const col1 = gridModel.getCol(outPositions[0])
            const row2 = gridModel.getRow(outPositions[1])
            const col2 = gridModel.getCol(outPositions[1])
            
            if (LinkDrawHelper.leftOrRight(linkDirection)) {
                if (col1 === col2) {
                    if (linkObj.out[outPositions[0]] < linkObj.out[outPositions[1]]) {
                        const temp = linkObj.out[outPositions[0]]
                        linkObj.out[outPositions[0]] = linkObj.out[outPositions[1]]
                        linkObj.out[outPositions[1]] = temp
                    }
                }
            } else if (LinkDrawHelper.upOrDown(linkDirection)) {
                if (row1 === row2) {
                    if (linkObj.out[outPositions[0]] < linkObj.out[outPositions[1]]) {
                        const temp = linkObj.out[outPositions[0]]
                        linkObj.out[outPositions[0]] = linkObj.out[outPositions[1]]
                        linkObj.out[outPositions[1]] = temp
                    }
                }
            }
        }
    }
    getDiffEE(direction, link1, link2, inOut) {
        if (!this.eeMap[link1] || !this.eeMap[link1][direction]) return
        if (!this.eeMap[link2] || !this.eeMap[link2][direction]) return
            
        let pointNr
        let difference = 0

        if (inOut === 'out') {
            pointNr = this.eeMap[link1][direction].out[link2] 
            difference = this.getDifferenceByPoint(pointNr)
        } 
        else if (inOut === 'in') {
            pointNr = this.eeMap[link2][direction].in[link1]
            difference = this.getDifferenceByPoint(pointNr)
        }

        return difference || 0
    }
    getDifferenceByPoint(pointNr) {
        const diff = gc.arrowPointerHeight
        if (pointNr === 2) return -diff
        else if (pointNr === 3) return diff
        else if (pointNr === 4) return -(diff * 2)
        else if (pointNr === 5) return (diff * 2)
        else if (pointNr === 6) return -(diff * 3)
        else if (pointNr === 7) return (diff * 3)
        else if (pointNr === 8) return -(diff * 4)
        else if (pointNr === 9) return (diff * 4)
        
        else if (pointNr > 9) {
            const rest = pointNr % 9
            const isMinus = rest % 2 === 0
            const total = diff * Math.floor(rest / 2)

            if (isMinus)
                return -total
            
            return total
        } 

        return 0
    }
}

const linkEEMapHelper = new LinkEntryExitPointsMapHelper()
globalThis.linkEEMapHelper = linkEEMapHelper

export default linkEEMapHelper
