import { SvgPathUtils } from '../../../../utils/svgPath.utils'
import linkEEMapHelper from '../../helpers/linkEEMap.helper'
import { SvgDrawBase } from './SvgDrawBase'
import { gridModel } from '../../grid.model'
import { SvgPathImprover } from './utilities/SvgPathImprover'
import { SvgPathAdjuster } from './utilities/SvgPathAdjuster'

class SvgDrawArrow extends SvgDrawBase {
    constructor(lh) {
        super(lh)
    }
    drawArrow(path, direction)  {
        const difference_ee = linkEEMapHelper.createEEDifferenceForArrow(this.lh, direction)
        
        const svgPathAdjuster = new SvgPathAdjuster(this)
        svgPathAdjuster.adjustArrowPath(path, direction, difference_ee)

        const svgPathImprover = new SvgPathImprover(this)
        path.svgD = svgPathImprover.improvePath(path.svgD)
        path.svgD = svgPathImprover.improveEdges(path)

        this.addRemainingDistance(path, direction)

        const linkAttribute = gridModel.getLinkAttribute(this.lh.linkKey)
        const hideHead = linkAttribute && linkAttribute.hideHead

        if (hideHead) {
            path.svgD = svgPathAdjuster.adjustForHideHead({ path, direction, difference_ee})
        }
        
        const { svgLeft, svgTop } = SvgPathUtils.getM(path.svgD)
        const arrowDraw = this[`${direction}ArrowDraw`]

        let svgD = `M${svgLeft} ${svgTop}`
        svgD += !hideHead ? ` ${arrowDraw}` : ''

        return {
            isArrow: true,
            svgD
        }
    }

    addRemainingDistance(path, direction) {
        const { row1, col1, linkKey } = this.lh
        const { arrowPointerAdjust } = this.getArrowPointers()
        let adjustForGridEdges = 0

        if (direction === 'down') {
            adjustForGridEdges = (row1 === 1 ? -arrowPointerAdjust : 0)
        }
        else if (direction === 'right') {
            adjustForGridEdges = (col1 === 1 ? -arrowPointerAdjust : 0)
        }

        const svgD = this.getSvgD(direction)
        const { cellelement_center_size } = this.getCellsSizes(direction)

        let distance = cellelement_center_size + adjustForGridEdges
        
        const linkAttribute = gridModel.getLinkAttribute(linkKey)
        const hideHead = linkAttribute && linkAttribute.hideHead

        if (!hideHead)
            distance -= this.arrow_width
        
        if (distance <= 0)
            distance = 2
        
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
