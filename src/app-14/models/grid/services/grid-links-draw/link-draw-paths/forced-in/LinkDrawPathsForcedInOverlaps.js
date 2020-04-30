import { LinkDrawPathsBase } from "../LinkDrawPathsBase";
import { UtilsStrings } from "../../../../../../utils/utilsStrings";
import { LinkHelper } from "../../../../helpers/link.helper"
import linkEEMapHelper from "../../../../helpers/link-ee/linkEEMap.helper"

class LinkDrawPathsForcedInOverlaps extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawOppositeOfPdir0() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        let { directionOut } = this.lh
        const { forcedInDirection, link1Direction, looh, loh } = linkDirectionsMap
        
        const helperDirection1 = this.lh.potentialDirections[0]
        const helperDirection2 = LinkHelper.getOpositeDirection(forcedInDirection)

        const {
            hasCellsLooh,
            hasOutOrCorner2
        } = this.generateHelpers({ directionOut, forcedInDirection, looh, loh })

        if (!hasOutOrCorner2) {
            linkEEMapHelper.patchEEDirection({
                link1: this.lh.link1, 
                link2: this.lh.link2, 
                type: 'out',
                oldDirection: link1Direction,
                newDirection: forcedInDirection
            })

            path = svgDrawPath.drawPath(forcedInDirection)
        
            path.svgD += svgDrawPath.drawLine(forcedInDirection, 'full')
            path.svgD += svgDrawPath.drawLine(forcedInDirection, 'cell')
            if (!hasCellsLooh) path.svgD += svgDrawPath.drawHalfOut(forcedInDirection, directionOut)
    
            path.svgD += svgDrawPath.drawLine(helperDirection1, 'full')
            path.svgD += svgDrawPath.drawHalfIn(helperDirection1, forcedInDirection)
            path.svgD += svgDrawPath.drawHalfOut(helperDirection1, forcedInDirection)
            if (!hasCellsLooh) path.svgD += svgDrawPath.drawHalfOut(helperDirection2, directionOut)
    
        }
        else {
            path = svgDrawPath.drawPath(directionOut)
            path.svgD += svgDrawPath.drawHalfOut(forcedInDirection, directionOut)

            path.svgD += svgDrawPath.drawLine(forcedInDirection, 'full')
            path.svgD += svgDrawPath.drawLine(forcedInDirection, 'cell')
            if (!hasCellsLooh) path.svgD += svgDrawPath.drawHalfOut(forcedInDirection, directionOut)
    
            path.svgD += svgDrawPath.drawLine(helperDirection1, 'full')
            path.svgD += svgDrawPath.drawHalfIn(helperDirection1, forcedInDirection)
            if (!hasCellsLooh) path.svgD += svgDrawPath.drawHalfOut(helperDirection2, directionOut)
        }

        path.svgD += svgDrawPath.drawLine(helperDirection2, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection2)
    
        return [ path, arrow ]
    }
    drawOppositeOfPdir1() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { directionOut } = this.lh
        const { forcedInDirection, looh } = linkDirectionsMap
        
        const {
            isIndex0,
            isIndex1,
            helperDirection1,
            helperDirection2,
            hasCellsLooh,
            hasCellsLoohAfter
        } = this.generateHelpers({ directionOut, forcedInDirection, looh })
        
        path = svgDrawPath.drawPath(directionOut)
        
        if (isIndex0) {
            path.svgD += svgDrawPath.drawLine(directionOut, 'full')
            path.svgD += svgDrawPath.drawLine(directionOut, 'cell')
            if (!hasCellsLooh) path.svgD += svgDrawPath.drawHalfOut(directionOut, forcedInDirection)

            path.svgD += svgDrawPath.drawLine(helperDirection1, 'full')
            path.svgD += svgDrawPath.drawHalfOut(helperDirection1, directionOut)
            path.svgD += svgDrawPath.drawHalfIn(helperDirection1, forcedInDirection)
            if (!hasCellsLooh) path.svgD += svgDrawPath.drawHalfOut(helperDirection2, forcedInDirection)
        }
        else if (isIndex1) {
            path.svgD += svgDrawPath.drawHalfOut(helperDirection1, directionOut)
            path.svgD += svgDrawPath.drawLine(helperDirection1, 'full')
            path.svgD += svgDrawPath.drawLine(helperDirection1, 'cell')
            if (!hasCellsLoohAfter) path.svgD += svgDrawPath.drawHalfOut(helperDirection1, forcedInDirection)

            path.svgD += svgDrawPath.drawLine(directionOut, 'full')
            path.svgD += svgDrawPath.drawHalfIn(directionOut, forcedInDirection)
            if (!hasCellsLoohAfter) path.svgD += svgDrawPath.drawHalfOut(helperDirection2, forcedInDirection)
        }
        
        path.svgD += svgDrawPath.drawLine(helperDirection2, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection2)

        return [ path, arrow ]
    }
    drawLastRemainingOfPdir() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { link1Direction, forcedInDirection, loh } = linkDirectionsMap
        
        const index = this.lh2.potentialDirections.indexOf(forcedInDirection)
        const helperDirection1 = this.lh.potentialDirections[index]
        const helperDirection2 = LinkHelper.getOpositeDirection(forcedInDirection)

        const isOutOrCorner = index === 1 ? (loh.isOut2 || loh.isCorner2) : (loh.isOut1 || loh.isCorner1)
        const isIn = index === 1 ? loh.isIn2 : loh.isIn1

        if (isOutOrCorner) {
            path = svgDrawPath.drawPath(helperDirection2)
            path.svgD += svgDrawPath.drawHalfOut(helperDirection1, forcedInDirection)
            path.svgD += svgDrawPath.drawLine(helperDirection1, 'full')

            if (!isIn) {
                path.svgD += svgDrawPath.drawHalfOut(helperDirection1, forcedInDirection)
                path.svgD += svgDrawPath.drawLine(helperDirection2, 'full')
            }
            else {
                path.svgD += svgDrawPath.drawLine(helperDirection2, 'full')
                path.svgD += svgDrawPath.drawHalfOut(helperDirection1, forcedInDirection)
            }

            if (helperDirection2 !== link1Direction) {
                linkEEMapHelper.patchEEDirection({
                    link1: this.lh.link1,
                    link2: this.lh.link2,
                    type: 'out',
                    oldDirection: link1Direction,
                    newDirection: helperDirection2
                })
            }
        }
        else {
            path = svgDrawPath.drawPath(helperDirection1)
            path.svgD += svgDrawPath.drawLine(helperDirection1, 'full')

            if (!isIn) {
                path.svgD += svgDrawPath.drawHalfOut(helperDirection1, forcedInDirection)
                path.svgD += svgDrawPath.drawHalfIn(helperDirection2, helperDirection1)
                path.svgD += svgDrawPath.drawLine(helperDirection2, 'full')
            }
            else {
                path.svgD += svgDrawPath.drawHalfIn(helperDirection2, helperDirection1)
                path.svgD += svgDrawPath.drawLine(helperDirection2, 'full')
                path.svgD += svgDrawPath.drawHalfOut(helperDirection1, forcedInDirection)
            }

            if (helperDirection1 !== link1Direction) {
                linkEEMapHelper.patchEEDirection({
                    link1: this.lh.link1,
                    link2: this.lh.link2,
                    type: 'out',
                    oldDirection: link1Direction,
                    newDirection: helperDirection1
                })
            }
        }
        
        path.svgD += svgDrawPath.drawLine(helperDirection2, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection2)

        return [ path, arrow ]
    }
    generateHelpers(query) {
        const { directionOut, forcedInDirection, looh, loh } = query

        const pdir1 = this.lh.potentialDirections
        const pdir2 = this.lh2.potentialDirections

        const index = pdir1.indexOf(directionOut)
        const helperDirection1 = LinkHelper.getOpositeDirection(pdir2[index])
        const helperDirection2 = LinkHelper.getOpositeDirection(forcedInDirection)
        
        let cellVerifier = `is${UtilsStrings.ucase(forcedInDirection)}Cells`
        const hasCellsLooh = looh[cellVerifier]

        cellVerifier = `is${UtilsStrings.ucase(forcedInDirection)}CellsAfter`
        const hasCellsLoohAfter = looh[cellVerifier]

        const hasOutOrCorner2 = (loh) ? (loh.isCorner2 || loh.isOut2) : false
        
        const isIndex0 = index === 0
        const isIndex1 = index === 1

        return {
            isIndex0,
            isIndex1,
            helperDirection1,
            helperDirection2,
            hasCellsLooh,
            hasCellsLoohAfter,
            hasOutOrCorner2
        }
    }
}
export { LinkDrawPathsForcedInOverlaps }
