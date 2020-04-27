import { globalConfig as gc } from '../../../../config/global.config'
import { linkEEDiffHelper } from '../../helpers/link-ee/linkEEDiff.helper' 
import { LinkHelper } from '../../helpers/link.helper'

class SvgDrawPath {
    constructor(lh) {
        this.lh = lh
    }
    drawPath(direction) {
        let svgLeft, svgTop, svgPath
        const difference_ee = linkEEDiffHelper.getDiff({
            link1: this.lh.link1,
            link2: this.lh.link2,
            direction,
            type: 'out'
        })

        if (direction === 'up') {
            svgLeft = this.horizontal_M + this.cell_center_size + difference_ee
            svgTop =  this.vertical_M + this.cellelement_center_size
            svgPath = `M${svgLeft} ${svgTop} v-${this.cellelement_center_size + (this.lh.row1 === 1 ? -5 : 0)}`
        }
        else if (direction === 'down') {
            svgLeft = this.horizontal_M + this.cell_center_size + difference_ee
            svgTop =  this.vertical_M + (this.cell_size - this.cellelement_center_size)
            svgPath = `M${svgLeft} ${svgTop} v${this.cellelement_center_size}`
        }
        else if (direction === 'left') {
            svgLeft = this.horizontal_M + this.cellelement_center_size
            svgTop =  this.vertical_M + this.cell_center_size + difference_ee
            svgPath = `M${svgLeft} ${svgTop} h-${this.cellelement_center_size + (this.lh.col1 === 1 ? -5 : 0)}`
        }
        else if (direction === 'right') {
            svgLeft = this.horizontal_M + (this.cell_size - this.cellelement_center_size)
            svgTop =  this.vertical_M + this.cell_center_size + difference_ee
            svgPath = `M${svgLeft} ${svgTop} h${this.cellelement_center_size}`
        }

        return { 
            isArrow: false,
            svgD: svgPath
        }
    }
    drawLine(direction = '', lineType = '') {
        let distance, cell1, cell2, adjust = 0
        if (direction === 'up') {
            cell1 = this.lh.row1
            cell2 = this.lh.row2
        }
        else if (direction === 'down') {
            cell1 = this.lh.row2
            cell2 = this.lh.row1
            adjust = (this.lh.row1 === 1 ? -5 : 0)
        }
        else if (direction === 'right') {
            cell1 = this.lh.col2
            cell2 = this.lh.col1
            adjust = (this.lh.col1 === 1 ? -5 : 0)
        }
        else if (direction === 'left') {
            cell1 = this.lh.col1
            cell2 = this.lh.col2
        }
 
        if (lineType === 'arrow')
            distance = this.cellelement_center_size - this.arrow_width + 3 + adjust
        
        else if (lineType === 'full') 
            distance = this.cell_size * (cell1 - cell2 - 1)

        const svgD = this.getSvgD(direction)
        return ` ${svgD}${distance}`
    }
    drawHalfOut(outDirection = '', inDirection = '') {
        const svgD = this.getSvgD(outDirection)

        let distance = this.cell_center_size
        distance += linkEEDiffHelper.getDrawHalfDiffOut(this.lh, LinkHelper.getOpositeDirection(inDirection))

        return ` ${svgD}${distance}`
    }
    drawHalfIn(inDirection = '', outDirection = '') {
        const svgD = this.getSvgD(inDirection)

        let distance = this.cell_center_size
        distance += linkEEDiffHelper.getDrawHalfDiffIn(this.lh, inDirection, outDirection)

        return ` ${svgD}${distance}`
    }

    getSvgD(direction) {
        if (direction === 'up') return 'v-'
        else if (direction === 'down') return 'v'
        else if (direction === 'right') return 'h'
        else if (direction === 'left') return 'h-'
    }
    get horizontal_M() {
        return (this.lh.col1 - 1) * this.cell_size
    }
    get vertical_M() {
        return (this.lh.row1 - 1) * this.cell_size
    }
    get cell_size() { 
        return gc.gridCellWidth
    }
    get cell_center_size() {
        return gc.gridCellWidth / 2
    }
    get cellelement_center_size() {
        return (gc.gridCellWidth - gc.gridCellElementWidth) / 2
    }
    get arrow_width() { 
        return gc.arrowPointerWidth + 3
    }
}

globalThis.SvgDrawPath = SvgDrawPath
export { SvgDrawPath }
