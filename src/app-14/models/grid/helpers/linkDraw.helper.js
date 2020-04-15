
import { globalConfig } from '../../../config/global.config'
import linkEEhelper from './linkEE.helper'
import { gridModel } from '../grid.model'

export class LinkDrawHelper {
    constructor(linkKey) {
        if (!linkKey) {
            this.badLinkKey = true
            return
        }
        this.linkKey = linkKey
        
        this.link1 = LinkDrawHelper.getLink1(linkKey)
        this.link2 = LinkDrawHelper.getLink2(linkKey)

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
    get rightLeft() {
        return this.right ? 'right' : (this.left ? 'left' : '')
    }
    get upDown() {
        return this.up ? 'up' : (this.down ? 'down' : '')
    }
    get cornerPositionInitial() {
        return gridModel.getPosition(this.row1, this.col2)
    }
    get goOtherWay() {
        if (gridModel.model.cells[this.cornerPositionInitial])
            return gridModel.model.cells[this.cornerPositionInitial].is

        return false
    }
    get cornerPositionOther() {
        return gridModel.getPosition(this.row2, this.col1)
    }
    get goAroundCell() {
        if (gridModel.model.cells[this.cornerPositionOther])
            return gridModel.model.cells[this.cornerPositionOther].is

        return false
    }
    genPathDirections() {
        let direction1, direction2, sameColRow

        function genDirections(first = true) {
            direction1 = first ? 'rightLeft' : 'upDown'
            direction2 = first ? 'upDown' : 'rightLeft'
            sameColRow = first ? 'sameRow' : 'sameCol'
        }
        if (!this.goOtherWay || this.goAroundCell) {
            if (this.right || this.left) genDirections()
            else if (this.up || this.down) genDirections(false)
        }
        else {
            if (this.up || this.down) genDirections(false)
            else if (this.right || this.left) genDirections()
        }

        return [ direction1, direction2, sameColRow ]
    }
    
    oppositeDirection(dirrection) {
        if (dirrection === 'up') return 'down'
        if (dirrection === 'down') return 'up'
        if (dirrection === 'left') return 'right'
        if (dirrection === 'right') return 'left'
    }

    drawPath(direction) {
        let left, top, path
        const diff_ee = linkEEhelper.getDiffEE(direction, this.link1, this.link2, 'out') || 0

        if (direction === 'up') {
            left = this.hm_path + this.center_big + diff_ee
            top =  this.vm_path + this.center_small
            path = `M${left} ${top} v-${this.center_small}`
        }
        else if (direction === 'down') {
            left = this.hm_path + this.center_big + diff_ee
            top =  this.vm_path + (this.cell_size - this.center_small)
            path = `M${left} ${top} v${this.center_small}`
        }
        else if (direction === 'left') {
            left = this.hm_path + this.center_small
            top =  this.vm_path + this.center_big + diff_ee
            path = `M${left} ${top} h-${this.center_small}`
        }
        else if (direction === 'right') {
            left = this.hm_path + (this.cell_size - this.center_small)
            top =  this.vm_path + this.center_big + diff_ee
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
            distance = this.center_small - this.arrow_w
        
        else if (lineType === 'full') 
            distance = this.cell_size * (cell1 - cell2 - 1)

        return ` ${d}${distance}`
    }
    drawHalf(direction = '', directionInOut = '', firstHalf) {
        let d, diff_ee, distance
        
        if (direction === 'up') d = 'v-'
        if (direction === 'down') d = 'v'
        if (direction === 'right') d = 'h'
        if (direction === 'left') d = 'h-'

        distance = this.center_big
        if (firstHalf) {
            const oppositeDirection = this.oppositeDirection(directionInOut)
            diff_ee = linkEEhelper.getDiffEE(oppositeDirection, this.link1, this.link2, 'in') || 0

            if (['left', 'up'].includes(oppositeDirection)) distance += diff_ee
            else if (['right', 'down'].includes(oppositeDirection)) distance -= diff_ee
        }
        else {
            diff_ee = linkEEhelper.getDiffEE(directionInOut, this.link1, this.link2, 'out') || 0
            const oppositeDirection = this.oppositeDirection(direction)

            if (['left', 'up'].includes(oppositeDirection)) distance -= diff_ee
            else if (['right', 'down'].includes(oppositeDirection)) distance += diff_ee
        }

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
        if (direction === 'up') arrowPath = this.downArrowPath
        else if (direction === 'down') arrowPath = this.upArrowPath
        else if (direction === 'left') arrowPath = this.rightArrowPath
        else if (direction === 'right') arrowPath = this.leftArrowPath

        return {a: 1, d: `M${left} ${top} ${arrowPath}`}
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

    get upArrowPath() { 
        const gc = globalConfig
        return `h${gc.arrowPointerHeight} l-${gc.arrowPointerHeight} ${gc.arrowPointerWidth} l-${gc.arrowPointerHeight} -${gc.arrowPointerWidth} Z`
    }
    get downArrowPath() { 
        const gc = globalConfig
        return `h${gc.arrowPointerHeight} l-${gc.arrowPointerHeight} -${gc.arrowPointerWidth} l-${gc.arrowPointerHeight} ${gc.arrowPointerWidth} Z`
    }
    get leftArrowPath() { 
        const gc = globalConfig
        return `v-${gc.arrowPointerHeight} l${gc.arrowPointerWidth} ${gc.arrowPointerHeight} l-${gc.arrowPointerWidth} ${gc.arrowPointerHeight} Z`
    }
    get rightArrowPath() { 
        const gc = globalConfig
        return `v-${gc.arrowPointerHeight} l-${gc.arrowPointerWidth} ${gc.arrowPointerHeight} l${gc.arrowPointerWidth} ${gc.arrowPointerHeight}`
    }

    
}
