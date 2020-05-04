import { LinkDrawPathsBase } from "../LinkDrawPathsBase";
import { LinkHelper } from "../../../../helpers/link.helper"

class LinkDrawPathsForcedInOverlaps extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawOppositeOfPdir0() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { directionOut } = this.lh
        const { forcedInDirection } = linkDirectionsMap
        
        const helperDirection1 = this.lh.potentialDirections[0]
        const helperDirection2 = LinkHelper.getOpositeDirection(forcedInDirection)
        const index = this.lh.potentialDirections.indexOf(directionOut)
        
        if (index === 1) {
            path = svgDrawPath.drawPath(directionOut)
            path.svgD += svgDrawPath.drawLine(forcedInDirection)
            path.svgD += svgDrawPath.drawCell(forcedInDirection)
            path.svgD += svgDrawPath.drawLine(helperDirection1)
            path.svgD += svgDrawPath.drawCell(helperDirection1)
        }
        else {
            path = svgDrawPath.drawPath(directionOut)
            path.svgD += svgDrawPath.drawHalf(forcedInDirection)
            path.svgD += svgDrawPath.drawLine(forcedInDirection)
            path.svgD += svgDrawPath.drawCell(forcedInDirection)
            path.svgD += svgDrawPath.drawLine(helperDirection1)
            path.svgD += svgDrawPath.drawHalf(helperDirection1)
        }

        arrow = svgDrawArrow.drawArrow(path, helperDirection2)
        return [ path, arrow ]
    }
    drawOppositeOfPdir1() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { directionOut } = this.lh
        const { forcedInDirection } = linkDirectionsMap
        
        const {
            isIndex0,
            isIndex1,
            helperDirection1,
            helperDirection2,
        } = this.generateHelpers({ directionOut, forcedInDirection })
        
        path = svgDrawPath.drawPath(directionOut)
        
        if (isIndex0) {
            path.svgD += svgDrawPath.drawLine(directionOut)
            path.svgD += svgDrawPath.drawCell(directionOut)
            path.svgD += svgDrawPath.drawLine(helperDirection1)
            path.svgD += svgDrawPath.drawHalf(helperDirection1)
            path.svgD += svgDrawPath.drawHalf(helperDirection1)
        }
        else if (isIndex1) {
            path.svgD += svgDrawPath.drawHalf(helperDirection1)
            path.svgD += svgDrawPath.drawLine(helperDirection1)
            path.svgD += svgDrawPath.drawCell(helperDirection1)
            path.svgD += svgDrawPath.drawLine(directionOut)
            path.svgD += svgDrawPath.drawHalf(directionOut)
        }
        
        arrow = svgDrawArrow.drawArrow(path, helperDirection2)
        return [ path, arrow ]
    }
    drawLastRemainingOfPdir() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { forcedInDirection, loh } = linkDirectionsMap
        
        const index = this.lh2.potentialDirections.indexOf(forcedInDirection)
        const helperDirection1 = this.lh.potentialDirections[index]
        const helperDirection2 = LinkHelper.getOpositeDirection(forcedInDirection)

        const isOutOrCorner = index === 1 ? (loh.isOut2 || loh.isCorner2) : (loh.isOut1 || loh.isCorner1)
        const isIn = index === 1 ? loh.isIn2 : loh.isIn1
        const isInOut = index === 1 ? (loh.isIn2 && loh.isOut1) : (loh.isIn1 && loh.isOut2)

        if (isOutOrCorner) {
            path = svgDrawPath.drawPath(helperDirection2)

            if (!isIn) {
                path.svgD += svgDrawPath.drawHalf(helperDirection1)
                path.svgD += svgDrawPath.drawLine(helperDirection1)
                path.svgD += svgDrawPath.drawHalf(helperDirection1)
                path.svgD += svgDrawPath.drawLine(helperDirection2)
            }
            else {
                path.svgD += svgDrawPath.drawLine(helperDirection2)
                path.svgD += svgDrawPath.drawHalf(helperDirection1)
                path.svgD += svgDrawPath.drawLine(helperDirection1)
                path.svgD += svgDrawPath.drawHalf(helperDirection1)
            }
        }
        else {
            if (!isIn) {
                path = svgDrawPath.drawPath(helperDirection1)
                path.svgD += svgDrawPath.drawLine(helperDirection1)
                path.svgD += svgDrawPath.drawHalf(helperDirection1)
                path.svgD += svgDrawPath.drawHalf(helperDirection2)
                path.svgD += svgDrawPath.drawLine(helperDirection2)
            }
            else {
                if (isInOut) {
                    path = svgDrawPath.drawPath(helperDirection2)
                    path.svgD += svgDrawPath.drawHalf(helperDirection1)
                    path.svgD += svgDrawPath.drawLine(helperDirection2)
                    path.svgD += svgDrawPath.drawLine(helperDirection1)
                    path.svgD += svgDrawPath.drawHalf(helperDirection1)
                }
                else {
                    path = svgDrawPath.drawPath(helperDirection2)
                    path.svgD += svgDrawPath.drawLine(helperDirection2)
                    path.svgD += svgDrawPath.drawHalf(helperDirection1)
                    path.svgD += svgDrawPath.drawLine(helperDirection1)
                    path.svgD += svgDrawPath.drawHalf(helperDirection1)
                }
            }
        }
        
        arrow = svgDrawArrow.drawArrow(path, helperDirection2)
        return [ path, arrow ]
    }
    generateHelpers(query) {
        const { directionOut, forcedInDirection } = query

        const pdir1 = this.lh.potentialDirections
        const pdir2 = this.lh2.potentialDirections

        const index = pdir1.indexOf(directionOut)
        const helperDirection1 = LinkHelper.getOpositeDirection(pdir2[index])
        const helperDirection2 = LinkHelper.getOpositeDirection(forcedInDirection)
        
        const isIndex0 = index === 0
        const isIndex1 = index === 1

        return {
            isIndex0,
            isIndex1,
            helperDirection1,
            helperDirection2
        }
    }
}
export { LinkDrawPathsForcedInOverlaps }
