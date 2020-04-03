
import { Utils } from '../../../utils/utils'
import { LinkDrawHelper } from './linkDraw.helper'

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
    getDiffEE(type, link1, link2, inOut) {
        if (type === 'north') type = 'up'
        if (type === 'south') type = 'down'
        if (type === 'west') type = 'right'
        if (type === 'east') type = 'left'

        if (inOut === 'in') {

        } else if (inOut === 'out') {

        }

        return 0
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
}

const linkEEhelper = new LinkEEHelper()
window.linkEEhelper = linkEEhelper

export default linkEEhelper
