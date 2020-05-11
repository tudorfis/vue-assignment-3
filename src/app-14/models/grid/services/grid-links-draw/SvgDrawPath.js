import { SvgDrawBase } from './SvgDrawBase'
import linkEEMapHelper from '../../helpers/linkEEMap.helper'
import { linkPathDragHelper } from '../../helpers/linkPathDrag.helper'

class SvgDrawPath extends SvgDrawBase {
    constructor(lh) {
        super(lh)
    }
    drawPath(direction) {
        const { arrowPointerAdjust } = this.getArrowPointers()
        let svgLeft, svgTop, svgPath, adjustForGridEdges = 0
        const difference_ee = this.getDifferenceEE(direction)

        if (direction === 'up') {
            adjustForGridEdges = (this.lh.row1 === 1 ? -arrowPointerAdjust : 0)
            svgLeft = this.horizontal_M + this.cell_center_size_width - difference_ee
            svgTop =  this.vertical_M + this.cellelement_center_size_height
            svgPath = `M${svgLeft} ${svgTop} v-${this.cellelement_center_size_height + adjustForGridEdges}`
        }
        else if (direction === 'down') {
            svgLeft = this.horizontal_M + this.cell_center_size_width - difference_ee
            svgTop =  this.vertical_M + (this.cell_size_height - this.cellelement_center_size_height)
            svgPath = `M${svgLeft} ${svgTop} v${this.cellelement_center_size_height}`
        }
        else if (direction === 'left') {
            adjustForGridEdges = (this.lh.col1 === 1 ? -arrowPointerAdjust : 0)
            svgLeft = this.horizontal_M + this.cellelement_center_size_width
            svgTop =  this.vertical_M + this.cell_center_size_height - difference_ee
            svgPath = `M${svgLeft} ${svgTop} h-${this.cellelement_center_size_width + adjustForGridEdges}`
        }
        else if (direction === 'right') {
            svgLeft = this.horizontal_M + (this.cell_size_width - this.cellelement_center_size_width)
            svgTop =  this.vertical_M + this.cell_center_size_height - difference_ee
            svgPath = `M${svgLeft} ${svgTop} h${this.cellelement_center_size_width}`
        }

        return { 
            isArrow: false,
            svgD: svgPath
        }
    }
    drawLine(direction) {
        let cell1, cell2
        const { row1, row2, col1, col2 } = this.lh
        const { cell_size } = this.getCellsSizes(direction)

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
 
        const distance = cell_size * (cell1 - cell2 - 1)
        const svgD = this.getSvgD(direction)

        return ` ${svgD}${distance}`
    }
    drawCell(direction) {
        const svgD = this.getSvgD(direction)
        const { cell_size } = this.getCellsSizes(direction)
        const distance = cell_size

        return ` ${svgD}${distance}`
    }
    drawHalf(direction = '') {
        const svgD = this.getSvgD(direction)
        const { cell_center_size } = this.getCellsSizes(direction)
        const distance = cell_center_size

        return ` ${svgD}${distance}`
    }
    getDifferenceEE(direction) {
        const { linkKey } = this.lh
        const { splitType } = gridModel.getLinkAttribute(linkKey)
        const diffPoint = splitType === 'yes' ? 3 : splitType === 'no' ? 2 : 0

        return !!diffPoint ?
            linkEEMapHelper.getDiffByPoint(diffPoint) :
            linkEEMapHelper.createEEDifferenceForPath(this.lh, direction)
    }
}

globalThis.SvgDrawPath = SvgDrawPath
export { SvgDrawPath }
