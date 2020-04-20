
import { globalConfig } from '../../../config/global.config'
import { gridModel } from '../grid.model'
import linkMapHelper from './linkMap.helper'

export class LinkDrawHelper {
    constructor(linkKey, opposite = false) {
        if (!linkKey) {
            this.badLinkKey = true
            return
        }
    
        this.link1 = LinkDrawHelper.getLink1(linkKey)
        this.link2 = LinkDrawHelper.getLink2(linkKey)
    
        if (opposite) {
            linkKey = LinkDrawHelper.genLinkKey(this.link2, this.link1)
            this.switchLinks(this.link2, this.link1)
        }
            
        this.linkKey = linkKey

        this.row1 = gridModel.getRow(this.link1)
        this.col1 = gridModel.getCol(this.link1)

        this.row2 = gridModel.getRow(this.link2)
        this.col2 = gridModel.getCol(this.link2)
    }
    static getLink1(linkKey) {
        return linkKey.split(globalConfig.linkSeparatorSymbol)[0]
    }
    static getLink2(linkKey) {
        return linkKey.split(globalConfig.linkSeparatorSymbol)[1]
    }
    static genLinkKey(link1, link2) {
        return `${link1}${globalConfig.linkSeparatorSymbol}${link2}`
    }
    static oppositeDirection(direction) {
        if (direction === 'up') return 'down'
        if (direction === 'down') return 'up'
        if (direction === 'left') return 'right'
        if (direction === 'right') return 'left'
    }
    switchLinks(link2, link1) {
        const temp = link2
        this.link2 = link1
        this.link1 = temp
    }
    get idLink() {
        const cells = gridModel.model.cells
        if (!cells[this.link1] || !cells[this.link2]) return ''

        const id1 = cells[this.link1].id
        const id2 = cells[this.link2].id

        return `${id1}=>${id2}`
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
    get sameRowCol() {
        return this.sameRow || this.sameCol
    }
    get rightLeft() {
        return this.right ? 'right' : (this.left ? 'left' : '')
    }
    get upDown() {
        return this.up ? 'up' : (this.down ? 'down' : '')
    }
    get sameDirection() {
        return (LinkDrawHelper.upOrDown(this.directionOut) && LinkDrawHelper.upOrDown(this.directionIn) ||
            LinkDrawHelper.leftOrRight(this.directionIn) && LinkDrawHelper.leftOrRight(this.directionOut))
    }
    static upOrDown(direction) {
        return (direction === 'up' || direction === 'down')
    }
    static leftOrRight(direction) {
        return (direction === 'left' || direction === 'right')
    }
    get directionOut() {
        const eeMap = linkMapHelper.eeMap[this.link1]
        const directionOut = Object.keys(eeMap).find(direction => !!eeMap[direction].out[this.link2])

        return directionOut
    }
    get directionIn() {
        const eeMap = linkMapHelper.eeMap[this.link2]
        const directionIn = Object.keys(eeMap).find(direction => !!eeMap[direction].in[this.link1])

        return LinkDrawHelper.oppositeDirection(directionIn)
    }
    get potentialDirections() {
        if (this.up || this.down)
            return [ this['upDown'], this['rightLeft'] ]

        else if (this.right || this.left)
            return [ this['rightLeft'], this['upDown'] ]
    }

    drawPath(direction) {
        let left, top, path, diff_ee_path
        diff_ee_path = this.diff_ee_in_out(direction, 'out')

        if (direction === 'up') {
            left = this.hm_path + this.center_big + diff_ee_path
            top =  this.vm_path + this.center_small
            path = `M${left} ${top} v-${this.center_small}`
        }
        else if (direction === 'down') {
            left = this.hm_path + this.center_big + diff_ee_path
            top =  this.vm_path + (this.cell_size - this.center_small)
            path = `M${left} ${top} v${this.center_small}`
        }
        else if (direction === 'left') {
            left = this.hm_path + this.center_small
            top =  this.vm_path + this.center_big + diff_ee_path
            path = `M${left} ${top} h-${this.center_small}`
        }
        else if (direction === 'right') {
            left = this.hm_path + (this.cell_size - this.center_small)
            top =  this.vm_path + this.center_big + diff_ee_path
            path = `M${left} ${top} h${this.center_small}`
        }

        return { a: 0, d: path }
    }
    drawLine(direction = '', lineType = '') {
        let d, distance, cell1, cell2
        if (direction === 'up') {
            d = 'v-'
            cell1 = this.row1
            cell2 = this.row2
        }
        else if (direction === 'down') {
            d = 'v';
            cell1 = this.row2
            cell2 = this.row1
        }
        else if (direction === 'right') {
            d = 'h';    
            cell1 = this.col2
            cell2 = this.col1
        }
        else if (direction === 'left') {
            d = 'h-'
            cell1 = this.col1
            cell2 = this.col2
        }
 
        if (lineType === 'arrow') 
            distance = this.center_small - this.arrow_w + 3
        
        else if (lineType === 'full') 
            distance = this.cell_size * (cell1 - cell2 - 1)

        return ` ${d}${distance}`
    }
    drawHalf(direction = '', eeDirection, firstHalf) {
        let distance = this.center_big
        const oppositeDirection = LinkDrawHelper.oppositeDirection(eeDirection)

        let diff_ee
        if (firstHalf)  {
            diff_ee = this.diff_ee_in_out(oppositeDirection, 'in')

            if (['left', 'up'].includes(oppositeDirection)) distance += diff_ee
            else if (['right', 'down'].includes(oppositeDirection)) distance -= diff_ee
        }
        else {
            diff_ee = this.diff_ee_in_out(eeDirection, 'out')

            const abs_diff_ee = Math.abs(diff_ee)
            const eeDirUpDown = ['up','down'].includes(eeDirection)
            const eeDirRightLeft = ['right','left'].includes(eeDirection)

            if (diff_ee < 0) {
                if (direction === 'left' && eeDirUpDown) distance -= abs_diff_ee
                else if (direction === 'right' && eeDirUpDown) distance += abs_diff_ee
                else if (direction === 'up' && eeDirRightLeft) distance -= abs_diff_ee
                else if (direction === 'down' && eeDirRightLeft) distance += abs_diff_ee
            }
            else {
                if (direction === 'left' && eeDirUpDown) distance += abs_diff_ee
                else if (direction === 'right' && eeDirUpDown) distance -= abs_diff_ee
                else if (direction === 'up' && eeDirRightLeft) distance += abs_diff_ee
                else if (direction === 'down' && eeDirRightLeft) distance -= abs_diff_ee
            }
        }

        let d
        if (direction === 'up') d = 'v-'
        if (direction === 'down') d = 'v'
        if (direction === 'right') d = 'h'
        if (direction === 'left') d = 'h-'

        return ` ${d}${distance}`
    }
    drawArrow(d, direction)  {
        const dPath = d.replace('M','').split(' ').map(item => {
            if (item.includes('M'))
                return Number(item.replace('M', ''))
            
            else if (item.includes('h'))
                return { direction: 'h', distance: Number(item.replace('h', '')) }

            else if (item.includes('v'))
                return { direction: 'v', distance: Number(item.replace('v', '')) }
            
            else return Number(item)
        })

        const left = dPath
            .filter(item => item.direction === 'h')
            .reduce((total, item) => {
                return total + item.distance
        }, dPath[0])

        const top = dPath
            .filter(item => item.direction === 'v')
            .reduce((total, item) => {
                return total + item.distance
        }, dPath[1])

        let arrowPath
        if (direction === 'up') arrowPath = this.downArrowDraw
        else if (direction === 'down') arrowPath = this.upArrowDraw
        else if (direction === 'left') arrowPath = this.rightArrowDraw
        else if (direction === 'right') arrowPath = this.leftArrowDraw

        return {a: 1, d: `M${left} ${top} ${arrowPath}`}
    }
    
    diff_ee_in_out(direction, inOut) {
        return linkMapHelper.getDiffEE(direction, this.link1, this.link2, inOut) || 0
    }

    get hm_path() {
        return (this.col1 - 1) * this.cell_size
    }
    get vm_path() {
        return (this.row1 - 1) * this.cell_size
    }
    get hm_arrow() {
        return (this.col2 - 1) * this.cell_size
    }
    get vm_arrow() {
        return (this.row2 - 1) * this.cell_size
    }
    get center_small() {
        return (this.cell_size - this.cellelement_size) / 2
    }
    get center_big() {
        return this.cell_size / 2
    }

    get cell_size() { 
        return globalConfig.gridCellWidth
    }
    get cellelement_size() { 
        return globalConfig.gridCellElementWidth
    }
    get arrow_w() { 
        return globalConfig.arrowPointerWidth + 3
    }
    get arrow_h() { 
        return globalConfig.arrowPointerHeight + 3
    }

    get upArrowDraw() { 
        const gc = globalConfig
        return `h${gc.arrowPointerHeight} l-${gc.arrowPointerHeight} ${gc.arrowPointerWidth} l-${gc.arrowPointerHeight} -${gc.arrowPointerWidth} Z`
    }
    get downArrowDraw() { 
        const gc = globalConfig
        return `h${gc.arrowPointerHeight} l-${gc.arrowPointerHeight} -${gc.arrowPointerWidth} l-${gc.arrowPointerHeight} ${gc.arrowPointerWidth} Z`
    }
    get leftArrowDraw() { 
        const gc = globalConfig
        return `v-${gc.arrowPointerHeight} l${gc.arrowPointerWidth} ${gc.arrowPointerHeight} l-${gc.arrowPointerWidth} ${gc.arrowPointerHeight} Z`
    }
    get rightArrowDraw() { 
        const gc = globalConfig
        return `v-${gc.arrowPointerHeight} l-${gc.arrowPointerWidth} ${gc.arrowPointerHeight} l${gc.arrowPointerWidth} ${gc.arrowPointerHeight}`
    }
}
