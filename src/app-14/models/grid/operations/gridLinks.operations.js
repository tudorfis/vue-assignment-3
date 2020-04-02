import Vue from 'vue'
import { globalConfig } from "../../../config/global.config"
import { gridModel } from "../grid.model"

/** @TODO: move into global config and ... 
 * extend config to multiple config files */
const gsize = 240
const gadjust = 0.024

const arrowSizeW = 20
const arrowSizeH = 15

const linkSeparator = '__'

const northArrowPath = `h${arrowSizeH} l-${arrowSizeH} ${arrowSizeW} l-${arrowSizeH} -${arrowSizeW} Z`
const southArrowPath = `h${arrowSizeH} l-${arrowSizeH} -${arrowSizeW} l-${arrowSizeH} ${arrowSizeW} Z`
const westArrowPath = `v-${arrowSizeW} l${arrowSizeW} ${arrowSizeH} l-${arrowSizeW} ${arrowSizeH} Z`
const eastArrowPath = `v-${arrowSizeW} l-${arrowSizeW} ${arrowSizeH} l${arrowSizeW} ${arrowSizeH} Z`

/** @TODO: move into seperate files, and extract a link generation module */
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

/** @TODO: move into seperate files, and extract a link generation module */
class LinkEEHelper {
    constructor() {
        this.directions = ['up','down','left','right']
        this.resetEE()
    }
    resetEE() {
        this.ee = {} // entry exit points
        this.eeL = {} // entry exit points links

        this.states = []
        this.stateVersion = -1

        this.prevLink = '' // based on connected elements
        this.nextLink = ''
    }
    saveState() {
        this.stateVersion++

        this.states.push({
            prevLink: this.prevLink,
            nextLink: this.nextLink,
            ee: JSON.parse(JSON.stringify(this.ee)),
            eeL: JSON.parse(JSON.stringify(this.eeL))
        })
    }
    getLatestState() {
        return this.states[this.states.length - 1]
    }
    regenerate() {
        const vm = this
        if (vm.eeL[vm.prevLink] && vm.eeL[vm.prevLink][vm.nextLink]) {
            const prev = vm.prevLink
            const next = vm.nextLink

            const patchee = vm.ee[next]
            const patch = vm.eeL[next][prev]

            for (let i = 0; i < vm.directions.length; i++) {
                const direction = vm.directions[i]
                
                if (patch[direction] && patchee[direction]) {
                    patchee[direction]--

                    if (!patchee[direction])
                        delete patchee[direction]
                }
            }

            delete vm.eeL[next][prev]
            delete vm.eeL[prev]
            delete vm.ee[prev]
        }
    }
    setLinkEEL(link, connectedLink, type) {
        if (!this.eeL[link])
            this.eeL[link] = {}
        
        if (!this.eeL[link][connectedLink])
            this.eeL[link][connectedLink] = {}

        if (!this.eeL[link][connectedLink][type])
            this.eeL[link][connectedLink][type] = 1
    }
    setLinkEE(link, connectedLink, type, gen) {
        if (gen === 'genArrow')
            switch(type) {
                case 'north': type = 'up'; break;
                case 'south': type = 'down'; break;
                case 'east': type = 'right'; break;
                case 'west': type = 'left'; break;
            }
            
        
        if (!this.ee[link])
            this.ee[link] = {}

        if (!this.ee[link][type])
            this.ee[link][type] = 0

        this.ee[link][type]++
        this.setLinkEEL(link, connectedLink, type)
    }
    // link, type, 'genArrow', forArrow, 'left'
    genEE(link, type, gen, forArrow, position) {
        return 0
    }
}

const linkEEhelper = new LinkEEHelper()
window.linkEEhelper = linkEEhelper

