import { LinkDrawPathsBase } from "../LinkDrawPathsBase"
import { UtilsStrings } from "../../../../../../utils/utilsStrings"
import { LinkHelper } from "../../../../helpers/link.helper"
import linkEEMapHelper from "../../../../helpers/link-ee/linkEEMap.helper"

const ucase = UtilsStrings.ucase
class LinkDrawPathsBothForcedOverlaps extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawOverlaps() {
        let path, arrow

        const ldm = this.linkDirectionsMap
        const { svgDrawPath, svgDrawArrow, lh, lh2 } = this
        const { link1Direction, link2Direction, forcedOutDirection, forcedInDirection, loh, looh } = ldm
        
        const isO0 = ldm.isForcedOutOppositeOfPdir0(lh)
        const isO1 = ldm.isForcedOutOppositeOfPdir1(lh)
        
        const isI0 = ldm.isForcedInOppositeOfPdir0(lh2)
        const isI1 = ldm.isForcedInOppositeOfPdir1(lh2)

        const pdir1 = this.lh.potentialDirections
        console.log('pdir1:', pdir1)
        const pdir2 = this.lh2.potentialDirections
        console.log('pdir2:', pdir2)

        const indexOut = pdir1.indexOf(forcedOutDirection)
        const indexIn = pdir2.indexOf(forcedInDirection)
        
        const { isOut1, isOut2, isCorner1, isCorner2, isIn1, isIn2 } = loh
        
        console.log({ isOut1, isOut2, isCorner1, isCorner2 })
        console.log({ isIn1, isIn2, indexOut, indexIn })
        console.log({ isO0, isO1, isI0, isI1 })

        linkEEMapHelper.patchEEDirection({
            link1: this.lh.link1, 
            link2: this.lh.link2, 
            type: 'out',
            oldDirection: link1Direction,
            newDirection: forcedOutDirection
        })

        linkEEMapHelper.patchEEDirection({
            link1: this.lh.link2, 
            link2: this.lh.link1, 
            type: 'in',
            oldDirection: link2Direction,
            newDirection: forcedInDirection
        })
        
        const directionIn = LinkHelper.getOpositeDirection(forcedInDirection)

        path = svgDrawPath.drawPath(forcedOutDirection)

        if (!isO0 && !isO1 && !isI0 && !isI1) {

            if (indexOut === 0 && indexIn === 0) {
                if (isOut1 || isCorner1) {
                    if (isIn1) {
                        path.svgD += svgDrawPath.drawLine(directionIn, 'full')
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                    }
                    else {
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                        path.svgD += svgDrawPath.drawLine(directionIn, 'full')
                    }
                }
                else {
                    if (isIn1) {
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(directionIn, 'full')
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                    }
                    else {
                        
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(directionIn, 'full')
                    }
                }
            }

            else if (indexOut === 0 && indexIn === 1) {
                if (isOut1) {
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')

                    if (isIn2) {
                        path.svgD += svgDrawPath.drawLine(directionIn, 'full')
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                    }
                    else {
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                        path.svgD += svgDrawPath.drawLine(directionIn, 'full')
                    }
                }
                else {
                    path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                }
            }

            else if (indexOut === 1 && indexIn === 0) {
                if (isIn1 && !isOut2) {
                    path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                }
                else if (isOut2 && !isIn1) {
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                }
                else if (isOut2 && isIn1) {
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                }
                else {
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                }
            }

            else if (indexOut === 1 && indexIn === 1) {
                if (isOut2 || isCorner2) {
                    if (isIn2) {
                        path.svgD += svgDrawPath.drawLine(directionIn, 'full')
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                    }
                    else {
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                        path.svgD += svgDrawPath.drawLine(directionIn, 'full')
                    }
                }
                else {
                    if (isIn2) {
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(directionIn, 'full')
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                    }
                    else {
                        path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')
                        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
                        path.svgD += svgDrawPath.drawHalf(directionIn)
                        path.svgD += svgDrawPath.drawLine(directionIn, 'full')
                    }
                    
                }
            }
        }

        else {
            if (isO0) {
                if (indexIn === 0) {
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'cell')
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                }
                else if (indexIn === 1) {
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')

                    if (isCorner2 || isIn2) {
                        path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                        path.svgD += svgDrawPath.drawLine(pdir1[0], 'cell')
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                    }
                    else {
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                        path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                        path.svgD += svgDrawPath.drawLine(pdir1[0], 'cell')
                    }
                }
                else if (isI0) {
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                    path.svgD += svgDrawPath.drawLine(pdir1[1], 'cell')
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'cell')
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                }
                else if (isI1) {
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'cell')
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'cell')
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                }
            }
            else if (isO1) {
                if (indexIn === 0) {
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')

                    if (isIn1 || isCorner1) {
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'cell')
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                    }
                    else {
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'cell')
                    }
                }
                else if (indexIn === 1) {
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                    path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                    path.svgD += svgDrawPath.drawLine(pdir1[1], 'cell')
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                }
                else if (isI0) {
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                    path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                    path.svgD += svgDrawPath.drawLine(pdir1[1], 'cell')
                    path.svgD += svgDrawPath.drawLine(pdir1[1], 'cell')
                    path.svgD += svgDrawPath.drawHalf(pdir1)

                }
                else if (isI1) {
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                    path.svgD += svgDrawPath.drawLine(pdir1[0], 'cell')
                    path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                    path.svgD += svgDrawPath.drawLine(pdir1[1], 'cell')
                    path.svgD += svgDrawPath.drawHalf(pdir1)
                }
            }
            else if (isI0) { 
                if (indexOut === 0) {
                    if (isOut1) {
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'cell')
                        path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                    }
                    else {
                        path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'cell')
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                    }
                }
                else if (indexOut === 1) {
                    if (isOut2 || isCorner2) {
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'cell')
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                    }
                    else {
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'cell')
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                    }
                    
                }
            }
            else if (isI1) {
                if (indexOut === 0) {
                    if (isOut1 || isCorner1) {
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                        path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                        path.svgD += svgDrawPath.drawLine(pdir1[0], 'cell')
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                    }
                    else {
                        path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                        path.svgD += svgDrawPath.drawLine(pdir1[0], 'cell')
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                    }
                    
                }
                else if (indexOut === 1) {
                    if (isOut2) {
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                        path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                        path.svgD += svgDrawPath.drawLine(pdir1[0], 'cell')
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                    }
                    else {
                        path.svgD += svgDrawPath.drawLine(pdir1[1], 'full')
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                        path.svgD += svgDrawPath.drawLine(pdir1[0], 'full')
                        path.svgD += svgDrawPath.drawLine(pdir1[0], 'cell')
                        path.svgD += svgDrawPath.drawHalf(pdir1)
                    }
                }
            }
        }
        
        path.svgD += svgDrawPath.drawLine(directionIn, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, directionIn)

        return [ path, arrow ]
    }

    drawOppositeOfPdir0() { }
    drawOppositeOfPdir1() { }
    drawLastRemainingOfPdir() { }
}

export { LinkDrawPathsBothForcedOverlaps }