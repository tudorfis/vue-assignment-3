
import { Utils } from '../../../utils/utils'
import { LinkDrawHelper } from './linkDraw.helper'
import { globalConfig } from '../../../config/global.config'
import { gridModel } from '../grid.model'

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

        if (gridModel.model.links && gridModel.model.links.length) {
            for (const linkKey of gridModel.model.links) {
                const l = new LinkDrawHelper(linkKey, gridModel)
                this.setEEPathMap(l)
            }
        }
    }
    setEEPathMap(l) {
        if (l.right) {
            for (let col = l.col1; col <= l.col2; col++) {
                const position = gridModel.getPosition(l.row1, col)
                if (!this.eePathMap[position]) this.eePathMap[position] = { h: 0, v: 0 }
                
                this.eePathMap[position].h++
            }
            if (l.down) {
                for (let row = l.row1; row <= l.row2; row++) {
                    const position = gridModel.getPosition(row, l.col2)
                    if (!this.eePathMap[position]) this.eePathMap[position] = { h: 0, v: 0 }

                    this.eePathMap[position].v++
                }
            } else if (l.up) {
                for (let row = l.row1; row >= l.row2; row--) {
                    const position = gridModel.getPosition(row, l.col2)
                    if (!this.eePathMap[position]) this.eePathMap[position] = { h: 0, v: 0 }

                    this.eePathMap[position].v++
                }
            }
        }
        else if (l.left) {
            for (let col = l.col1; col >= l.col2; col--) {
                const position = gridModel.getPosition(col, l.row1)
                if (!this.eePathMap[position]) this.eePathMap[position] = { h: 0, v: 0 }

                this.eePathMap[position].h++
            }
            if (l.down) {
                for (let row = l.row1; row <= l.row2; row++) {
                    const position = gridModel.getPosition(row, l.col2)
                    if (!this.eePathMap[position]) this.eePathMap[position] = { h: 0, v: 0 }

                    this.eePathMap[position].v++
                }
            } else if (l.up) {
                for (let row = l.row1; row >= l.row2; row--) {
                    const position = gridModel.getPosition(row, l.col2)
                    if (!this.eePathMap[position]) this.eePathMap[position] = { h: 0, v: 0 }

                    this.eePathMap[position].v++
                }
            }
        }
        else if (l.sameCol && l.down) {
            for (let row = l.row1; row <= l.row2; row++) {
                const position = gridModel.getPosition(row, l.col1)
                if (!this.eePathMap[position]) this.eePathMap[position] = { h: 0, v: 0 }

                this.eePathMap[position].v++
            }
        }
        else if (l.sameCol && l.up) {
            for (let row = l.row1; row >= l.row2; row--) {
                const position = gridModel.getPosition(row, l.col1)
                if (!this.eePathMap[position]) this.eePathMap[position] = { h: 0, v: 0 }

                this.eePathMap[position].v++
            }
        }
        else if (l.sameRow && l.right) {
            for (let col = l.col1; col <= l.col2; col++) {
                const position = gridModel.getPosition(l.row1, col)
                if (!this.eePathMap[position]) this.eePathMap[position] = { h: 0, v: 0 }

                this.eePathMap[position].h++
            }
        }
        else if (l.sameRow && l.left) {
            for (let col = l.col1; col >= l.col2; col--) {
                const position = gridModel.getPosition(l.row1, col)
                if (!this.eePathMap[position]) this.eePathMap[position] = { h: 0, v: 0 }

                this.eePathMap[position].h++
            }
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
        
        link1Obj.total = totalLinks
        link2Obj.total = link1Obj.total

        link1Obj.out[l.link2] = link1Obj.total
        link2Obj.in[l.link1] = link2Obj.total
    }
    getEETotalLinks(l, link1Direction, link2Direction) {
        let totalLinks = 0

        if (link1Direction === 'right' && link2Direction === 'left') {
            for (let col = l.col1 + 1; col < l.col2; col++) {
                const position = gridModel.getPosition(l.row1, col)
                const eeMap = this.eeMap[position]
                const eePathMap = (this.eePathMap[position] || {h: 0})

                if (eeMap)
                    totalLinks = Math.max(totalLinks, eeMap.left.total + eeMap.right.total, eePathMap.h + 1)
            }

            const positionOut = gridModel.getPosition(l.row1, l.col1)
            totalLinks = Math.max(totalLinks, this.eeMap[positionOut].right.total + 1)

            const positionIn = gridModel.getPosition(l.row2, l.col2)
            totalLinks = Math.max(totalLinks, this.eeMap[positionIn].left.total + 1)
        } 

        else if (link1Direction === 'left' && link2Direction === 'right') {
            for (let col = l.col1 - 1; col > l.col2; col--) {
                const position = gridModel.getPosition(l.row1, col)
                const eeMap = this.eeMap[position]
                const eePathMap = (this.eePathMap[position] || {h: 0})

                if (eeMap)
                    totalLinks = Math.max(totalLinks, eeMap.left.total + eeMap.right.total, eePathMap.h + 1)
            }

            const positionOut = gridModel.getPosition(l.row1, l.col1)
            totalLinks = Math.max(totalLinks, this.eeMap[positionOut].left.total + 1)

            const positionIn = gridModel.getPosition(l.row2, l.col2)
            totalLinks = Math.max(totalLinks, this.eeMap[positionIn].right.total + 1)
        }

        else if (link1Direction === 'down' && link2Direction === 'up') {
            for (let row = l.row1 + 1; row < l.row2; row++) {
                const position = gridModel.getPosition(row, l.col1)
                const eeMap = this.eeMap[position]
                const eePathMap = (this.eePathMap[position] || {v: 0})

                if (eeMap)
                    totalLinks = Math.max(totalLinks, eeMap.up.total + eeMap.down.total, eePathMap.v + 1)
            }

            const positionOut = gridModel.getPosition(l.row1, l.col1)
            totalLinks = Math.max(totalLinks, this.eeMap[positionOut].down.total + 1)

            const positionIn = gridModel.getPosition(l.row2, l.col2)
            totalLinks = Math.max(totalLinks, this.eeMap[positionIn].up.total + 1)
        }
        else if (link1Direction === 'up' && link2Direction === 'down') {
            for (let row = l.row1 - 1; row > l.row2; row--) {
                const position = gridModel.getPosition(row, l.col1)
                const eeMap = this.eeMap[position]
                const eePathMap = (this.eePathMap[position] || {v: 0})

                if (eeMap)
                    totalLinks = Math.max(totalLinks, eeMap.up.total + eeMap.down.total, eePathMap.v + 1)
            }

            const positionOut = gridModel.getPosition(l.row1, l.col1)
            totalLinks = Math.max(totalLinks, this.eeMap[positionOut].up.total + 1)

            const positionIn = gridModel.getPosition(l.row2, l.col2)
            totalLinks = Math.max(totalLinks, this.eeMap[positionIn].down.total + 1)
        }

        else if (link1Direction === 'right') {
            for (let col = l.col1 + 1; col < l.col2; col++) {
                const position = gridModel.getPosition(l.row1, col)
                const eeMap = this.eeMap[position]
                const eePathMap = (this.eePathMap[position] || {h: 0})

                if (eeMap)
                    totalLinks = Math.max(totalLinks, eeMap.left.total + eeMap.right.total, eePathMap.h + 1)
            }

            const positionOut = gridModel.getPosition(l.row1, l.col1)
            totalLinks = Math.max(totalLinks, this.eeMap[positionOut].right.total + 1)

            if (link2Direction === 'down'){ 
                for (let row = l.row1 + 1; row < l.row2; row++) {
                    const position = gridModel.getPosition(row, l.col2)
                    const eeMap = this.eeMap[position]
                    const eePathMap = (this.eePathMap[position] || {v: 0})
    
                    if (eeMap)
                        totalLinks = Math.max(totalLinks, eeMap.up.total + eeMap.down.total, eePathMap.v + 1)
                }

                const positionIn = gridModel.getPosition(l.row2, l.col2)
                totalLinks = Math.max(totalLinks, this.eeMap[positionIn].up.total + 1)
            }
            else if (link2Direction === 'up') {
                for (let row = l.row1 - 1; row > l.row2; row--) {
                    const position = gridModel.getPosition(row, l.col2)
                    const eeMap = this.eeMap[position]
                    const eePathMap = (this.eePathMap[position] || {v: 0})
    
                    if (eeMap)
                        totalLinks = Math.max(totalLinks, eeMap.up.total + eeMap.down.total, eePathMap.v + 1)
                }

                const positionIn = gridModel.getPosition(l.row2, l.col2)
                totalLinks = Math.max(totalLinks, this.eeMap[positionIn].down.total + 1)
            }
        }
        else if (link1Direction === 'left') {
            for (let col = l.col1 - 1; col > l.col2; col--) {
                const position = gridModel.getPosition(l.row1, col)
                const eeMap = this.eeMap[position]
                const eePathMap = (this.eePathMap[position] || {h: 0})

                if (eeMap)
                    totalLinks = Math.max(totalLinks, eeMap.left.total + eeMap.right.total, eePathMap.h + 1)
            }

            const positionOut = gridModel.getPosition(l.row1, l.col1)
            totalLinks = Math.max(totalLinks, this.eeMap[positionOut].left.total + 1)

            if (link2Direction === 'down'){ 
                for (let row = l.row1 + 1; row < l.row2; row++) {
                    const position = gridModel.getPosition(row, l.col2)
                    const eeMap = this.eeMap[position]
                    const eePathMap = (this.eePathMap[position] || {v: 0})
    
                    if (eeMap)
                        totalLinks = Math.max(totalLinks, eeMap.up.total + eeMap.down.total, eePathMap.v + 1)
                }

                const positionIn = gridModel.getPosition(l.row2, l.col2)
                totalLinks = Math.max(totalLinks, this.eeMap[positionIn].up.total + 1)
            }
            else if (link2Direction === 'up') {
                for (let row = l.row1 - 1; row > l.row2; row--) {
                    const position = gridModel.getPosition(row, l.col2)
                    const eeMap = this.eeMap[position]
                    const eePathMap = (this.eePathMap[position] || {v: 0})
    
                    if (eeMap)
                        totalLinks = Math.max(totalLinks, eeMap.up.total + eeMap.down.total, eePathMap.v + 1)
                }

                const positionIn = gridModel.getPosition(l.row2, l.col2)
                totalLinks = Math.max(totalLinks, this.eeMap[positionIn].down.total + 1)
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
        if (pointNr === 2) return -gc.arrowSizeW
        else if (pointNr === 3) return gc.arrowSizeW
        else if (pointNr === 4) return -(gc.arrowSizeW * 2)
        else if (pointNr === 5) return (gc.arrowSizeW * 2)
        else if (pointNr === 6) return -(gc.arrowSizeW * 3)
        else if (pointNr === 7) return (gc.arrowSizeW * 3)

        return 0
    }
}

const linkEEhelper = new LinkEEHelper()
window.linkEEhelper = linkEEhelper

export default linkEEhelper
