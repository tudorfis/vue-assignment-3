import { globalConfig } from '../../../../config/global.config'
import { SvgPathUtils } from '../../../../utils/svgPath.utils'
import linkEEMapHelper from '../../helpers/linkEEMap.helper'
import { LinkHelper } from '../../helpers/link.helper'
import { SvgDrawBase } from './SvgDrawBase'
import { gridModel } from '../../grid.model'

class SvgDrawArrow extends SvgDrawBase {
    constructor(lh) {
        super(lh)
    }
    drawArrow(path, direction)  {
        const difference_ee = linkEEMapHelper.createEEDifferenceForArrow(this.lh, direction)
        this.adjustArrowPath(path, direction, difference_ee)
        
        this.addRemainingDistance(path, direction)

        const linkAttribute = gridModel.getLinkAttribute(this.lh.linkKey)
        const hideHead = linkAttribute && linkAttribute.hideHead

        const { svgLeft, svgTop } = SvgPathUtils.getM(path.svgD)
        const arrowDraw = this[`${direction}ArrowDraw`]

        let svgD = `M${svgLeft} ${svgTop}`
        svgD += !hideHead ? ` ${arrowDraw}` : ''

        return {
            isArrow: true,
            svgD
        }
    }

    adjustArrowPath(path, direction, difference_ee) {
        const { svgLeft, svgTop } = this.getCurrentSvgLeftTop(path, direction)
        const { svgCorrectLeft, svgCorrectTop } = this.getBestSvgArrowLeftTop(direction, difference_ee)
        const svgPathMap = SvgPathUtils.getPathMap(path.svgD)

        if (this.isStraightLine(svgPathMap) && this.isOverlapLine(direction)) {
            if (svgTop !== svgCorrectTop) svgPathMap[1] = svgCorrectTop
            else if (svgLeft !== svgCorrectLeft) svgPathMap[0] = svgCorrectLeft
        }
        else {
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
        }

        if (svgTop !== svgCorrectTop || svgLeft !== svgCorrectLeft)
            path.svgD = SvgPathUtils.generateSvgD(svgPathMap)
    }
    isOverlapLine(direction) {
        const eeMapOut = linkEEMapHelper.eeMap[this.lh.link1][direction].out[this.lh.link2]
        const eeMapIn = linkEEMapHelper.eeMap[this.lh.link2][LinkHelper.getOpositeDirection(direction)].in[this.lh.link1]
        
        return eeMapIn > eeMapOut
    }
    isStraightLine(svgPathMap) {
        const hItems = svgPathMap.filter(item => item.direction && item.direction === 'h') || []
        const vItems = svgPathMap.filter(item => item.direction && item.direction === 'v') || []
        
        return (hItems.length && !vItems.length) || (vItems.length && !hItems.length)
    }
    getCurrentSvgLeftTop(path, direction) {
        const svgD = this.getSvgD(direction)
        const { cellelement_center_size } = this.getCellsSizes(direction)

        return SvgPathUtils.getM(path.svgD + ` ${svgD}${cellelement_center_size}`)
    }
    getBestSvgArrowLeftTop(direction, difference_ee) {
        const arrowDirection = LinkHelper.getOpositeDirection(direction)
        const { linkKey } = this.lh

        const tempLh = this.lh
        this.lh = new LinkHelper(linkKey, true)

        let svgCorrectLeft, svgCorrectTop

        if (arrowDirection === 'up') {
            svgCorrectLeft = this.horizontal_M + this.cell_center_size_width - difference_ee
            svgCorrectTop =  this.vertical_M + this.cellelement_center_size_height
        }
        else if (arrowDirection === 'down') {
            svgCorrectLeft = this.horizontal_M + this.cell_center_size_width - difference_ee
            svgCorrectTop =  this.vertical_M + (this.cell_size_height - this.cellelement_center_size_height)
        }
        else if (arrowDirection === 'left') {
            svgCorrectLeft = this.horizontal_M + this.cellelement_center_size_width
            svgCorrectTop =  this.vertical_M + this.cell_center_size_height - difference_ee
        }
        else if (arrowDirection === 'right') {
            svgCorrectLeft = this.horizontal_M + (this.cell_size_width - this.cellelement_center_size_width)
            svgCorrectTop =  this.vertical_M + this.cell_center_size_height - difference_ee
        }

        this.lh = tempLh
        return { svgCorrectLeft, svgCorrectTop }
    }

    addRemainingDistance(path, direction) {
        const { row1, col1, linkKey } = this.lh
        let adjustForGridEdges = 0

        if (direction === 'down') {
            adjustForGridEdges = (row1 === 1 ? -5 : 0)
        }
        else if (direction === 'right') {
            adjustForGridEdges = (col1 === 1 ? -5 : 0)
        }

        const svgD = this.getSvgD(direction)
        const { cellelement_center_size } = this.getCellsSizes(direction)

        let distance = cellelement_center_size + adjustForGridEdges
        
        const linkAttribute = gridModel.getLinkAttribute(linkKey)
        const hideHead = linkAttribute && linkAttribute.hideHead

        if (!hideHead) {
            let { arrowPointerAdjust } = this.getArrowPointers()
            if (arrowPointerAdjust > 3) arrowPointerAdjust -= 3

            distance -= this.arrow_width - arrowPointerAdjust
        }
        
        if (distance <= 0) distance = 2
        
        path.svgD += ` ${svgD}${distance}`
    }

    get downArrowDraw() { 
        const { arrowPointerHeight, arrowPointerWidth } = this.getArrowPointers()
        return `h${arrowPointerHeight} l-${arrowPointerHeight} ${arrowPointerWidth} l-${arrowPointerHeight} -${arrowPointerWidth} Z`
    }
    get upArrowDraw() { 
        const { arrowPointerHeight, arrowPointerWidth } = this.getArrowPointers()
        
        return `h${arrowPointerHeight} l-${arrowPointerHeight} -${arrowPointerWidth} l-${arrowPointerHeight} ${arrowPointerWidth} Z`
    }
    get rightArrowDraw() { 
        const { arrowPointerHeight, arrowPointerWidth } = this.getArrowPointers()
        return `v-${arrowPointerHeight} l${arrowPointerWidth} ${arrowPointerHeight} l-${arrowPointerWidth} ${arrowPointerHeight} Z`
    }
    get leftArrowDraw() { 
        const { arrowPointerHeight, arrowPointerWidth } = this.getArrowPointers()
        return `v-${arrowPointerHeight} l-${arrowPointerWidth} ${arrowPointerHeight} l${arrowPointerWidth} ${arrowPointerHeight} Z`
    }
}

globalThis.SvgDrawArrow = SvgDrawArrow
export { SvgDrawArrow }
