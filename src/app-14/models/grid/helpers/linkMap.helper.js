
import { Utils } from '../../../utils/utils'
import { LinkDrawHelper } from './linkDraw.helper'
import { globalConfig } from '../../../config/global.config'
import { gridModel } from '../grid.model'
import { LinkKeyIterator } from '../iterators/LinkKeyIterator'
import { gridArrowService } from '../../../components/grid/services/gridArrow.service'

const gc = globalConfig

class LinkMapHelper {
    constructor() {
        this.eeMap = {}
        this.eePathMap = {}

        const directionEEBlueprint = { out: {}, in: {}, total: 0 }
        this.linkEEblueprint = {
            up: Utils.deepclone(directionEEBlueprint),
            down: Utils.deepclone(directionEEBlueprint),
            right: Utils.deepclone(directionEEBlueprint),
            left: Utils.deepclone(directionEEBlueprint)
        }
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
        
        if (!gridArrowService.recentLink && gridArrowService.startedDrag)
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

        const link1Direction = this.getLinkDirection(ldh)
        const link2Direction = this.getLinkDirection(ldh2, link1Direction)

        const link1Obj = this.eeMap[ldh.link1][link1Direction]
        const link2Obj =  this.eeMap[ldh2.link1][link2Direction]

        link1Obj.total++
        link2Obj.total++

        link1Obj.out[ldh.link2] = link1Obj.total
        link2Obj.in[ldh.link1] = link2Obj.total
    }
    getLinkDirection(ldh, link1Direction) {
        const eeMap = this.eeMap[ldh.link1]
        const pdir = ldh.potentialDirections

        if (!pdir[1]) return pdir[0]

        if (link1Direction) {
            let link2Direction = (eeMap[pdir[1]].total > eeMap[pdir[0]].total) ? pdir[0] : pdir[1]
            
            const sameHorizontal = ['left','right'].includes(link1Direction) && ['left','right'].includes(link2Direction)
            const sameVertical = ['up','down'].includes(link1Direction) && ['up','down'].includes(link2Direction)

            if (sameHorizontal) return ldh.upDown
            if (sameVertical) return ldh.rightLeft

            return link2Direction
        }

        return (eeMap[pdir[0]].total > eeMap[pdir[1]].total) ? pdir[1] : pdir[0]
    }

    setPathMapCorner(ldh) {
        const position = gridModel.getPosition(ldh.row2, ldh.col1)
            
        if (!this.eePathMap[position])
            this.eePathMap[position] = {v: [], h: [], c: []}

        this.eePathMap[position].c.push(ldh.linkKey)
    }
    setPathMap(ldh, direction, next = false) {
        const linkKey = ldh.linkKey

        if (direction === 'down')
            for (let row = ldh.row1 + 1; row < ldh.row2; row++)
                setPositionPathMap.call(this, row, !next ? ldh.col1 : ldh.col2, 'v', linkKey)

        else if (direction === 'up')
            for (let row = ldh.row1 - 1; row > ldh.row2; row--)
                setPositionPathMap.call(this, row, !next ? ldh.col1 : ldh.col2, 'v', linkKey)
        
        else if (direction === 'left')
            for (let col = ldh.col1 - 1; col > ldh.col2; col--)
                setPositionPathMap.call(this, !next ? ldh.row1 : ldh.row2, col, 'h', linkKey)
            
        else if (direction === 'right')
            for (let col = ldh.col1 + 1; col < ldh.col2; col++)
                setPositionPathMap.call(this, !next ? ldh.row1 : ldh.row2, col, 'h', linkKey)

        function setPositionPathMap(row, col, hvc, linkKey) {
            const position = gridModel.getPosition(row, col)
            
            if (!this.eePathMap[position])
                this.eePathMap[position] = {v: [], h: [], c: []}

            this.eePathMap[position][hvc].push(linkKey)
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

const linkMapHelper = new LinkMapHelper()
globalThis.linkMapHelper = linkMapHelper

export default linkMapHelper
