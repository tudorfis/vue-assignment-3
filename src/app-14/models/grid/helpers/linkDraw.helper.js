
import { globalConfig } from '../../../config/global.config'
import linkEEhelper from './linkEE.helper'
import { gridModel } from '../grid.model'

const gc = globalConfig

const upArrowPath = _=> `h${gc.arrowSizeH} l-${gc.arrowSizeH} ${gc.arrowSizeW} l-${gc.arrowSizeH} -${gc.arrowSizeW} Z`
const downArrowPath = _=> `h${gc.arrowSizeH} l-${gc.arrowSizeH} -${gc.arrowSizeW} l-${gc.arrowSizeH} ${gc.arrowSizeW} Z`
const leftArrowPath = _=> `v-${gc.arrowSizeW} l${gc.arrowSizeW} ${gc.arrowSizeH} l-${gc.arrowSizeW} ${gc.arrowSizeH} Z`
const rightArrowPath = _=> `v-${gc.arrowSizeW} l-${gc.arrowSizeW} ${gc.arrowSizeH} l${gc.arrowSizeW} ${gc.arrowSizeH} Z`

const cell_size = globalConfig.cellSizeCalculation
const cell_adjust = globalConfig.cellAdjustCalculation

const link_separator = globalConfig.linkSeparator
const arrow_width = globalConfig.arrowWidth

export class LinkDrawHelper {
    constructor(linkKey) {
        if (!linkKey) {
            this.badLinkKey = true
            return
        }

        this.link1 = LinkDrawHelper.getLink1(linkKey)
        this.link2 = LinkDrawHelper.getLink2(linkKey)

        this.row1 = gridModel.getRow(this.link1)
        this.col1 = gridModel.getCol(this.link1)

        this.row2 = gridModel.getRow(this.link2)
        this.col2 = gridModel.getCol(this.link2)
    }
    static getLink1(linkKey) {
        return linkKey.split(link_separator)[0]
    }
    static getLink2(linkKey) {
        return linkKey.split(link_separator)[1]
    }
    static genLinkKey(link1, link2) {
        return `${link1}${link_separator}${link2}`
    }
    get idLink() {
        const id1 = gridModel.model.cells[this.link1].id
        const id2 = gridModel.model.cells[this.link2].id

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
            left = this.get_left_m_path() + 125 + diff_ee
            top =  this.get_top_m_path(true) + 52
            path = `M${left} ${top} v-50`
        }
        else if (direction === 'down') {
            left = this.get_left_m_path() + 125 + diff_ee
            top =  this.get_top_m_path(true) + (cell_size - 48)
            path = `M${left} ${top} v50`
        }
        else if (direction === 'left') {
            left = this.get_left_m_path(true) + 52
            top =  this.get_top_m_path() + 125 + diff_ee
            path = `M${left} ${top} h-50`
        }
        else if (direction === 'right') {
            left = this.get_left_m_path(true) + (cell_size - 48)
            top =  this.get_top_m_path() + 125 + diff_ee
            path = `M${left} ${top} h50`
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
            distance = 35

        else if (lineType === 'full') 
            distance = cell_size * (cell1 - cell2 - 1)

        return ` ${d}${distance}`
    }
    drawHalf(direction = '', directionInOut = '', firstHalf) {
        let d, diff_ee
        if (direction === 'up') d = 'v-'
        if (direction === 'down') d = 'v'
        if (direction === 'right') d = 'h'
        if (direction === 'left') d = 'h-'

        let distance = this.left ? 117 : 123

        if (firstHalf) {
            diff_ee = linkEEhelper.getDiffEE(this.oppositeDirection(directionInOut), this.link1, this.link2, 'in') || 0

            if (direction === 'left') distance -= diff_ee
            else if (direction === 'right') distance += diff_ee
        
        } else {
            diff_ee = linkEEhelper.getDiffEE(directionInOut, this.link1, this.link2, 'out') || 0

            if (direction === 'up') distance += diff_ee
            else if (direction === 'down') distance -= diff_ee
        }

        return ` ${d}${distance}`
    }
    drawArrow(direction, sameRowCol)  {
        let left, top, arrow, diff_ee

        if (sameRowCol) {
            diff_ee = linkEEhelper.getDiffEE(direction, this.link1, this.link2, 'out') || 0
            direction = this.oppositeDirection(direction)
        }
        else {
            direction = this.oppositeDirection(direction)
            diff_ee = linkEEhelper.getDiffEE(direction, this.link1, this.link2, 'in') || 0
        }

        if (direction === 'up') {
            left = this.get_left_m_arrow() + 125 + diff_ee
            top = this.get_top_m_arrow(true) + 30
            arrow = `M${left} ${top} ${upArrowPath()}`
        }
        else if (direction === 'down') {
            left = this.get_left_m_arrow() + 125 + diff_ee
            top = this.get_top_m_arrow(true) + (cell_size - 20)
            arrow = `M${left} ${top} ${downArrowPath()}`
        }
        else if (direction === 'left') {
            left = this.get_left_m_arrow(true) + 28
            top = this.get_top_m_arrow() + 130 + diff_ee
            arrow = `M${left} ${top} ${leftArrowPath()}`
        }
        else if (direction === 'right') {
            left = this.get_left_m_arrow(true) + (cell_size - 23)
            top = this.get_top_m_arrow() + 130 + diff_ee
            arrow = `M${left} ${top} ${rightArrowPath()}`
        }

        return {a: 1, d: arrow}
    }

    get_left_m_path(adjust = false) {
        const cell_starting_point       = (this.col1 - 1) * cell_size
        const arrow_difference          = arrow_width / 2
        const cell_adjustment_for_svg   = (adjust ? (this.col1 - 1) * cell_adjust : 0)

        return cell_starting_point  +  arrow_difference  +  cell_adjustment_for_svg
    }
    get_top_m_path(adjust = false) {
        const cell_starting_point       = (this.row1 - 1) * cell_size
        const arrow_difference          = arrow_width / 2
        const cell_adjustment_for_svg   = (adjust ? (this.row1 - 1) * cell_adjust : 0)

        return cell_starting_point  +  arrow_difference  +  cell_adjustment_for_svg
    }
    get_left_m_arrow(adjust = false) {
        const cell_starting_point       = (this.col2 - 1) * cell_size
        const arrow_difference          = arrow_width / 2
        const cell_adjustment_for_svg   = (adjust ? (this.col2 - 1) * cell_adjust : 0)

        return cell_starting_point  +  arrow_difference  +  cell_adjustment_for_svg
    }
    get_top_m_arrow(adjust = false) {
        const cell_starting_point       = (this.row2 - 1) * cell_size
        const arrow_difference          = arrow_width / 2
        const cell_adjustment_for_svg   = (adjust ? (this.row2 - 1) * cell_adjust : 0)

        return cell_starting_point  +  arrow_difference  +  cell_adjustment_for_svg
    }
}
