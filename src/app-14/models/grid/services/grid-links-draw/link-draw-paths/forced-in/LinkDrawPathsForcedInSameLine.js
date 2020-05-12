import { LinkDrawPathsBase } from "../LinkDrawPathsBase";
import { LinkHelper} from "../../../../helpers/link.helper"
import { UtilsStrings } from "../../../../../../utils/utilsStrings"

class LinkDrawPathsForcedInSameLine extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawSameRowCol() {
        const { forcedInDirection } = this.linkDirectionsMap
        
        const isLeftRight = LinkHelper.isLeftOrRight(forcedInDirection)
        const isUpDown = LinkHelper.isUpOrDown(forcedInDirection)
        const isInline = this.lh2[`is${UtilsStrings.ucase(forcedInDirection)}`]
        
        if ((isLeftRight && this.lh.isSameCol) || (isUpDown && this.lh.isSameRow)) 
            return this.drawSameRowColSideways({ isLeftRight, isUpDown }) 

        else if (isInline && this.linkDirectionsMap.loh.isOut1)
            return this.drawSameRowColNotStraight({ isLeftRight, isUpDown })

        else if (isInline && !this.linkDirectionsMap.loh.isOut1)
            return this.drawSameRowColStraight()

        else 
            return this.drawSameRowColToBehind({ isLeftRight, isUpDown })
    }
    drawSameRowColSideways() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { forcedInDirection } = linkDirectionsMap
        const helperDirection1 = LinkHelper.getOpositeDirection(forcedInDirection)
        
        const pdir = this.lh.potentialDirections
        const helperDirection2 = pdir[0] === forcedInDirection ? pdir[1] : pdir[0]
        
        path = svgDrawPath.drawPath(forcedInDirection)
        path.svgD += svgDrawPath.drawHalf(helperDirection2)
        path.svgD += svgDrawPath.drawLine(helperDirection2)
        path.svgD += svgDrawPath.drawHalf(helperDirection2)
        arrow = svgDrawArrow.drawArrow(path, helperDirection1)

        return [ path, arrow ]
    }
    drawSameRowColNotStraight(query) {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { forcedInDirection } = linkDirectionsMap
        const { helperDirection1, helperDirection2 } = this.generateHelpers(query)
        const helperDirection3 = LinkHelper.getOpositeDirection(forcedInDirection)

        path = svgDrawPath.drawPath(helperDirection1)
        path.svgD += svgDrawPath.drawHalf(helperDirection3)
        path.svgD += svgDrawPath.drawLine(helperDirection3)
        path.svgD += svgDrawPath.drawHalf(helperDirection2)
        arrow = svgDrawArrow.drawArrow(path, helperDirection3)

        return [ path, arrow ]
    }
    drawSameRowColStraight() {
        let path, arrow
        const { svgDrawPath, svgDrawArrow, lh } = this

        path = svgDrawPath.drawPath(lh.directionOut)
        path.svgD += svgDrawPath.drawLine(lh.directionOut)
        arrow = svgDrawArrow.drawArrow(path, lh.directionOut)

        return [ path, arrow ]
    }
    drawSameRowColToBehind(query) {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { forcedInDirection } = linkDirectionsMap
        const { helperDirection1, helperDirection2 } = this.generateHelpers(query)
        const helperDirection3 = LinkHelper.getOpositeDirection(forcedInDirection)

        path = svgDrawPath.drawPath(helperDirection1)
        path.svgD += svgDrawPath.drawHalf(forcedInDirection)
        path.svgD += svgDrawPath.drawLine(forcedInDirection)
        path.svgD += svgDrawPath.drawCell(forcedInDirection)
        path.svgD += svgDrawPath.drawHalf(helperDirection2)
        arrow = svgDrawArrow.drawArrow(path, helperDirection3)

        return [ path, arrow ]
    }
    generateHelpers(query) {
        const { isLeftRight, isUpDown } = query

        let helperDirection1
        if (isLeftRight) helperDirection1 = 'down'
        else if (isUpDown) helperDirection1 = 'right'

        const helperDirection2 = LinkHelper.getOpositeDirection(helperDirection1)

        return { 
            helperDirection1,
            helperDirection2
        }
    }
}
export { LinkDrawPathsForcedInSameLine }
