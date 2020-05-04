import { LinkDrawPathsBase } from "../LinkDrawPathsBase"
import { UtilsStrings } from "../../../../../../utils/utilsStrings"
import { LinkHelper } from "../../../../helpers/link.helper"

const ucase = UtilsStrings.ucase
class LinkDrawPathsBothForcedOverlaps extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawOverlaps() {
        let path, arrow

        const ldm = this.linkDirectionsMap
        const { svgDrawPath, svgDrawArrow, lh, lh2 } = this
        const { forcedOutDirection, forcedInDirection, loh } = ldm
        
        const isO0 = ldm.isForcedOutOppositeOfPdir0(lh)
        const isO1 = ldm.isForcedOutOppositeOfPdir1(lh)
        
        const isI0 = ldm.isForcedInOppositeOfPdir0(lh2)
        const isI1 = ldm.isForcedInOppositeOfPdir1(lh2)

        const pdir1 = this.lh.potentialDirections
        const pdir2 = this.lh2.potentialDirections

        const indexOut = pdir1.indexOf(forcedOutDirection)
        const indexIn = pdir2.indexOf(forcedInDirection)
        
        const { isOut1, isOut2, isCorner1, isCorner2, isIn1, isIn2 } = loh
        const directionIn = LinkHelper.getOpositeDirection(forcedInDirection)

        path = svgDrawPath.drawPath(forcedOutDirection)

