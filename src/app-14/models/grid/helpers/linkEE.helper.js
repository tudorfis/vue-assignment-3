
import { Utils } from '../../../utils/utils'
import { LinkDrawHelper } from './linkDraw.helper'
import { globalConfig } from '../../../config/global.config'
import { gridModel } from '../grid.model'

const gc = globalConfig
const pointDiff = gc.arrowSizeW
// const pointDiff = gc.arrowSizeW + (gc.arrowSizeW - gc.arrowSizeH)

class LinkEEHelper {
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
    generateEEmap() {
        this.eeMap = {}

        if (gridModel.model.links && gridModel.model.links.length) {
            for (const linkKey of gridModel.model.links) {

                const l = new LinkDrawHelper(linkKey, gridModel)
                this.setEELinkMaps(l)
                
                const link1Direction = this.getLink1Direction(l)
                const link2Direction = this.getLink2Direction(l)

                this.setEEConnectionMaps(l, link1Direction, link2Direction)
            }
        }
    }
    setEELinkMaps(l) {
        if (!this.eeMap[l.link1])
            this.eeMap[l.link1] = Utils.deepclone(this.linkEEblueprint)
                
        if (!this.eeMap[l.link2])
            this.eeMap[l.link2] = Utils.deepclone(this.linkEEblueprint)
    }
    getLink1Direction(l) {
        if (l.col1 === l.col2 && l.row1 < l.row2) return 'down'
        else if (l.col1 === l.col2 && l.row1 > l.row2) return 'up'
        else if (l.col1 < l.col2) return 'right'
        else if (l.col1 > l.col2) return 'left'

        return ''
    }
    getLink2Direction(l) {
        if (l.row1 === l.row2 && l.col1 < l.col2) return 'left'
        else if (l.row1 === l.row2 && l.col1 > l.col2) return 'right'
        else if (l.row1 < l.row2) return 'up'
        else if (l.row1 > l.row2) return 'down'

        return ''
    }
    setEEConnectionMaps(l, link1Direction, link2Direction) {
        const link1Obj = this.eeMap[l.link1][link1Direction]
        const link2Obj = this.eeMap[l.link2][link2Direction]
        
        if (!link1Obj || !link2Obj) return
        const totalLinks = this.getEETotalLinks(l, link1Direction, link2Direction)
        
        link1Obj.total += totalLinks + 1
        link2Obj.total = link1Obj.total

        link1Obj.out[l.link2] = link1Obj.total
        link2Obj.in[l.link1] = link2Obj.total
    }
    getEETotalLinks(l, link1Direction, link2Direction) {
        let totalLinks = 0

        if (link1Direction === 'right' && link2Direction === 'left') {
            for (let col = l.col1; col <= l.col2; col++) {
                const eeMap = this.eeMap[gridModel.getPosition(l.row1, col)]
                if (eeMap) totalLinks += eeMap.left.total + eeMap.right.total
            }
        } 
        else if (link1Direction === 'left' && link2Direction === 'right') {
            for (let col = l.col1; col >= l.col2; col--) {
                const eeMap = this.eeMap[gridModel.getPosition(l.row1, col)]
                if (eeMap) totalLinks += eeMap.right.total + eeMap.left.total
            }
        }
        else if (link1Direction === 'down' && link2Direction === 'up') {
            for (let row = l.row1; row <= l.row2; row++) {
                const eeMap = this.eeMap[gridModel.getPosition(row, l.col1)]
                if (eeMap) totalLinks += eeMap.up.total + eeMap.down.total
            }
        }
        else if (link1Direction === 'up' && link2Direction === 'down') {
            for (let row = l.row1; row >= l.row2; row--) {
                const eeMap = this.eeMap[gridModel.getPosition(row, l.col1)]
                if (eeMap) totalLinks += eeMap.down.total + eeMap.up.total
            }
        }
        else if ((link1Direction === 'right' || link1Direction === 'left') && link2Direction === 'down') {
            for (let row = l.row1; row >= l.row2; row--) {
                const eeMap = this.eeMap[gridModel.getPosition(row, l.col2)]
                if (eeMap) totalLinks += eeMap.up.total + eeMap.down.total
            }
        }
        else if ((link1Direction === 'right' || link1Direction === 'left') && link2Direction === 'up') {
            for (let row = l.row1; row <= l.row2; row++) {
                const eeMap = this.eeMap[gridModel.getPosition(row, l.col2)]
                if (eeMap) totalLinks += eeMap.up.total + eeMap.down.total
            }
        }

        return totalLinks
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

        return difference
    }
    getDifferenceByPoint(pointNr) {
        if (pointNr === 2) return -pointDiff
        else if (pointNr === 3) return pointDiff
        else if (pointNr === 4) return -(pointDiff * 2)
        else if (pointNr === 5) return (pointDiff * 2)
        else if (pointNr === 6) return -(pointDiff * 3)
        else if (pointNr === 7) return (pointDiff * 3)

        return 0
    }
}

const linkEEhelper = new LinkEEHelper()
window.linkEEhelper = linkEEhelper

export default linkEEhelper
