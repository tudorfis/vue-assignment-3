
import { Utils } from '../../../utils/utils'
import { LinkDrawHelper } from './linkDraw.helper'
import { globalConfig } from '../../../config/global.config'
import { gridModel } from '../grid.model'
import { LinkKeyIterator } from '../iterators/LinkKeyIterator'

const gc = globalConfig

class LinkEEHelper {
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
    generateEEpath() {
        this.eePathMap = {}

        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            const ldh = new LinkDrawHelper(lki.linkKey, gridModel)
            this.setEEPathMap(ldh)
        }
    }
    setEEPathMap(l) {
        if (l.sameCol && l.down) {
            for (let row = l.row1; row <= l.row2; row++)
                setEEPath(row, l.col1, 'v')
        }
        else if (l.sameCol && l.up) {
            for (let row = l.row1; row >= l.row2; row--)
                setEEPath(row, l.col1, 'v')
        }
        else if (l.sameRow && l.right) {
            for (let col = l.col1; col <= l.col2; col++)
                setEEPath(l.row1, col, 'h')
        }
        else if (l.sameRow && l.left) {
            for (let col = l.col1; col >= l.col2; col--)
                setEEPath(l.row1, col, 'h')
        }
        else if (l.right) {
            for (let col = l.col1; col <= l.col2; col++)
                setEEPath(l.row1, col, 'h')
            setEEDownUpPath(l)
        }
        else if (l.left) {
            for (let col = l.col1; col >= l.col2; col--)
                setEEPath(l.row1, col, 'h')
            setEEDownUpPath(l)
        }

        function setEEPath(row, col, hv) {
            const position = gridModel.getPosition(row, col)

            if (!linkEEhelper.eePathMap[position]) 
                linkEEhelper.eePathMap[position] = { h: 0, v: 0 }
            
            linkEEhelper.eePathMap[position][hv]++
        }
        function setEEDownUpPath(l) {
            if (l.down)
                for (let row = l.row1; row <= l.row2; row++)
                    setEEPath(row, l.col2, 'v')
            
            else if (l.up)
                for (let row = l.row1; row >= l.row2; row--)
                    setEEPath(row, l.col2, 'v')
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
        const eeLinks = this.getEETotalLinks(l, link1Direction, link2Direction)
        
        link1Obj.total = eeLinks
        link2Obj.total = eeLinks

        link1Obj.out[l.link2] = link1Obj.total
        link2Obj.in[l.link1] = link2Obj.total
    }
    getEETotalLinks(l, link1Direction, link2Direction) {
        let eeLinks = 0

        if (link1Direction === 'right' && link2Direction === 'left') {
            for (let col = l.col1 + 1; col < l.col2; col++)
                eeLinks = getEELinksEEPath(l.row1, col, 'h', eeLinks, 0)

            eeLinks = getEELinksLink1Link2(link1Direction, link2Direction, false, false, eeLinks, l, 1)
        } 
        else if (link1Direction === 'left' && link2Direction === 'right') {
            for (let col = l.col1 - 1; col > l.col2; col--)
                eeLinks = getEELinksEEPath(l.row1, col, 'h', eeLinks, 0)

            eeLinks = getEELinksLink1Link2(link1Direction, link2Direction, false, false, eeLinks, l, 1)
        }
        else if (link1Direction === 'down' && link2Direction === 'up') {
            for (let row = l.row1 + 1; row < l.row2; row++)
                eeLinks = getEELinksEEPath(row, l.col1, 'v', eeLinks, 0)

            eeLinks = getEELinksLink1Link2(link1Direction, link2Direction, false, false, eeLinks, l, 1)
        }
        else if (link1Direction === 'up' && link2Direction === 'down') {
            for (let row = l.row1 - 1; row > l.row2; row--)
                eeLinks = getEELinksEEPath(row, l.col1, 'v', eeLinks, 0)

            eeLinks = getEELinksLink1Link2(link1Direction, link2Direction, false, false, eeLinks, l, 1)
        }
        else if (link1Direction === 'right') {
            for (let col = l.col1 + 1; col < l.col2; col++)
                eeLinks = getEELinksEEPath(l.row1, col, 'h', eeLinks, 0)

            eeLinks = getEELinksLink1Link2(link1Direction, '', true, false, eeLinks, l, 1)
            eeLinks = getEELinksUpDownDirection(link2Direction, eeLinks, l, 0)
        }
        else if (link1Direction === 'left') {
            for (let col = l.col1 - 1; col > l.col2; col--)
                eeLinks = getEELinksEEPath(l.row1, col, 'h', eeLinks, 0)

            eeLinks = getEELinksLink1Link2(link1Direction, '', true, false, eeLinks, l, 1)
            eeLinks = getEELinksUpDownDirection(link2Direction, eeLinks, l, 0)
        }

        return eeLinks

        function getEELinksEEPath(row, col, hv, eeLinks, extra = 0) {
            const defaultHVobj = {h: 0, v: 0}
            const eePathMap = linkEEhelper.eePathMap[gridModel.getPosition(row, col)] || defaultHVobj
            
            return Math.max(eeLinks, eePathMap[hv] + extra)
        }
        function getEELinksLink1Link2(direction1, direction2, onlyLink1, onlyLink2, eeLinks, l, extra = 0) {
            const position1 = gridModel.getPosition(l.row1, l.col1)
            const position2 = gridModel.getPosition(l.row2, l.col2)
            
            if (onlyLink1) {
                eeLinks = Math.max(eeLinks, linkEEhelper.eeMap[position1][direction1].total + extra)
            } 
            else if (onlyLink2) {
                eeLinks = Math.max(eeLinks, linkEEhelper.eeMap[position2][direction2].total + extra)
            }
            else {
                eeLinks = Math.max(eeLinks, linkEEhelper.eeMap[position1][direction1].total + extra)
                eeLinks = Math.max(eeLinks, linkEEhelper.eeMap[position2][direction2].total + extra)
            }
            
            return eeLinks
        }
        function getEELinksUpDownDirection(link2Direction, eeLinks, l) {
            if (link2Direction === 'down'){ 
                for (let row = l.row1 + 1; row < l.row2; row++)
                    eeLinks = getEELinksEEPath(row, l.col2, 'v', eeLinks, 1)

                eeLinks = getEELinksLink1Link2('', link2Direction, false, true, eeLinks, l, 1)
            }
            else if (link2Direction === 'up') {
                for (let row = l.row1 - 1; row > l.row2; row--)
                    eeLinks = getEELinksEEPath(row, l.col2, 'v', eeLinks, 1)

                eeLinks = getEELinksLink1Link2('', link2Direction, false, true, eeLinks, l, 1)
            }

            return eeLinks
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
