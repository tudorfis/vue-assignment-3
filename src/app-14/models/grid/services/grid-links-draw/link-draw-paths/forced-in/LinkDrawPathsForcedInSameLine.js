import { LinkDrawPathsBase } from "../LinkDrawPathsBase";
import { LinkHelper} from "../../../../helpers/link.helper"
import { UtilsStrings } from "../../../../../../utils/utilsStrings"
import linkEEMapHelper from "../../../../helpers/link-ee/linkEEMap.helper"

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
    drawSameRowColSideways(query) {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { forcedInDirection, link1Direction, link2Direction } = linkDirectionsMap
        const helperDirection1 = LinkHelper.getOpositeDirection(forcedInDirection)

        linkEEMapHelper.patchEEDirection({
            link1: this.lh.link2, 
            link2: this.lh.link1, 
            type: 'in',
            oldDirection: link2Direction,
            newDirection: forcedInDirection
        })

        linkEEMapHelper.patchEEDirection({
            link1: this.lh.link1, 
            link2: this.lh.link2, 
            type: 'out',
            oldDirection: link1Direction,
            newDirection: forcedInDirection
        })

        path = svgDrawPath.drawPath(forcedInDirection)
        if (!linkDirectionsMap.hasCellsForcedIn) path.svgD += svgDrawPath.drawHalfOut(forcedInDirection, link1Direction)
        path.svgD += svgDrawPath.drawHalfIn(link1Direction, forcedInDirection)
        path.svgD += svgDrawPath.drawLine(link1Direction, 'full')
        path.svgD += svgDrawPath.drawHalfIn(link1Direction, forcedInDirection)
        if (!linkDirectionsMap.hasCellsForcedIn) path.svgD += svgDrawPath.drawHalfOut(helperDirection1, forcedInDirection)

        path.svgD += svgDrawPath.drawLine(helperDirection1, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection1)

        return [ path, arrow ]
    }
    drawSameRowColNotStraight(query) {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { forcedInDirection, link1Direction } = linkDirectionsMap
        const { helperDirection1, helperDirection2, hasCellsLooh } = this.generateHelpers(query)
        const helperDirection3 = LinkHelper.getOpositeDirection(forcedInDirection)
        
        linkEEMapHelper.patchEEDirection({
            link1: this.lh.link1, 
            link2: this.lh.link2, 
            type: 'out',
            oldDirection: link1Direction,
            newDirection: helperDirection1
        })

        path = svgDrawPath.drawPath(helperDirection1)
        if (!hasCellsLooh) path.svgD += svgDrawPath.drawHalfOut(helperDirection1, forcedInDirection)
        path.svgD += svgDrawPath.drawHalfIn(helperDirection3, forcedInDirection)
        path.svgD += svgDrawPath.drawLine(helperDirection3, 'full')
        path.svgD += svgDrawPath.drawHalfIn(helperDirection2, forcedInDirection)
        if (!hasCellsLooh) path.svgD += svgDrawPath.drawHalfIn(helperDirection2, forcedInDirection)

        path.svgD += svgDrawPath.drawLine(helperDirection3, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection3)

        return [ path, arrow ]
    }
    drawSameRowColStraight() {
        let path, arrow
        const { svgDrawPath, svgDrawArrow, lh } = this

        path = svgDrawPath.drawPath(lh.directionOut)
        path.svgD += svgDrawPath.drawLine(lh.directionOut, 'full')
        path.svgD += svgDrawPath.drawLine(lh.directionOut, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, lh.directionOut)

        return [ path, arrow ]
    }
    drawSameRowColToBehind(query) {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { forcedInDirection, link1Direction } = linkDirectionsMap
        const { helperDirection1, helperDirection2, hasCellsLooh, hasCellsLooh2, hasCornerLooh } = this.generateHelpers(query)

        const hasCellsVerify = (!hasCornerLooh && !hasCellsLooh2) || (hasCellsLooh && !hasCellsLooh2)
        const helperDirection3 = LinkHelper.getOpositeDirection(forcedInDirection)

        linkEEMapHelper.patchEEDirection({
            link1: this.lh.link1, 
            link2: this.lh.link2, 
            type: 'out',
            oldDirection: link1Direction,
            newDirection: helperDirection1
        })

        path = svgDrawPath.drawPath(helperDirection1)

        if (!hasCellsLooh) path.svgD += svgDrawPath.drawHalfOut(helperDirection1, forcedInDirection)
        path.svgD += svgDrawPath.drawHalfIn(forcedInDirection, helperDirection1)
        path.svgD += svgDrawPath.drawLine(forcedInDirection, 'full')
        path.svgD += svgDrawPath.drawLine(forcedInDirection, 'cell')
        
        if (hasCellsVerify) path.svgD += svgDrawPath.drawHalfIn(forcedInDirection, helperDirection1)
        path.svgD += svgDrawPath.drawHalfIn(helperDirection2, forcedInDirection)
        if (!hasCellsLooh) path.svgD += svgDrawPath.drawHalfIn(helperDirection2, forcedInDirection)
        if (hasCellsVerify) path.svgD += svgDrawPath.drawHalfIn(helperDirection3, forcedInDirection)

        path.svgD += svgDrawPath.drawLine(helperDirection3, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection3)

        return [ path, arrow ]
    }
    generateHelpers(query) {
        const { linkDirectionsMap } = this
        const { forcedInDirection } = linkDirectionsMap
        const { isLeftRight, isUpDown } = query

        let helperDirection1 
        const looh = linkDirectionsMap.looh

        if (isLeftRight) {
            helperDirection1 = !looh.isDownCells ? 'down' : ''
            helperDirection1 = !helperDirection1 && !looh.isUpCells ? 'up' : 'down'
        }
        else if (isUpDown) {
            helperDirection1 = !looh.isRightCells ? 'right' : ''
            helperDirection1 = !helperDirection1 && !looh.isLeftCells ? 'left' : 'right'
        }

        const helperDirection2 = LinkHelper.getOpositeDirection(helperDirection1)

        let cellVerifier = `is${UtilsStrings.ucase(helperDirection1)}Cells`
        const hasCellsLooh = linkDirectionsMap.looh[cellVerifier]

        cellVerifier = `is${UtilsStrings.ucase(forcedInDirection)}Cells`
        const hasCellsLooh2 = linkDirectionsMap.looh[cellVerifier]

        cellVerifier = `is${UtilsStrings.ucase(helperDirection1)}${UtilsStrings.ucase(forcedInDirection)}Corner`
        const hasCornerLooh = linkDirectionsMap.looh[cellVerifier]

        return { 
            helperDirection1,
            helperDirection2,
            hasCellsLooh,
            hasCellsLooh2,
            hasCornerLooh
        }
    }
}
export { LinkDrawPathsForcedInSameLine }
