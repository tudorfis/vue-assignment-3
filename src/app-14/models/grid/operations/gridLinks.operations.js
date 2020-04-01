import Vue from 'vue'
import { globalConfig } from "../../../config/global.config"
import { gridModel } from "../grid.model"
import { gridModelOperations } from './gridModel.operations'

/** @TODO: move into global config ... extend config */
const gsize = 240
const gadjust = 0.024

const arrowSizeW = 20
const arrowSizeH = 15

const linkSeparator = '__'

const northArrowPath = `h${arrowSizeH} l-${arrowSizeH} ${arrowSizeW} l-${arrowSizeH} -${arrowSizeW} Z`
const southArrowPath = `h${arrowSizeH} l-${arrowSizeH} -${arrowSizeW} l-${arrowSizeH} ${arrowSizeW} Z`
const westArrowPath = `v-${arrowSizeW} l${arrowSizeW} ${arrowSizeH} l-${arrowSizeW} ${arrowSizeH} Z`
const eastArrowPath = `v-${arrowSizeW} l-${arrowSizeW} ${arrowSizeH} l${arrowSizeW} ${arrowSizeH} Z`

class LinkCellsHelper {
    constructor(linkKey, vm1, vm2) {
        this.link1 = vm1.getLink1(linkKey)
        this.link2 = vm1.getLink2(linkKey)

        this.row1 = vm2.getRow(this.link1)
        this.col1 = vm2.getCol(this.link1)

        this.row2 = vm2.getRow(this.link2)
        this.col2 = vm2.getCol(this.link2)
    }
    get right() {
        return this.col1 < this.col2
    }
    get left() {
        return this.col1 > this.col2
    }
    get up() {
        return this.row1 > this.row2
    }
    get down() {
        return this.row1 < this.row2
    }
    get sameCol() {
        return this.col1 === this.col2
    }
    get sameRow() {
        return this.row1 === this.row2
    }
    get rightLeft() {
        return this.right ? 'right' : (this.left ? 'left' : '')
    }
    get upDown() {
        return this.up ? 'up' : (this.down ? 'down' : '')
    }
    get eastWest() {
        return this.left ? 'east' : (this.right ? 'west' : '')
    }
    get northSouth() {
        return this.down ? 'north' : (this.up ? 'south' : '')
    }
    draw(type = '', lineType = '') {
        let d, distance
        switch (type) {
            case 'up': {
                d = 'v-'; 
                
                if (lineType === 'full')
                    distance = gsize * (this.row1 - this.row2 - 1)
                
                break;
            }
            case 'down': {
                d = 'v';

                if (lineType === 'full')
                    distance = gsize * (this.row2 - this.row1 - 1)

                break;
            }
                
            case 'right': {
                d = 'h';

                if (lineType === 'full')
                    distance = gsize * (this.col2 - this.col1 - 1)
                
                break;
            }
            case 'left': {
                d = 'h-'; 

                if (lineType === 'full')
                    distance = gsize * (this.col1 - this.col2 - 1)
                
                break;
            }
        }

        if (lineType === 'half')
            distance = this.left ? 117 : (this.right ? 123 : 123)

        return `${d}${distance}`
    }
}

