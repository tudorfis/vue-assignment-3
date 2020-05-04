import { LinkDrawPathsBase } from "../LinkDrawPathsBase"
import { UtilsStrings } from "../../../../../../utils/utilsStrings"
import { LinkHelper } from "../../../../helpers/link.helper"

const ucase = UtilsStrings.ucase

class LinkDrawPathsBothForcedSameLine extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawSameRowCol() {
        const query = this.generateQuery()

        const isSameDirectionAsForcedOut = query.lh[`is${ucase(query.forcedOutDirection)}`]
        const isOppositeDirectionAsForcedOut = query.lh[`is${ucase(query.helperDirection4)}`]

        if (isSameDirectionAsForcedOut)
            return this.drawOutPossibilities(query)

        else if (isOppositeDirectionAsForcedOut)
            return this.drawOppositeOutPossibilities(query)

        return this.drawSidewaysOutPossibilities(query)
    }

    generateQuery() {
        const { svgDrawPath, svgDrawArrow, linkDirectionsMap, lh, lh2 } = this

        const { forcedOutDirection, forcedInDirection } = linkDirectionsMap
        const { helperDirection1, helperDirection2 } = this.generateHelpers()

        const helperDirection3 = LinkHelper.getOpositeDirection(forcedInDirection)
        const helperDirection4 = LinkHelper.getOpositeDirection(forcedOutDirection)

        return {
            svgDrawPath, svgDrawArrow, forcedInDirection, forcedOutDirection, lh, lh2,
            helperDirection1, helperDirection2, helperDirection3, helperDirection4
        }
    }
    generateHelpers() {
        const { linkDirectionsMap } = this
        const { forcedOutDirection } = linkDirectionsMap

        const isLeftRight = LinkHelper.isLeftOrRight(forcedOutDirection)
        const isUpDown = LinkHelper.isUpOrDown(forcedOutDirection)

        let helperDirection1
        if (isLeftRight) helperDirection1 = 'down'
        else if (isUpDown) helperDirection1 = 'right'

        const helperDirection2 = LinkHelper.getOpositeDirection(helperDirection1)

        return {
            helperDirection1,
            helperDirection2
        }
    }

    drawOutPossibilities(query) {
        let path, arrow
        const { svgDrawPath, svgDrawArrow, forcedInDirection, forcedOutDirection, lh, lh2,
            helperDirection1, helperDirection2, helperDirection3, helperDirection4 } = query

        if (lh2[`is${ucase(forcedInDirection)}`]) {
            path = svgDrawPath.drawPath(forcedOutDirection)
            path.svgD += svgDrawPath.drawHalf(helperDirection1)
            path.svgD += svgDrawPath.drawLine(forcedOutDirection)
            path.svgD += svgDrawPath.drawHalf(helperDirection2)
            arrow = svgDrawArrow.drawArrow(path, helperDirection3)
        }
        else if (forcedOutDirection === forcedInDirection) {
            path = svgDrawPath.drawPath(forcedOutDirection)
            path.svgD += svgDrawPath.drawHalf(helperDirection1)
            path.svgD += svgDrawPath.drawLine(forcedOutDirection)
            path.svgD += svgDrawPath.drawCell(forcedOutDirection)
            path.svgD += svgDrawPath.drawHalf(helperDirection2)
            arrow = svgDrawArrow.drawArrow(path, helperDirection3)
        }
        else {
            path = svgDrawPath.drawPath(forcedOutDirection)
            path.svgD += svgDrawPath.drawHalf(forcedInDirection)
            path.svgD += svgDrawPath.drawLine(forcedOutDirection)
            path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
            arrow = svgDrawArrow.drawArrow(path, helperDirection3)
        }

        return [path, arrow]
    }
    drawOppositeOutPossibilities(query) {
        let path, arrow
        const { svgDrawPath, svgDrawArrow, forcedInDirection, forcedOutDirection, lh, lh2,
            helperDirection1, helperDirection2, helperDirection3, helperDirection4 } = query

        if (lh2[`is${ucase(forcedInDirection)}`]) {
            path = svgDrawPath.drawPath(forcedOutDirection)
            path.svgD += svgDrawPath.drawHalf(helperDirection1)
            path.svgD += svgDrawPath.drawLine(helperDirection4)
            path.svgD += svgDrawPath.drawCell(helperDirection4)
            path.svgD += svgDrawPath.drawHalf(helperDirection2)
            arrow = svgDrawArrow.drawArrow(path, helperDirection3)
        }
        else if (helperDirection4 === forcedInDirection) {
            path = svgDrawPath.drawPath(forcedOutDirection)
            path.svgD += svgDrawPath.drawHalf(helperDirection1)
            path.svgD += svgDrawPath.drawLine(helperDirection4)
            path.svgD += svgDrawPath.drawCell(helperDirection4)
            path.svgD += svgDrawPath.drawCell(helperDirection4)
            path.svgD += svgDrawPath.drawHalf(helperDirection2)
            arrow = svgDrawArrow.drawArrow(path, helperDirection3)
        }
        else {
            path = svgDrawPath.drawPath(forcedOutDirection)
            path.svgD += svgDrawPath.drawHalf(forcedInDirection)
            path.svgD += svgDrawPath.drawLine(helperDirection4)
            path.svgD += svgDrawPath.drawCell(helperDirection4)
            path.svgD += svgDrawPath.drawHalf(helperDirection4)
            arrow = svgDrawArrow.drawArrow(path, helperDirection3)
        }


        return [path, arrow]
    }
    drawSidewaysOutPossibilities(query) {
        let path, arrow
        const { svgDrawPath, svgDrawArrow, forcedInDirection, forcedOutDirection, lh, lh2,
            helperDirection1, helperDirection2, helperDirection3, helperDirection4 } = query

        if (lh2[`is${ucase(forcedInDirection)}`]) {
            path = svgDrawPath.drawPath(forcedOutDirection)
            path.svgD += svgDrawPath.drawLine(helperDirection3)
            path.svgD += svgDrawPath.drawHalf(helperDirection3)
            path.svgD += svgDrawPath.drawHalf(helperDirection4)
            arrow = svgDrawArrow.drawArrow(path, helperDirection3)
        }
        else if (helperDirection1 === forcedInDirection) {
            path = svgDrawPath.drawPath(forcedOutDirection)
            path.svgD += svgDrawPath.drawLine(forcedInDirection)
            path.svgD += svgDrawPath.drawCell(forcedInDirection)
            path.svgD += svgDrawPath.drawHalf(forcedInDirection)
            path.svgD += svgDrawPath.drawHalf(helperDirection4)
            arrow = svgDrawArrow.drawArrow(path, helperDirection3)
        }
        else {
            if (forcedInDirection === forcedOutDirection) {
                path = svgDrawPath.drawPath(forcedOutDirection)
                path.svgD += svgDrawPath.drawLine(helperDirection1)
                path.svgD += svgDrawPath.drawCell(helperDirection1)
                arrow = svgDrawArrow.drawArrow(path, helperDirection3)
            }
            else {
                path = svgDrawPath.drawPath(forcedOutDirection)
                path.svgD += svgDrawPath.drawLine(helperDirection1)
                path.svgD += svgDrawPath.drawHalf(helperDirection1)
                path.svgD += svgDrawPath.drawCell(helperDirection4)
                path.svgD += svgDrawPath.drawHalf(helperDirection1)
                arrow = svgDrawArrow.drawArrow(path, helperDirection3)
            }
        }

        return [path, arrow]
    }
}

export { LinkDrawPathsBothForcedSameLine }
