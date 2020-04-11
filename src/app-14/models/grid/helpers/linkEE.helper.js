
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
            
            this.setEELinkMaps(ldh)
            this.setEEConnectionMaps(ldh)
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
    setEEConnectionMaps(ldh) {
        const link1Direction = this.getLink1Direction(ldh)
        const link2Direction = this.getLink2Direction(ldh)

        const link1Obj = this.eeMap[ldh.link1][link1Direction]
        const link2Obj = this.eeMap[ldh.link2][link2Direction]
        
        if (!link1Obj || !link2Obj) return
        const eeLinks = this.getEETotalLinks(ldh, link1Direction, link2Direction)
        
        link1Obj.total = eeLinks
        link2Obj.total = eeLinks

        link1Obj.out[ldh.link2] = link1Obj.total
        link2Obj.in[ldh.link1] = link2Obj.total
    }
    getEETotalLinks(ldh, link1Direction, link2Direction) {
        let eeLinks = 0

        if (link1Direction === 'right' && link2Direction === 'left') {
            for (let col = ldh.col1 + 1; col < ldh.col2; col++)
                eeLinks = getEELinksEEPath(ldh.row1, col, 'h', eeLinks, 0)

            eeLinks = getEELinksLink1Link2(link1Direction, link2Direction, false, false, eeLinks, ldh, 1)
        } 
        else if (link1Direction === 'left' && link2Direction === 'right') {
            for (let col = ldh.col1 - 1; col > ldh.col2; col--)
                eeLinks = getEELinksEEPath(ldh.row1, col, 'h', eeLinks, 0)

            eeLinks = getEELinksLink1Link2(link1Direction, link2Direction, false, false, eeLinks, ldh, 1)
        }
        else if (link1Direction === 'down' && link2Direction === 'up') {
            for (let row = ldh.row1 + 1; row < ldh.row2; row++)
                eeLinks = getEELinksEEPath(row, ldh.col1, 'v', eeLinks, 0)

            eeLinks = getEELinksLink1Link2(link1Direction, link2Direction, false, false, eeLinks, ldh, 1)
        }
        else if (link1Direction === 'up' && link2Direction === 'down') {
            for (let row = ldh.row1 - 1; row > ldh.row2; row--)
                eeLinks = getEELinksEEPath(row, ldh.col1, 'v', eeLinks, 0)

            eeLinks = getEELinksLink1Link2(link1Direction, link2Direction, false, false, eeLinks, ldh, 1)
        }
        else if (link1Direction === 'right') {
            for (let col = ldh.col1 + 1; col <= ldh.col2; col++)
                eeLinks = getEELinksEEPath(ldh.row1, col, 'h', eeLinks, 0)

            eeLinks = getEELinksLink1Link2(link1Direction, '', true, false, eeLinks, ldh, 1)
            eeLinks = getEELinksUpDownDirection(link2Direction, eeLinks, ldh, 0)
        }
        else if (link1Direction === 'left') {
            for (let col = ldh.col1 - 1; col >= ldh.col2; col--)
                eeLinks = getEELinksEEPath(ldh.row1, col, 'h', eeLinks, 0)
                
            eeLinks = getEELinksLink1Link2(link1Direction, '', true, false, eeLinks, ldh, 1)
            eeLinks = getEELinksUpDownDirection(link2Direction, eeLinks, ldh, 0)
        }

        return eeLinks

        function getEELinksEEPath(row, col, hv, eeLinks, extra = 0) {
            const defaultHVobj = {h: 0, v: 0}
            const eePathMap = linkEEhelper.eePathMap[gridModel.getPosition(row, col)] || defaultHVobj
            
            return Math.max(eeLinks, eePathMap[hv] + extra)
        }
        function getEELinksLink1Link2(direction1, direction2, onlyLink1, onlyLink2, eeLinks, ldh, extra = 0) {
            const position1 = gridModel.getPosition(ldh.row1, ldh.col1)
            const position2 = gridModel.getPosition(ldh.row2, ldh.col2)
            
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
        function getEELinksUpDownDirection(link2Direction, eeLinks, ldh) {
            if (link2Direction === 'down'){ 
                for (let row = ldh.row1 + 1; row < ldh.row2; row++)
                    eeLinks = getEELinksEEPath(row, ldh.col2, 'v', eeLinks, 1)

                eeLinks = getEELinksLink1Link2('', link2Direction, false, true, eeLinks, ldh, 1)
            }
            else if (link2Direction === 'up') {
                for (let row = ldh.row1 - 1; row > ldh.row2; row--)
                    eeLinks = getEELinksEEPath(row, ldh.col2, 'v', eeLinks, 1)

                eeLinks = getEELinksLink1Link2('', link2Direction, false, true, eeLinks, ldh, 1)
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
