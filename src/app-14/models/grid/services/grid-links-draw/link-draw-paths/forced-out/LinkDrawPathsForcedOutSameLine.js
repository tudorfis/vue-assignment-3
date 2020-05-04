
import { LinkDrawPathsBase } from '../LinkDrawPathsBase'
import linkEEMapHelper from '../../../../helpers/link-ee/linkEEMap.helper'
import { LinkHelper } from '../../../../helpers/link.helper' 
import { UtilsStrings } from '../../../../../../utils/utilsStrings'

const ucase = UtilsStrings.ucase

class LinkDrawPathsForcedOutSameLine extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawSameRowCol() {
        const { forcedOutDirection } = this.linkDirectionsMap

        const isLeftRight = LinkHelper.isLeftOrRight(forcedOutDirection)
        const isUpDown = LinkHelper.isUpOrDown(forcedOutDirection)

        const helperDirection1 = isLeftRight ? this.lh.getDownUp : this.lh.getRightLeft
        const helperDirection2 = LinkHelper.getOpositeDirection(forcedOutDirection)

        if ((isLeftRight && this.lh.isSameCol) || (isUpDown && this.lh.isSameRow)) 
            return this.drawSameRowColSideways({ helperDirection1, helperDirection2 }) 

        else if (this.linkDirectionsMap.loh.isOut1) 
            return this.drawSameRowColNotStraight({ helperDirection2, isLeftRight, isUpDown })

        else 
            return this.drawSameRowColBend({ helperDirection2, isLeftRight, isUpDown })
    }
    drawSameRowColSideways(query) {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { forcedOutDirection } = linkDirectionsMap
        const { helperDirection1, helperDirection2 } = query

        path = svgDrawPath.drawPath(forcedOutDirection)
        path.svgD += svgDrawPath.drawHalf(helperDirection1)
        path.svgD += svgDrawPath.drawLine(helperDirection1)
        path.svgD += svgDrawPath.drawHalf(helperDirection1)
        arrow = svgDrawArrow.drawArrow(path, helperDirection2)

        return [ path, arrow ]
    }
    drawSameRowColNotStraight(query) {
        
        const { linkDirectionsMap } = this
        const { forcedOutDirection } = linkDirectionsMap
        const { helperDirection2 } = query
        const { helperDirection3, helperDirection4 } = this.generateHelpers(query)
        
        if (this.lh[`is${ucase(forcedOutDirection)}`]) {
            return this.drawSameRowColNotStraightSameDirection({ 
                forcedOutDirection,
                helperDirection3,
                helperDirection4
            })
        }
        else {
            return this.drawSameRowColNotStraightDifferentDirection({
                forcedOutDirection,
                helperDirection2,
                helperDirection3,
                helperDirection4
            })
        }
    }
    drawSameRowColNotStraightSameDirection(query) {
        let path, arrow

        const  { forcedOutDirection, helperDirection3, helperDirection4 } = query
        const { svgDrawPath, svgDrawArrow } = this

        path = svgDrawPath.drawPath(forcedOutDirection)
        path.svgD += svgDrawPath.drawHalf(helperDirection3)
        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
        path.svgD += svgDrawPath.drawLine(forcedOutDirection)
        arrow = svgDrawArrow.drawArrow(path, helperDirection4)

        return [ path, arrow ]
    }
    drawSameRowColNotStraightDifferentDirection(query) {
        let path, arrow

        const { forcedOutDirection, helperDirection2, helperDirection3, helperDirection4 } = query
        const { svgDrawPath, svgDrawArrow } = this

        path = svgDrawPath.drawPath(forcedOutDirection)
        path.svgD += svgDrawPath.drawHalf(helperDirection3)
        path.svgD += svgDrawPath.drawHalf(helperDirection2)
        path.svgD += svgDrawPath.drawCell(helperDirection2)
        path.svgD += svgDrawPath.drawLine(helperDirection2)
        arrow = svgDrawArrow.drawArrow(path, helperDirection4)
        
        return [ path, arrow ]
    }
    drawSameRowColBend(query) {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { forcedOutDirection } = linkDirectionsMap
        const { helperDirection3, helperDirection4 } = this.generateHelpers(query)
        const { helperDirection2 } = query

        path = svgDrawPath.drawPath(forcedOutDirection)
        path.svgD += svgDrawPath.drawHalf(helperDirection3)
        path.svgD += svgDrawPath.drawCell(helperDirection2)
        path.svgD += svgDrawPath.drawLine(helperDirection2)
        path.svgD += svgDrawPath.drawHalf(helperDirection2)
        arrow = svgDrawArrow.drawArrow(path, helperDirection4)

        return [ path, arrow ]
    }

    generateHelpers(query) {
        const { isLeftRight, isUpDown } = query

        let helperDirection3
        if (isLeftRight) helperDirection3 = 'down'
        else if (isUpDown) helperDirection3 = 'right'

        const helperDirection4 = LinkHelper.getOpositeDirection(helperDirection3)

        return { 
            helperDirection3,
            helperDirection4
        }
    }
}

export { LinkDrawPathsForcedOutSameLine }