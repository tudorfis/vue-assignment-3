
import { LinkDrawPathsBase } from "../LinkDrawPathsBase";
import { LinkHelper } from "../../../../helpers/link.helper"
import linkEEMapHelper from "../../../../helpers/link-ee/linkEEMap.helper"

class LinkDrawPathsForcedOutOverlaps extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawOppositeOfPdir0() {
        return this.drawOppositeOfPdir(1, 0, 2)
    }
    drawOppositeOfPdir1() {
        return this.drawOppositeOfPdir(0, 1, 1)
    }
    drawOppositeOfPdir(pdirKey1, pdirKey2, lohKey) {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        let { directionIn } = this.lh
        const { forcedOutDirection } = linkDirectionsMap
        
        const helperDirection1 = this.lh.potentialDirections[pdirKey1]
        const helperDirection2 = this.lh.potentialDirections[pdirKey2]
        
        const loh = linkDirectionsMap.linkOverlapHelper
        const noObstructionsAlongTheWay = !loh[`isIn${lohKey}`] && !loh[`isCorner${lohKey}`]

        path = svgDrawPath.drawPath(forcedOutDirection)
        if (!linkDirectionsMap.hasCellsForcedOut) path.svgD += svgDrawPath.drawHalfOut(forcedOutDirection, helperDirection2)
        
        path.svgD += svgDrawPath.drawHalfIn(helperDirection1, forcedOutDirection)
        path.svgD += svgDrawPath.drawLine(helperDirection1, 'full')
        
        if (noObstructionsAlongTheWay) path.svgD += svgDrawPath.drawHalfIn(helperDirection1, forcedOutDirection)

        path.svgD += svgDrawPath.drawHalfOut(helperDirection2, forcedOutDirection)
        
        if (linkDirectionsMap.hasCellsForcedOut) path.svgD += svgDrawPath.drawHalfOut(helperDirection2, forcedOutDirection)
        if (!linkDirectionsMap.hasCellsForcedOut) path.svgD += svgDrawPath.drawLine(helperDirection2, 'cell')
        
        if (noObstructionsAlongTheWay) {
            path.svgD += svgDrawPath.drawLine(helperDirection2, 'full')
            path.svgD += svgDrawPath.drawLine(helperDirection2, 'arrow')
            arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection2)
        }
        else {
            path.svgD += svgDrawPath.drawLine(helperDirection2, 'full')
            path.svgD += svgDrawPath.drawHalfOut(helperDirection2, forcedOutDirection)
            path.svgD += svgDrawPath.drawLine(directionIn, 'arrow')
            arrow = svgDrawArrow.drawArrow(path.svgD, directionIn)
        }

        return [ path, arrow ]
    }

    drawLastRemainingOfPdir() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap, lh } = this
        const { link2Direction, forcedOutDirection, loh } = linkDirectionsMap
     
        const lh2 = new LinkHelper(lh.linkKey, true)
        const index = lh.potentialDirections.indexOf(forcedOutDirection)
        const helperDirection1 = LinkHelper.getOpositeDirection(lh2.potentialDirections[index])

        const isOutOrCorner = index === 0 ? (loh.isOut1 || loh.isCorner1) : (loh.isOut2 || loh.isCorner2)
        const isIn1 = index === 0 ? loh.isIn1 : loh.isIn2
        const isIn2 = index === 0 ? loh.isIn2 : loh.isIn1
        
        if (isOutOrCorner) {
            if (isIn2 && isIn1) {
                linkEEMapHelper.patchEEDirection({
                    link1: this.lh.link2,
                    link2: this.lh.link1,
                    type: 'in',
                    oldDirection: link2Direction,
                    newDirection: LinkHelper.getOpositeDirection(helperDirection1)
                })

                path = svgDrawPath.drawPath(forcedOutDirection)
                path.svgD += svgDrawPath.drawHalfOut(helperDirection1, forcedOutDirection)
                path.svgD += svgDrawPath.drawLine(helperDirection1, 'full')
                path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                path.svgD += svgDrawPath.drawHalfIn(forcedOutDirection, helperDirection1)
                path.svgD += svgDrawPath.drawLine(helperDirection1, 'arrow')
                arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection1)
            }
            else if (isIn2 && !isIn1) {
                path = svgDrawPath.drawPath(forcedOutDirection)
                path.svgD += svgDrawPath.drawHalfOut(helperDirection1, forcedOutDirection)
                path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                path.svgD += svgDrawPath.drawHalfIn(forcedOutDirection, helperDirection1)
                path.svgD += svgDrawPath.drawLine(helperDirection1, 'full')
                path.svgD += svgDrawPath.drawLine(helperDirection1, 'arrow')
                arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection1)
            }
            else {
                path = svgDrawPath.drawPath(forcedOutDirection)
                path.svgD += svgDrawPath.drawHalfOut(helperDirection1, forcedOutDirection)
                path.svgD += svgDrawPath.drawLine(helperDirection1, 'full')
                path.svgD += svgDrawPath.drawHalfIn(helperDirection1, forcedOutDirection)
                path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'arrow')
                arrow = svgDrawArrow.drawArrow(path.svgD, forcedOutDirection)
            }
        }
        else {
            if (!isIn1) {
                path = svgDrawPath.drawPath(forcedOutDirection)
                path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                path.svgD += svgDrawPath.drawHalfOut(forcedOutDirection, helperDirection1)
                path.svgD += svgDrawPath.drawHalfIn(helperDirection1, forcedOutDirection)
                path.svgD += svgDrawPath.drawLine(helperDirection1, 'full')
                path.svgD += svgDrawPath.drawLine(helperDirection1, 'arrow')
                arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection1)
            }
            else {
                linkEEMapHelper.patchEEDirection({
                    link1: this.lh.link2,
                    link2: this.lh.link1,
                    type: 'in',
                    oldDirection: link2Direction,
                    newDirection: LinkHelper.getOpositeDirection(forcedOutDirection)
                })

                path = svgDrawPath.drawPath(forcedOutDirection)
                path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                path.svgD += svgDrawPath.drawHalfOut(helperDirection1, forcedOutDirection)
                path.svgD += svgDrawPath.drawLine(helperDirection1, 'full')
                path.svgD += svgDrawPath.drawHalfIn(helperDirection1, forcedOutDirection)
                path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'arrow')
                arrow = svgDrawArrow.drawArrow(path.svgD, forcedOutDirection)
            }
        }

        return [ path, arrow ]
    }
}

export { LinkDrawPathsForcedOutOverlaps }
