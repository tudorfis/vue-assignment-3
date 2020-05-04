import { SvgDrawBase } from './SvgDrawBase'
import linkEEMapHelper from '../../helpers/link-ee/linkEEMap.helper'

class SvgDrawPath extends SvgDrawBase {
    constructor(lh) {
        super(lh)
    }
    drawPath(direction) {
        let svgLeft, svgTop, svgPath, adjustForGridEdges = 0
        const difference_ee = linkEEMapHelper.createEEDifferenceForPath(this.lh, direction)

        if (direction === 'up') {
            adjustForGridEdges = (this.lh.row1 === 1 ? -5 : 0)
            svgLeft = this.horizontal_M + this.cell_center_size - difference_ee
            svgTop =  this.vertical_M + this.cellelement_center_size
            svgPath = `M${svgLeft} ${svgTop} v-${this.cellelement_center_size + adjustForGridEdges}`
        }
        else if (direction === 'down') {
            svgLeft = this.horizontal_M + this.cell_center_size - difference_ee
            svgTop =  this.vertical_M + (this.cell_size - this.cellelement_center_size)
            svgPath = `M${svgLeft} ${svgTop} v${this.cellelement_center_size}`
        }
        else if (direction === 'left') {
            adjustForGridEdges = (this.lh.col1 === 1 ? -5 : 0)
            svgLeft = this.horizontal_M + this.cellelement_center_size
            svgTop =  this.vertical_M + this.cell_center_size - difference_ee
            svgPath = `M${svgLeft} ${svgTop} h-${this.cellelement_center_size + adjustForGridEdges}`
        }
        else if (direction === 'right') {
            svgLeft = this.horizontal_M + (this.cell_size - this.cellelement_center_size)
            svgTop =  this.vertical_M + this.cell_center_size - difference_ee
            svgPath = `M${svgLeft} ${svgTop} h${this.cellelement_center_size}`
        }

        return { 
            isArrow: false,
            svgD: svgPath
        }
    }
    drawLine(direction) {
        let cell1, cell2 = 0
        const { row1, row2, col1, col2 } = this.lh

        if (direction === 'up') {
            cell1 = row1
            cell2 = row2
        }
        else if (direction === 'down') {
            cell1 = row2
            cell2 = row1
        }
        else if (direction === 'right') {
            cell1 = col2
            cell2 = col1
        }
        else if (direction === 'left') {
            cell1 = col1
            cell2 = col2
        }
 
        const distance = this.cell_size * (cell1 - cell2 - 1)
        const svgD = this.getSvgD(direction)

        return ` ${svgD}${distance}`
    }
    drawCell(direction) {
        const svgD = this.getSvgD(direction)
        const distance = this.cell_size

        return ` ${svgD}${distance}`
    }
    drawHalf(direction = '') {
        const svgD = this.getSvgD(direction)
        const distance = this.cell_center_size

        return ` ${svgD}${distance}`
    }
}

globalThis.SvgDrawPath = SvgDrawPath
export { SvgDrawPath }
