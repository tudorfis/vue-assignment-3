
import { Utils } from '../../../utils/utils'
import { LinkDrawHelper } from './linkDraw.helper'
import { globalConfig } from '../../../config/global.config'
import { gridModel } from '../grid.model'
import { LinkKeyIterator } from '../iterators/LinkKeyIterator'

const gc = globalConfig

class LinkEEHelper {
    constructor() {
        this.eePathMap = {}
        this.eeMap = {}

        const directionEEBlueprint = { out: {}, in: {}, total: 0 }
        this.linkEEblueprint = {
            up: Utils.deepclone(directionEEBlueprint),
            down: Utils.deepclone(directionEEBlueprint),
            right: Utils.deepclone(directionEEBlueprint),
            left: Utils.deepclone(directionEEBlueprint)
        }
    }
    generateEEpath() {
        this.eePathMap = {}

        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            const ldh = new LinkDrawHelper(lki.linkKey)
            this.setEEPathMap(ldh)
        }
    }
    setEEPathMap(ldh) {
        if (ldh.sameCol && ldh.down) {
            for (let row = ldh.row1 + 1; row < ldh.row2; row++)
                setEEPath(row, ldh.col1, 'v')
        }
        else if (ldh.sameCol && ldh.up) {
            for (let row = ldh.row1 - 1; row > ldh.row2; row--)
                setEEPath(row, ldh.col1, 'v')
        }
        else if (ldh.sameRow && ldh.right) {
            for (let col = ldh.col1 + 1; col < ldh.col2; col++)
                setEEPath(ldh.row1, col, 'h')
        }
        else if (ldh.sameRow && ldh.left) {
            for (let col = ldh.col1 - 1; col > ldh.col2; col--)
                setEEPath(ldh.row1, col, 'h')
        }
        else if (ldh.right) {
            for (let col = ldh.col1 + 1; col < ldh.col2; col++)
                setEEPath(ldh.row1, col, 'h')
            setEEDownUpPath(ldh)
        }
        else if (ldh.left) {
            for (let col = ldh.col1 - 1; col > ldh.col2; col--)
                setEEPath(ldh.row1, col, 'h')
            setEEDownUpPath(ldh)
        }

        function setEEPath(row, col, hv) {
            const position = gridModel.getPosition(row, col)

            if (!linkEEhelper.eePathMap[position]) 
                linkEEhelper.eePathMap[position] = { h: 0, v: 0 }
            
            linkEEhelper.eePathMap[position][hv]++
        }
        function setEEDownUpPath(ldh) {
            if (ldh.down)
                for (let row = ldh.row1 + 1; row < ldh.row2; row++)
                    setEEPath(row, ldh.col2, 'v')
            
            else if (ldh.up)
                for (let row = ldh.row1 - 1; row > ldh.row2; row--)
                    setEEPath(row, ldh.col2, 'v')
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
    setEELinks(l) {
        if (!this.eeMap[l.link1])
            this.eeMap[l.link1] = Utils.deepclone(this.linkEEblueprint)
                
        if (!this.eeMap[l.link2])
            this.eeMap[l.link2] = Utils.deepclone(this.linkEEblueprint)
    }
    setEEConnectionMaps(ldh) {
        const link1Direction = this.getLink1Direction(ldh)
        const link2Direction = this.getLink2Direction(ldh)

        const link1Obj = this.eeMap[ldh.link1][link1Direction]
        const link2Obj =  this.eeMap[ldh.link2][link2Direction]

        link1Obj.total++
        link2Obj.total++

        link1Obj.out[ldh.link2] = link1Obj.total
        link2Obj.in[ldh.link1] = link2Obj.total
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
        if (pointNr === 2) return -gc.arrowSizeH
        else if (pointNr === 3) return gc.arrowSizeH
        else if (pointNr === 4) return -(gc.arrowSizeH * 2)
        else if (pointNr === 5) return (gc.arrowSizeH * 2)
        else if (pointNr === 6) return -(gc.arrowSizeH * 3)
        else if (pointNr === 7) return (gc.arrowSizeH * 3)
        
        else if (pointNr > 7) {
            const rest = pointNr % 7
            const isMinus = rest % 2 === 0
            const total = gc.arrowSizeH * Math.floor(rest / 2)

            if (isMinus)
                return -total
            
            return total
        } 

        return 0
    }
}

const linkEEhelper = new LinkEEHelper()
globalThis.linkEEhelper = linkEEhelper

export default linkEEhelper