export const gridLinksOperations = {
    genLinkTwoCells(linkKey) {
        Vue.set(gridModel.paths, linkKey, [])

        const vm1 = gridLinksOperations
        const vm2 = gridModel

        const l = new LinkCellsHelper(linkKey, vm1, vm2)
        let path, arrow, t1, t2, t3, t4, t5

        if (l.right || l.left) {
            t1 = 'rightLeft'
            t2 = 'eastWest'
            t3 = 'upDown'
            t4 = 'northSouth'
            t5 = 'sameRow'
        }
        
        else if (l.up || l.down) {
            t1 = 'upDown'
            t2 = 'northSouth'
            t3 = 'rightLeft'
            t4 = 'eastWest'
            t5 = 'sameCol'
        }

        path = vm1.genPath.call(vm2, l.link1, l[t1])
        path.d += l.draw(l[t1], 'full')

        if (l[t5])
            arrow = vm1.genArrow.call(vm2, l.link2, l[t2])

        else {
            path.d += l.draw(l[t1], 'half')
            path.d += l.draw(l[t3], 'half')
            path.d += l.draw(l[t3], 'full')
            arrow = vm1.genArrow.call(vm2, l.link2, l[t4])
        }

        gridModel.paths[linkKey].push(...[path, ...arrow])
    },
    genPath(link, type = '', forArrow = false) {
        const vm = gridLinksOperations
        const row = this.getRow(link)
        const col = this.getCol(link)

        let left, top, path
        switch (type) {
            case 'up': {
                left = vm.getLeft(col) + 125
                top =  vm.getTop(row, 1) + 52 + (forArrow ? -13 : 0)
                path = `M${left} ${top} v-${(forArrow ? '38' : '50')}`
                break
            }
            case 'down': {
                left = vm.getLeft(col) + 125
                top =  vm.getTop(row, 1) + (gsize - 48) + (forArrow ? 17 : 0)
                path = `M${left} ${top} v${(forArrow ? '40' : '50')}`
                break
            }
            case 'left': {
                left = vm.getLeft(col, 1) + 52 + (forArrow ? -15 : 0)
                top =  vm.getTop(row) + 125
                path = `M${left} ${top} h-${(forArrow ? '35' : '50')}`
                break
            }
            case 'right': {
                left = vm.getLeft(col, 1) + (gsize - 48) + (forArrow ? 15 : 0)
                top =  vm.getTop(row) + 125
                path = `M${left} ${top} h${(forArrow ? '35' : '50')}`
                break
            }
        }

        return { a: 0, d: path }
    },
    genArrow(link, type = '') {
        const vm = gridLinksOperations
        const row = this.getRow(link)
        const col = this.getCol(link)

        let left, top, arrowPath, linePath
        switch (type) {
            case 'north': {
                left = vm.getLeft(col) + 125
                top = vm.getTop(row, 1) + 30
                
                arrowPath = {a: 1, d: `M${left} ${top} ${northArrowPath}`}
                linePath = vm.genPath.call(this, link, 'up', true)
                break
            }
            case 'south': {
                left = vm.getLeft(col) + 125
                top = vm.getTop(row, 1) + (gsize - 25)

                arrowPath = {a: 1, d: `M${left} ${top} ${southArrowPath}`}
                linePath = vm.genPath.call(this, link, 'down', true)
                break
            }
            case 'west': {
                left = vm.getLeft(col, 1) + 28
                top = vm.getTop(row) + 130

                arrowPath = {a: 1, d: `M${left} ${top} ${westArrowPath}`}
                linePath = vm.genPath.call(this, link, 'left', true)
                break
            }
            case 'east': {
                left = vm.getLeft(col, 1) + (gsize - 23)
                top = vm.getTop(row) + 130

                arrowPath = {a: 1, d: `M${left} ${top} ${eastArrowPath}`}
                linePath = vm.genPath.call(this, link, 'right', true)
                break
            }
        }

        return [ linePath, arrowPath ]
    },
    generateLinks() {
        const vm = gridLinksOperations

        for (const linkKey of gridModel.model.links)
            vm.genLinkTwoCells(linkKey)
    },
    resetLinks(oldPosition, newPosition) {
        const vm = gridLinksOperations

        for (let i = 0; i < gridModel.model.links.length; i++) {
            const linkKey = gridModel.model.links[i]

            const link1 = vm.getLink1(linkKey)
            const link2 = vm.getLink2(linkKey)

            if (link1 === oldPosition) {
                gridModel.model.links[i] = vm.genLinkKey(newPosition, link2)
                delete gridModel.paths[linkKey]
            }

            else if (link2 === oldPosition) {
                gridModel.model.links[i] = vm.genLinkKey(link1, newPosition)
                delete gridModel.paths[linkKey]
            }
        }
    },
    getTop(row, withAdjust = false) {
        return ((row - 1) * gsize) + (globalConfig.arrowWidth / 2) + (withAdjust ? ((row - 1) * gadjust) : 0)
    },
    getLeft(col, withAdjust = false) {
        return ((col - 1) * gsize) + (globalConfig.arrowWidth / 2) + (withAdjust ? ((col - 1) * gadjust) : 0)
    },
    getLink1(linkKey) {
        return linkKey.split(linkSeparator)[0]
    },
    getLink2(linkKey) {
        return linkKey.split(linkSeparator)[1]
    },
    genLinkKey(link1, link2) {
        return `${link1}${linkSeparator}${link2}`
    }
}