        if (!isO0 && !isO1 && !isI0 && !isI1) {

            if (indexOut === 0 && indexIn === 0) {
                if (isOut1 || isCorner1) {
                    if (isIn1) {
                        path.svgD += svgDrawPath.drawLine(directionIn)
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection)
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                    }
                    else {
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection)
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                        path.svgD += svgDrawPath.drawLine(directionIn)
                    }
                }
                else {
                    if (isIn1) {
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection)
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(directionIn)
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                    }
                    else {
                        
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection)
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(directionIn)
                    }
                }
            }

            else if (indexOut === 0 && indexIn === 1) {
                if (isOut1) {
                    path.svgD += svgDrawPath.drawHalf(pdir1[1])
                    path.svgD += svgDrawPath.drawLine(pdir1[1])

                    if (isIn2) {
                        path.svgD += svgDrawPath.drawLine(directionIn)
                        path.svgD += svgDrawPath.drawHalf(pdir1[1])
                    }
                    else {
                        path.svgD += svgDrawPath.drawHalf(pdir1[1])
                        path.svgD += svgDrawPath.drawLine(directionIn)
                    }
                }
                else {
                    path.svgD += svgDrawPath.drawLine(forcedOutDirection)
                    path.svgD += svgDrawPath.drawHalf(pdir1[1])
                    path.svgD += svgDrawPath.drawLine(pdir1[1])
                    path.svgD += svgDrawPath.drawHalf(pdir1[1])
                }
            }

            else if (indexOut === 1 && indexIn === 0) {
                if (isIn1 && !isOut2) {
                    path.svgD += svgDrawPath.drawLine(forcedOutDirection)
                    path.svgD += svgDrawPath.drawHalf(pdir1[0])
                    path.svgD += svgDrawPath.drawLine(pdir1[0])
                    path.svgD += svgDrawPath.drawHalf(pdir1[0])
                }
                else if (isOut2 && !isIn1) {
                    path.svgD += svgDrawPath.drawLine(pdir1[0])
                    path.svgD += svgDrawPath.drawHalf(pdir1[0])
                    path.svgD += svgDrawPath.drawHalf(pdir1[0])
                    path.svgD += svgDrawPath.drawLine(forcedOutDirection)
                }
                else if (isOut2 && isIn1) {
                    path.svgD += svgDrawPath.drawLine(pdir1[0])
                    path.svgD += svgDrawPath.drawHalf(pdir1[0])
                    path.svgD += svgDrawPath.drawLine(forcedOutDirection)
                    path.svgD += svgDrawPath.drawHalf(pdir1[0])
                }
                else {
                    path.svgD += svgDrawPath.drawLine(pdir1[0])
                    path.svgD += svgDrawPath.drawHalf(pdir1[0])
                    path.svgD += svgDrawPath.drawHalf(pdir1[0])
                    path.svgD += svgDrawPath.drawLine(forcedOutDirection)
                }
            }

            else if (indexOut === 1 && indexIn === 1) {
                if (isOut2 || isCorner2) {
                    if (isIn2) {
                        path.svgD += svgDrawPath.drawLine(directionIn)
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection)
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                    }
                    else {
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection)
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                        path.svgD += svgDrawPath.drawLine(directionIn)
                    }
                }
                else {
                    if (isIn2) {
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection)
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(directionIn)
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                    }
                    else {
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection)
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(directionIn)
                    }
                    
                }
            }
        }

        else {
            if (isO0) {
                if (indexIn === 0) {
                    path.svgD += svgDrawPath.drawHalf(pdir1[1])
                    path.svgD += svgDrawPath.drawLine(pdir1[1])
                    path.svgD += svgDrawPath.drawLine(pdir1[0])
                    path.svgD += svgDrawPath.drawCell(pdir1[0])
                    path.svgD += svgDrawPath.drawHalf(pdir1[0])
                }
                else if (indexIn === 1) {
                    path.svgD += svgDrawPath.drawHalf(pdir1[1])
                    path.svgD += svgDrawPath.drawLine(pdir1[1])

                    if (isCorner2 || isIn2) {
                        path.svgD += svgDrawPath.drawLine(pdir1[0])
                        path.svgD += svgDrawPath.drawCell(pdir1[0])
                        path.svgD += svgDrawPath.drawHalf(pdir1[1])
                    }
                    else {
                        path.svgD += svgDrawPath.drawHalf(pdir1[1])
                        path.svgD += svgDrawPath.drawLine(pdir1[0])
                        path.svgD += svgDrawPath.drawCell(pdir1[0])
                    }
                }
                else if (isI0) {
                    path.svgD += svgDrawPath.drawHalf(pdir1[1])
                    path.svgD += svgDrawPath.drawLine(pdir1[1])
                    path.svgD += svgDrawPath.drawCell(pdir1[1])
                    path.svgD += svgDrawPath.drawLine(pdir1[0])
                    path.svgD += svgDrawPath.drawCell(pdir1[0])
                    path.svgD += svgDrawPath.drawHalf(pdir1[0])
                }
                else if (isI1) {
                    path.svgD += svgDrawPath.drawHalf(pdir1[1])
                    path.svgD += svgDrawPath.drawLine(pdir1[1])
                    path.svgD += svgDrawPath.drawLine(pdir1[0])
                    path.svgD += svgDrawPath.drawCell(pdir1[0])
                    path.svgD += svgDrawPath.drawCell(pdir1[0])
                    path.svgD += svgDrawPath.drawHalf(pdir1[1])
                }
            }
            else if (isO1) {
                if (indexIn === 0) {
                    path.svgD += svgDrawPath.drawHalf(pdir1[0])
                    path.svgD += svgDrawPath.drawLine(pdir1[0])

                    if (isIn1 || isCorner1) {
                        path.svgD += svgDrawPath.drawLine(pdir1[1])
                        path.svgD += svgDrawPath.drawCell(pdir1[1])
                        path.svgD += svgDrawPath.drawHalf(pdir1[0])
                    }
                    else {
                        path.svgD += svgDrawPath.drawHalf(pdir1[0])
                        path.svgD += svgDrawPath.drawLine(pdir1[1])
                        path.svgD += svgDrawPath.drawCell(pdir1[1])
                    }
                }
                else if (indexIn === 1) {
                    path.svgD += svgDrawPath.drawHalf(pdir1[0])
                    path.svgD += svgDrawPath.drawLine(pdir1[0])
                    path.svgD += svgDrawPath.drawLine(pdir1[1])
                    path.svgD += svgDrawPath.drawCell(pdir1[1])
                    path.svgD += svgDrawPath.drawHalf(pdir1[1])
                }
                else if (isI0) {
                    path.svgD += svgDrawPath.drawHalf(pdir1[0])
                    path.svgD += svgDrawPath.drawLine(pdir1[0])
                    path.svgD += svgDrawPath.drawLine(pdir1[1])
                    path.svgD += svgDrawPath.drawCell(pdir1[1])
                    path.svgD += svgDrawPath.drawCell(pdir1[1])
                    path.svgD += svgDrawPath.drawHalf(pdir1[0])

                }
                else if (isI1) {
                    path.svgD += svgDrawPath.drawHalf(pdir1[0])
                    path.svgD += svgDrawPath.drawLine(pdir1[0])
                    path.svgD += svgDrawPath.drawCell(pdir1[0])
                    path.svgD += svgDrawPath.drawLine(pdir1[1])
                    path.svgD += svgDrawPath.drawCell(pdir1[1])
                    path.svgD += svgDrawPath.drawHalf(pdir1[1])
                }
            }
            else if (isI0) { 
                if (indexOut === 0) {
                    if (isOut1) {
                        path.svgD += svgDrawPath.drawHalf(pdir1[1])
                        path.svgD += svgDrawPath.drawLine(pdir1[1])
                        path.svgD += svgDrawPath.drawCell(pdir1[1])
                        path.svgD += svgDrawPath.drawLine(pdir1[0])
                        path.svgD += svgDrawPath.drawHalf(pdir1[0])
                    }
                    else {
                        path.svgD += svgDrawPath.drawLine(pdir1[0])
                        path.svgD += svgDrawPath.drawHalf(pdir1[1])
                        path.svgD += svgDrawPath.drawLine(pdir1[1])
                        path.svgD += svgDrawPath.drawCell(pdir1[1])
                        path.svgD += svgDrawPath.drawHalf(pdir1[0])
                    }
                }
                else if (indexOut === 1) {
                    if (isOut2 || isCorner2) {
                        path.svgD += svgDrawPath.drawHalf(pdir1[0])
                        path.svgD += svgDrawPath.drawLine(pdir1[1])
                        path.svgD += svgDrawPath.drawCell(pdir1[1])
                        path.svgD += svgDrawPath.drawHalf(pdir1[0])
                    }
                    else {
                        path.svgD += svgDrawPath.drawLine(pdir1[1])
                        path.svgD += svgDrawPath.drawCell(pdir1[1])
                        path.svgD += svgDrawPath.drawHalf(pdir1[0])
                        path.svgD += svgDrawPath.drawHalf(pdir1[0])
                    }
                    
                }
            }
            else if (isI1) {
                if (indexOut === 0) {
                    if (isOut1 || isCorner1) {
                        path.svgD += svgDrawPath.drawHalf(pdir1[1])
                        path.svgD += svgDrawPath.drawLine(pdir1[1])
                        path.svgD += svgDrawPath.drawLine(pdir1[0])
                        path.svgD += svgDrawPath.drawCell(pdir1[0])
                        path.svgD += svgDrawPath.drawHalf(pdir1[1])
                    }
                    else {
                        path.svgD += svgDrawPath.drawLine(pdir1[0])
                        path.svgD += svgDrawPath.drawCell(pdir1[0])
                        path.svgD += svgDrawPath.drawHalf(pdir1[1])
                        path.svgD += svgDrawPath.drawLine(pdir1[1])
                        path.svgD += svgDrawPath.drawHalf(pdir1[1])
                    }
                    
                }
                else if (indexOut === 1) {
                    if (isOut2) {
                        path.svgD += svgDrawPath.drawHalf(pdir1[0])
                        path.svgD += svgDrawPath.drawLine(pdir1[0])
                        path.svgD += svgDrawPath.drawCell(pdir1[0])
                        path.svgD += svgDrawPath.drawLine(pdir1[1])
                        path.svgD += svgDrawPath.drawHalf(pdir1[1])
                    }
                    else {
                        path.svgD += svgDrawPath.drawLine(pdir1[1])
                        path.svgD += svgDrawPath.drawHalf(pdir1[0])
                        path.svgD += svgDrawPath.drawLine(pdir1[0])
                        path.svgD += svgDrawPath.drawCell(pdir1[0])
                        path.svgD += svgDrawPath.drawHalf(pdir1[1])
                    }
                }
            }
        }
        
        arrow = svgDrawArrow.drawArrow(path, directionIn)
        return [ path, arrow ]
    }
}

export { LinkDrawPathsBothForcedOverlaps }