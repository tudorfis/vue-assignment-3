
import { Utils } from '../../../utils/utils'
import { LinkDrawHelper } from './linkDraw.helper'
import { globalConfig } from '../../../config/global.config'
import { gridModel } from '../grid.model'
import { LinkKeyIterator } from '../iterators/LinkKeyIterator'

const gc = globalConfig

class LinkEEHelper {
    constructor() {
        this.eePathMap = {}
        this.eeLines = {}
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
        else if (ldh.goOtherWay && !ldh.goAroundCell) {
            setEEDownUpPath(ldh, ldh.col1)
            setEEPath(ldh.row2, ldh.col1, 'c', ldh.linkKey)
            setEERightLeftPath(ldh, ldh.row2)
        }
        else {
            setEERightLeftPath(ldh, ldh.row1)
            setEEPath(ldh.row1, ldh.col2, 'c', ldh.linkKey)
            setEEDownUpPath(ldh, ldh.col2)
        }

        function setEEPath(row, col, hv, linkKey) {
            const position = gridModel.getPosition(row, col)

            if (!linkEEhelper.eePathMap[position]) 
                linkEEhelper.eePathMap[position] = { h: 0, v: 0, c: 0, linkKey: '' }
            
            const eePathMap = linkEEhelper.eePathMap[position]
            eePathMap[hv]++

            if (eePathMap.c === 1 && linkKey)
                eePathMap.linkKey = linkKey
        }
        function setEEDownUpPath(ldh, col) {
            if (ldh.down)
                for (let row = ldh.row1 + 1; row < ldh.row2; row++)
                    setEEPath(row, col, 'v')
            
            else if (ldh.up)
                for (let row = ldh.row1 - 1; row > ldh.row2; row--)
                    setEEPath(row, col, 'v')
        }
        function setEERightLeftPath(ldh, row) {
            if (ldh.right)
                for (let col = ldh.col1 + 1; col < ldh.col2; col++)
                    setEEPath(row, col, 'h')
            
            else if (ldh.left)
                for (let col = ldh.col1 - 1; col > ldh.col2; col--)
                    setEEPath(row, col, 'h')
        }
    }
    generateEEmap() {
        this.eeMap = {}
        this.eeLines = {}

        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            const ldh = new LinkDrawHelper(lki.linkKey)
            
            this.setEELinks(ldh)
            this.setEEConnectionMaps(ldh)
        }
    }
    setEELinks(ldh) {
        if (!this.eeMap[ldh.link1])
            this.eeMap[ldh.link1] = Utils.deepclone(this.linkEEblueprint)
                
        if (!this.eeMap[ldh.link2])
            this.eeMap[ldh.link2] = Utils.deepclone(this.linkEEblueprint)
    }
    setEEConnectionMaps(ldh) {
        const link1Direction = this.getLink1Direction(ldh)
        const link2Direction = this.getLink2Direction(ldh)

        const link1Obj = this.eeMap[ldh.link1][link1Direction]
        const link2Obj =  this.eeMap[ldh.link2][link2Direction]
        
        const linkKey2 = LinkDrawHelper.genLinkKey(ldh.link2, ldh.link1)
        const eePath2Total = this.getEELinesTotal(new LinkDrawHelper(linkKey2), ldh.link2, link2Direction)
        const eePath1Total = this.getEELinesTotal(ldh, ldh.link1, link1Direction)

        // if (!ldh.sameCol && !ldh.sameRow) {
            link1Obj.total = eePath1Total + 1
            link2Obj.total = eePath2Total + 1

            link1Obj.out[ldh.link2] = link1Obj.total
            link2Obj.in[ldh.link1] = link2Obj.total
        // }
        // else {
        //     link1Obj.total++
        //     link2Obj.total++

        //     link1Obj.out[ldh.link2] = link1Obj.total
        //     link2Obj.in[ldh.link1] = link2Obj.total
        // }
    }
    getLink1Direction(ldh) {
        if (ldh.col1 === ldh.col2 && ldh.row1 < ldh.row2) return 'down'
        else if (ldh.col1 === ldh.col2 && ldh.row1 > ldh.row2) return 'up'
        else if (ldh.goOtherWay && !ldh.goAroundCell) return ldh.upDown
        else if (ldh.col1 < ldh.col2) return 'right'
        else if (ldh.col1 > ldh.col2) return 'left'

        return ''
    }
    getLink2Direction(ldh) {
        if (ldh.row1 === ldh.row2 && ldh.col1 < ldh.col2) return 'left'
        else if (ldh.row1 === ldh.row2 && ldh.col1 > ldh.col2) return 'right'
        else if (ldh.goOtherWay && !ldh.goAroundCell) return (ldh.rightLeft === 'right') ? 'left' : 'right'
        else if (ldh.row1 < ldh.row2) return 'up'
        else if (ldh.row1 > ldh.row2) return 'down'

        return ''
    }
    getEELinesTotal(ldh, link, direction) {
        let total = 0

        if (direction === 'up') {
            let row = 0
            while (row > (ldh.row2 - ldh.row1)) {
                const position = gridModel.getPositionDiff(link, row, 0)
                
                if (!this.eeLines[position])
                    this.eeLines[position] = {up: 0, down: 0, left: 0, right: 0}
                
                total = Math.max(total, this.eeLines[position].up)
                this.eeLines[position].up++
                row--
            }
        }
        else if (direction === 'down') {
            let row = 0
            while (row < (ldh.row2 - ldh.row1)) {
                const position = gridModel.getPositionDiff(link, row, 0)

                if (!this.eeLines[position])
                    this.eeLines[position] = {up: 0, down: 0, left: 0, right: 0}
                
                total = Math.max(total, this.eeLines[position].down)
                this.eeLines[position].down++
                row++
            }
        }
        else if (direction === 'left') {
            let col = 0
            while (col > (ldh.col2 - ldh.col1)) {
                const position = gridModel.getPositionDiff(link, 0, col)

                if (!this.eeLines[position])
                    this.eeLines[position] = {up: 0, down: 0, left: 0, right: 0}

                total = Math.max(total, this.eeLines[position].left)
                this.eeLines[position].left++
                col--
            }
        }
        else if (direction === 'right') {
            let col = 0
            while (col < (ldh.col2 - ldh.col1)) {
                const position = gridModel.getPositionDiff(link, 0, col)

                if (!this.eeLines[position])
                    this.eeLines[position] =  {up: 0, down: 0, left: 0, right: 0}
                    
                total = Math.max(total, this.eeLines[position].right)
                this.eeLines[position].right++
                col++
            }
        }

        return total
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

const linkEEhelper = new LinkEEHelper()
globalThis.linkEEhelper = linkEEhelper

export default linkEEhelper
