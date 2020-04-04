
import { Utils } from '../../../utils/utils'
import { LinkDrawHelper } from './linkDraw.helper'
import { globalConfig } from '../../../config/global.config'

const gc = globalConfig
const pointDiff = gc.arrowSizeW + (gc.arrowSizeW - gc.arrowSizeH)

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
                
                const link1Out = this.getLink1Out(l)
                const link2In = this.getLink2In(l)

                this.setEEConnectionMaps(l, link1Out, link2In)
            }
        }
    }
    setEELinkMaps(l) {
        if (!this.eeMap[l.link1])
            this.eeMap[l.link1] = Utils.deepclone(this.linkEEblueprint)
                
        if (!this.eeMap[l.link2])
            this.eeMap[l.link2] = Utils.deepclone(this.linkEEblueprint)
    }
    getLink1Out(l) {
        if (l.col1 === l.col2 && l.row1 < l.row2) return 'down'
        else if (l.col1 === l.col2 && l.row1 > l.row2) return 'up'
        else if (l.col1 < l.col2) return 'right'
        else if (l.col1 > l.col2) return 'left'

        return ''
    }
    getLink2In(l) {
        if (l.row1 === l.row2 && l.col1 < l.col2) return 'left'
        else if (l.row1 === l.row2 && l.col1 > l.col2) return 'right'
        else if (l.row1 < l.row2) return 'up'
        else if (l.row1 > l.row2) return 'down'

        return ''
    }
    setEEConnectionMaps(l, link1Out, link2In) {
        const link1OutObj = this.eeMap[l.link1][link1Out] 
        link1OutObj.total++
        link1OutObj.out[l.link2] = link1OutObj.total

        const link2InObj = this.eeMap[l.link2][link2In]
        link2InObj.total++
        link2InObj.in[l.link1] = link2InObj.total
    }
    getDiffEE(direction, link1, link2, inOut) {
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
        if (pointNr === 1) return 0
        else if (pointNr === 2) return -pointDiff
        else if (pointNr === 3) return pointDiff
        else if (pointNr === 4) return -(pointDiff * 2)
        else if (pointNr === 5) return (pointDiff * 2)
    }
}

const linkEEhelper = new LinkEEHelper()
window.linkEEhelper = linkEEhelper

export default linkEEhelper
