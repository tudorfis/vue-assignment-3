import { globalConfig } from '../../../../config/global.config'
import { SvgPathUtils } from '../../../../utils/svgPath.utils'
import linkEEMapHelper from '../../helpers/linkEEMap.helper'
import { LinkHelper } from '../../helpers/link.helper'
import { SvgDrawBase } from './SvgDrawBase'

class SvgDrawArrow extends SvgDrawBase {
    constructor(lh) {
        super(lh)
    }
    drawArrow(path, direction)  {
        const difference_ee = linkEEMapHelper.createEEDifferenceForArrow(this.lh, direction)
        this.adjustArrowPath(path, direction, difference_ee)
        
        this.addRemainingDistance(path, direction)

        const { svgLeft, svgTop } = SvgPathUtils.getM(path.svgD)
        const arrowDraw = this[`${direction}ArrowDraw`]

        return {
            isArrow: true,
            svgD: `M${svgLeft} ${svgTop} ${arrowDraw}`
        }
    }

    adjustArrowPath(path, direction, difference_ee) {
        const { svgLeft, svgTop } = this.getCurrentSvgLeftTop(path, direction)
        const { svgCorrectLeft, svgCorrectTop } = this.getBestSvgArrowLeftTop(direction, difference_ee)

        const svgPathMap = SvgPathUtils.getPathMap(path.svgD)

        if (svgTop !== svgCorrectTop) {
            const vDiff = Math.max(svgTop, svgCorrectTop) - Math.min(svgTop, svgCorrectTop)
            const vItem = svgPathMap.slice(3).find(item => item.direction && item.direction === 'v')
            
            if (vItem) {
                if (svgTop > svgCorrectTop) vItem.distance -= vDiff
                else vItem.distance += vDiff
            }
        }

        if (svgLeft !== svgCorrectLeft) {
            const hDiff = Math.max(svgLeft, svgCorrectLeft) - Math.min(svgLeft, svgCorrectLeft)
            const hItem = svgPathMap.slice(3).find(item => item.direction && item.direction === 'h')
            
            if (hItem) {
                if (svgLeft > svgCorrectLeft) hItem.distance -= hDiff
                else hItem.distance += hDiff
            }
        }

        if (svgTop !== svgCorrectTop || svgLeft !== svgCorrectLeft)
            path.svgD = SvgPathUtils.generateSvgD(svgPathMap)
    }
    getCurrentSvgLeftTop(path, direction) {
        const svgD = this.getSvgD(direction)
        return SvgPathUtils.getM(path.svgD + ` ${svgD}${this.cellelement_center_size}`)
    }
    getBestSvgArrowLeftTop(direction, difference_ee) {
        const arrowDirection = LinkHelper.getOpositeDirection(direction)
        const { linkKey } = this.lh

        const tempLh = this.lh
        this.lh = new LinkHelper(linkKey, true)

        let svgCorrectLeft, svgCorrectTop
        if (arrowDirection === 'up') {
            svgCorrectLeft = this.horizontal_M + this.cell_center_size - difference_ee
            svgCorrectTop =  this.vertical_M + this.cellelement_center_size
        }
        else if (arrowDirection === 'down') {
            svgCorrectLeft = this.horizontal_M + this.cell_center_size - difference_ee
            svgCorrectTop =  this.vertical_M + (this.cell_size - this.cellelement_center_size)
        }
        else if (arrowDirection === 'left') {
            svgCorrectLeft = this.horizontal_M + this.cellelement_center_size
            svgCorrectTop =  this.vertical_M + this.cell_center_size - difference_ee
        }
        else if (arrowDirection === 'right') {
            svgCorrectLeft = this.horizontal_M + (this.cell_size - this.cellelement_center_size)
            svgCorrectTop =  this.vertical_M + this.cell_center_size - difference_ee
        }

        this.lh = tempLh
        return { svgCorrectLeft, svgCorrectTop }
    }

    addRemainingDistance(path, direction) {
        const { row1, col1 } = this.lh
        let adjustForGridEdges = 0

        if (direction === 'down') {
            adjustForGridEdges = (row1 === 1 ? -5 : 0)
        }
        else if (direction === 'right') {
            adjustForGridEdges = (col1 === 1 ? -5 : 0)
        }

        const svgD = this.getSvgD(direction)
        const distance = this.cellelement_center_size - this.arrow_width + 3 + adjustForGridEdges

        path.svgD += ` ${svgD}${distance}`
    }

    get downArrowDraw() { 
        const { arrowPointerHeight, arrowPointerWidth } = globalConfig
        return `h${arrowPointerHeight} l-${arrowPointerHeight} ${arrowPointerWidth} l-${arrowPointerHeight} -${arrowPointerWidth} Z`
    }
    get upArrowDraw() { 
        const { arrowPointerHeight, arrowPointerWidth } = globalConfig
        return `h${arrowPointerHeight} l-${arrowPointerHeight} -${arrowPointerWidth} l-${arrowPointerHeight} ${arrowPointerWidth} Z`
    }
    get rightArrowDraw() { 
        const { arrowPointerHeight, arrowPointerWidth } = globalConfig
        return `v-${arrowPointerHeight} l${arrowPointerWidth} ${arrowPointerHeight} l-${arrowPointerWidth} ${arrowPointerHeight} Z`
    }
    get leftArrowDraw() { 
        const { arrowPointerHeight, arrowPointerWidth } = globalConfig
        return `v-${arrowPointerHeight} l-${arrowPointerWidth} ${arrowPointerHeight} l${arrowPointerWidth} ${arrowPointerHeight} Z`
    }
}

globalThis.SvgDrawArrow = SvgDrawArrow
export { SvgDrawArrow }
