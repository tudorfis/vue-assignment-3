
import { globalConfig } from '../../../config/global.config'
import linkEEhelper from './linkEE.helper'

const arrowSizeW = globalConfig.arrowSizeW
const arrowSizeH = globalConfig.arrowSizeH

const northArrowPath = `h${arrowSizeH} l-${arrowSizeH} ${arrowSizeW} l-${arrowSizeH} -${arrowSizeW} Z`
const southArrowPath = `h${arrowSizeH} l-${arrowSizeH} -${arrowSizeW} l-${arrowSizeH} ${arrowSizeW} Z`
const westArrowPath = `v-${arrowSizeW} l${arrowSizeW} ${arrowSizeH} l-${arrowSizeW} ${arrowSizeH} Z`
const eastArrowPath = `v-${arrowSizeW} l-${arrowSizeW} ${arrowSizeH} l${arrowSizeW} ${arrowSizeH} Z`


const cell_size = globalConfig.cellSizeCalculation
const cell_adjust = globalConfig.cellAdjustCalculation

const link_separator = globalConfig.linkSeparator
const arrow_width = globalConfig.arrowWidth

export class LinkDrawHelper {
    constructor(linkKey, gridModel) {
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

    drawLine(type = '', lineType = '', link1 = null, link2 = null) {
        if (type === 'north') type = 'down'
        if (type === 'south') type = 'up'
        if (type === 'west') type = 'right'
        if (type === 'east') type = 'left'

        let d, distance, cell1, cell2
        if (type === 'up') {
            d = 'v-'
            cell1 = this.row1
            cell2 = this.row2
        }
        else if (type === 'down') {
            d = 'v';
            cell1 = this.row2
            cell2 = this.row1
        }
        else if (type === 'right') {
            d = 'h';    
            cell1 = this.col2
            cell2 = this.col1
        }
        else if (type === 'left') {
            d = 'h-'
            cell1 = this.col1
            cell2 = this.col2
        }
 
        if (lineType === 'arrow') 
            distance = 35

        else if (lineType === 'full') 
            distance = cell_size * (cell1 - cell2 - 1)
        
        else if (lineType === 'half')
            distance = (this.left ? 117 : 123)

        return ` ${d}${distance}`
    }
    drawPath(type, link1, link2) {
        let left, top, path
        const diff_ee = linkEEhelper.getDiffEE(type, link1, link2, 'out')

        if (type === 'up') {
            left = this.get_left_m_path() + 125 + diff_ee
            top =  this.get_top_m_path(true) + 52
            path = `M${left} ${top} v-50`
        }
        else if (type === 'down') {
            left = this.get_left_m_path() + 125 + diff_ee
            top =  this.get_top_m_path(true) + (cell_size - 48)
            path = `M${left} ${top} v50`
        }
        else if (type === 'left') {
            left = this.get_left_m_path(true) + 52
            top =  this.get_top_m_path() + 125 + diff_ee
            path = `M${left} ${top} h-50`
        }
        else if (type === 'right') {
            left = this.get_left_m_path(true) + (cell_size - 48)
            top =  this.get_top_m_path() + 125 + diff_ee
            path = `M${left} ${top} h50`
        }

        return { a: 0, d: path }
    }
    drawArrow(type, link1, link2)  {
        let left, top, arrow
        const diff_ee = linkEEhelper.getDiffEE(type, link1, link2, 'in')

        if (type === 'north') {
            left = this.get_left_m_arrow() + 125 + diff_ee
            top = this.get_top_m_arrow(true) + 30
            arrow = `M${left} ${top} ${northArrowPath}`
        }
        else if (type === 'south') {
            left = this.get_left_m_arrow() + 125 + diff_ee
            top = this.get_top_m_arrow(true) + (cell_size - 25)
            arrow = `M${left} ${top} ${southArrowPath}`
        }
        else if (type === 'west') {
            left = this.get_left_m_arrow(true) + 28
            top = this.get_top_m_arrow() + 130 + diff_ee
            arrow = `M${left} ${top} ${westArrowPath}`
        }
        else if (type === 'east') {
            left = this.get_left_m_arrow(true) + (cell_size - 23)
            top = this.get_top_m_arrow() + 130 + diff_ee
            arrow = `M${left} ${top} ${eastArrowPath}`
        }

        return {a: 1, d: arrow}
    }

    get_left_m_path(adjust = false) {
        const cell_starting_point       = (this.col1 - 1) * cell_size
        const arrow_difference          = arrow_width / 2
        const cell_adjustment_for_svg   = adjust ? (this.col1 - 1) * cell_adjust : 0

        return cell_starting_point  +  arrow_difference  +  cell_adjustment_for_svg
    }
    get_top_m_path(adjust = false) {
        const cell_starting_point       = (this.row1 - 1) * cell_size
        const arrow_difference          = arrow_width / 2
        const cell_adjustment_for_svg   = adjust ? (this.row1 - 1) * cell_adjust : 0

        return cell_starting_point  +  arrow_difference  +  cell_adjustment_for_svg
    }
    get_left_m_arrow(adjust = false) {
        const cell_starting_point       = (this.col2 - 1) * cell_size
        const arrow_difference          = arrow_width / 2
        const cell_adjustment_for_svg   = adjust ? (this.col2 - 1) * cell_adjust : 0

        return cell_starting_point  +  arrow_difference  +  cell_adjustment_for_svg
    }
    get_top_m_arrow(adjust = false) {
        const cell_starting_point       = (this.row2 - 1) * cell_size
        const arrow_difference          = arrow_width / 2
        const cell_adjustment_for_svg   = adjust ? (this.row2 - 1) * cell_adjust : 0

        return cell_starting_point  +  arrow_difference  +  cell_adjustment_for_svg
    }
}