export const gridLinksOperations = {
    genLinkTwoCells(linkKey, regenerateLinkEE = false) {
        Vue.set(gridModel.paths, linkKey, [])

        const vm1 = gridLinksOperations
        const vm2 = gridModel

        const l = new LinkCellsHelper(linkKey, vm1, vm2)

        if (regenerateLinkEE)
            linkEEhelper.regenerate()

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

        path = vm1.genPath.call(vm2, l.link1, l.link2, l[t1])
        path.d += l.draw(l[t1], 'full')

        if (l[t5])
            arrow = vm1.genArrow.call(vm2, l.link2, l.link1, l[t2])

        else {
            path.d += l.draw(l[t1], 'half')
            path.d += l.draw(l[t3], 'half')
            path.d += l.draw(l[t3], 'full')
            arrow = vm1.genArrow.call(vm2, l.link2, l.link1, l[t4])
        }

        gridModel.paths[linkKey].push(...[path, ...arrow])
    },
    genPath(link, connectedLink, type = '', forArrow = false) {
        const vm = gridLinksOperations
        const row = this.getRow(link)
        const col = this.getCol(link)

        if (!forArrow)
            linkEEhelper.setLinkEE(link, connectedLink, type, 'genPath')

        /** @TODO: implement some sort of polymorphism for paths */
        let left, top, path
        switch (type) {
            case 'up': {
                const leftEE = linkEEhelper.genEE(link, type, 'genPath', forArrow, 'left')
                left = vm.getLeft(col) + 125 + leftEE

                const topEE = linkEEhelper.genEE(link, type, 'genPath', forArrow, 'top')
                top =  vm.getTop(row, 1) + 52 + (forArrow ? -13 : 0) + topEE
                
                const pathEE = linkEEhelper.genEE(link, type, 'genPath', forArrow, 'path')
                path = `M${left} ${top} v-${(forArrow ? 38 : 50) + pathEE}`
                break
            }

            case 'down': {
                const leftEE = linkEEhelper.genEE(link, type, 'genPath', forArrow, 'left')
                left = vm.getLeft(col) + 125 + leftEE

                const topEE = linkEEhelper.genEE(link, type, 'genPath', forArrow, 'top')
                top =  vm.getTop(row, 1) + (gsize - 48) + (forArrow ? 17 : 0) + topEE

                const pathEE = linkEEhelper.genEE(link, type, 'genPath', forArrow, 'path')
                path = `M${left} ${top} v${(forArrow ? 40 : 50) + pathEE}`
                break
            }

            case 'left': {
                const leftEE = linkEEhelper.genEE(link, type, 'genPath', forArrow, 'left')
                left = vm.getLeft(col, 1) + 52 + (forArrow ? -15 : 0) + leftEE

                const topEE = linkEEhelper.genEE(link, type, 'genPath', forArrow, 'top')
                top =  vm.getTop(row) + 125 + topEE

                const pathEE = linkEEhelper.genEE(link, type, 'genPath', forArrow, 'path')
                path = `M${left} ${top} h-${(forArrow ? 35 : 50) + pathEE}`
                break
            }

            case 'right': {
                const leftEE = linkEEhelper.genEE(link, type, 'genPath', forArrow, 'left')
                left = vm.getLeft(col, 1) + (gsize - 48) + (forArrow ? 15 : 0) + leftEE

                const topEE = linkEEhelper.genEE(link, type, 'genPath', forArrow, 'top')
                top =  vm.getTop(row) + 125 + topEE
                
                const pathEE = linkEEhelper.genEE(link, type, 'genPath', forArrow, 'path')
                path = `M${left} ${top} h${(forArrow ? 35 : 50) + pathEE}`
                break
            }
        }

        return { a: 0, d: path }
    },
    genArrow(link, connectedLink, type = '') {
        const vm = gridLinksOperations
        const row = this.getRow(link)
        const col = this.getCol(link)

        linkEEhelper.setLinkEE(link, connectedLink, type, 'genArrow')

        /** @TODO: implement some sort of polymorphism for arrows */
        let left, top, arrowPath, linePath
        switch (type) {
            case 'north': {
                const leftEE = linkEEhelper.genEE(link, type, 'genArrow', null, 'left')
                left = vm.getLeft(col) + 125 + leftEE

                const topEE = linkEEhelper.genEE(link, type, 'genArrow', null, 'top')
                top = vm.getTop(row, 1) + 30 + topEE
            
                arrowPath = {a: 1, d: `M${left} ${top} ${northArrowPath}`}
                linePath = vm.genPath.call(this, link, connectedLink, 'up', true)
                break
            }
            case 'south': {
                const leftEE = linkEEhelper.genEE(link, type, 'genArrow', null, 'left')
                left = vm.getLeft(col) + 125 + leftEE

                const topEE = linkEEhelper.genEE(link, type, 'genArrow', null, 'top')
                top = vm.getTop(row, 1) + (gsize - 25) + topEE

                arrowPath = {a: 1, d: `M${left} ${top} ${southArrowPath}`}
                linePath = vm.genPath.call(this, link, connectedLink, 'down', true)
                break
            }
            case 'west': {
                const leftEE = linkEEhelper.genEE(link, type, 'genArrow', null, 'left')
                left = vm.getLeft(col, 1) + 28 + leftEE

                const topEE = linkEEhelper.genEE(link, type, 'genArrow', null, 'top')
                top = vm.getTop(row) + 130 + topEE

                arrowPath = {a: 1, d: `M${left} ${top} ${westArrowPath}`}
                linePath = vm.genPath.call(this, link, connectedLink, 'left', true)
                break
            }
            case 'east': {
                const leftEE = linkEEhelper.genEE(link, type, 'genArrow', null, 'left')
                left = vm.getLeft(col, 1) + (gsize - 23) + leftEE

                const topEE = linkEEhelper.genEE(link, type, 'genArrow', null, 'top')
                top = vm.getTop(row) + 130 + topEE

                arrowPath = {a: 1, d: `M${left} ${top} ${eastArrowPath}`}
                linePath = vm.genPath.call(this, link, connectedLink, 'right', true)
                break
            }
        }

        return [ linePath, arrowPath ]
    },
    buildLinks() {
        const vm = gridLinksOperations
        
        linkEEhelper.resetEE()
        gridModel.paths = {}
        vm.regenerateTimes = 0

        if (gridModel.model.links && gridModel.model.links.length)
            for (const linkKey of gridModel.model.links)
                vm.genLinkTwoCells(linkKey)

        linkEEhelper.saveState()
    },
    regenerateLinkPath(oldPosition, newPosition) {
        const vm = gridLinksOperations

        for (let i = 0; i < gridModel.model.links.length; i++) {
            const linkKey = gridModel.model.links[i]

            const link1 = vm.getLink1(linkKey)
            const link2 = vm.getLink2(linkKey)

            const newLinkKey = vm.getNewLinkKeyForRegeneration(link1, link2, oldPosition, newPosition)

            if (newLinkKey) {
                const regenerateLinkEE = true
                vm.genLinkTwoCells(newLinkKey, regenerateLinkEE)
    
                gridModel.model.links[i] = newLinkKey
                delete gridModel.paths[linkKey]
                
                linkEEhelper.saveState()
            }
        }
    },
    getNewLinkKeyForRegeneration(link1, link2, oldPosition, newPosition) {
        const vm = gridLinksOperations
        let newLinkKey
        const regenerateTimes = vm.getRegenerateTimes(oldPosition)

        if (link1 === oldPosition) {
            linkEEhelper.prevLink = link1
            linkEEhelper.nextLink = link2

            newLinkKey = vm.genLinkKey(newPosition, link2)
        }
        else if (link2 === oldPosition) {
            if (regenerateTimes > 1) {
                linkEEhelper.prevLink = link1
                linkEEhelper.nextLink = link2
            }
            else {
                linkEEhelper.prevLink = link2
                linkEEhelper.nextLink = link1
            }

            newLinkKey = vm.genLinkKey(link1, newPosition)
        }

        return newLinkKey
    },
    getRegenerateTimes(oldPosition) {
        const vm = gridLinksOperations

        let count = 0
        for (let j = 0; j < gridModel.model.links.length; j++) {
            const linkKey = gridModel.model.links[j]

            const link1 = vm.getLink1(linkKey)
            const link2 = vm.getLink2(linkKey)

            if (link1 === oldPosition || link2 === oldPosition)
                count++
        }
        
        return count
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
    },
    genReverseLinkKey(linkKey) {
        const vm = gridLinksOperations

        return vm.genLinkKey(
            vm.getLink1(linkKey),
            vm.getLink2(linkKey)
        )
    }
}