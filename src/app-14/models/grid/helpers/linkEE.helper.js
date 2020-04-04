
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
        /** @TODO: do a check if connected lines in the same 
         * direction exists across the path and if so move to pointNr a bit down */
        
        const link1Obj = this.eeMap[l.link1][link1Direction]
        const link2Obj = this.eeMap[l.link2][link2Direction]
        
        let totalLinks = 0

        if (link1Direction === 'right') {

            // for (let col = 1; col <= gridModel.model.numCols; col++) {
            //     const position = gridModel.getPosition(l.row1, col)
                
            //     if (this.eeMap[position] && this.eeMap[position].right.total > 0) {
            //         const out = Object.keys(this.eeMap[position].right.out)
            //         const outTotal = out.length

            //         for (let i = 1; i < outTotal; i++) {
            //             const outPosition = out[i]
            //             const linkKey = LinkDrawHelper.genLinkKey(position, outPosition)
            //             const l2 = new LinkDrawHelper(linkKey, gridModel)

            //             if (l2.col2 >= l.col1 && l2.col1 <= l.col2 - 1) totalLinks++
            //         }
            //     }

            //     if (this.eeMap[position] && this.eeMap[position].left.total > 0) {
            //         const inn = Object.keys(this.eeMap[position].left.in)
            //         const innTotal = inn.length

            //         for (let i = 1; i < innTotal; i++) {
            //             const innPosition = inn[i]
            //             const linkKey = LinkDrawHelper.genLinkKey(position, innPosition)
            //             const l2 = new LinkDrawHelper(linkKey, gridModel)

            //             if (l2.col2 <= l.col1 && l2.col1 >= l.col2 + 1) totalLinks++
            //         }
            //     }
            // }

            for (let col = l.col1; col <= l.col2; col++) {
                const eeMap = this.eeMap[gridModel.getPosition(l.row1, col)]
                if (eeMap) totalLinks += eeMap.left.total + eeMap.right.total
            }
        } 
        else if (link1Direction === 'left') {
            for (let col = l.col1; col >= l.col2; col--) {
                const eeMap = this.eeMap[gridModel.getPosition(l.row1, col)]
                if (eeMap) totalLinks += eeMap.right.total + eeMap.left.total
            }
        }
        else if (link1Direction === 'down') {
            for (let row = l.row1; row <= l.row2; row++) {
                const eeMap = this.eeMap[gridModel.getPosition(row, l.col1)]
                if (eeMap) totalLinks += eeMap.up.total + eeMap.down.total
            }
        }
        else if (link1Direction === 'up') {
            for (let row = l.row1; row >= l.row2; row--) {
                const eeMap = this.eeMap[gridModel.getPosition(row, l.col1)]
                if (eeMap) totalLinks += eeMap.down.total + eeMap.up.total
            }
        }

        if (link1Obj  && link2Obj) {
            link1Obj.total += totalLinks + 1
            link2Obj.total = link1Obj.total
    
            link1Obj.out[l.link2] = link1Obj.total
            link2Obj.in[l.link1] = link2Obj.total
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
