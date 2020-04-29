
import { LinkDrawPathsBase } from './LinkDrawPathsBase'
import { LinkHelper } from '../../../helpers/link.helper' 

class LinkDrawPathsForcedOutOverlaps extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawOppositeOfPdir0() {
        console.log('%c drawOppositeOfPdir0               ', 'background: red; color: white')
        return this.drawOppositeOfPdir(1, 0, 2)
    }
    drawOppositeOfPdir1() {
        console.log('%c drawOppositeOfPdir1               ', 'background: blue; color: white')
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
        const ldm = this.linkDirectionsMap
        const loh = ldm.linkOverlapHelper

        ldm.link1Direction = ldm.forcedOutDirection
        ldm.link2Direction = LinkHelper.getOtherPdir2(this.lh, ldm.link2Direction)
        
        const pdir1 = this.lh.potentialDirections

        if (pdir1.indexOf(ldm.forcedOutDirection) === 1) {
            if ((loh.isOut2 || loh.isIn2 || loh.isCorner2) && (!loh.isOut1 && !loh.isIn1 && !loh.isCorner1)) {
                ldm.linkOverlapHelper.isCorner1 = true
                ldm.link2Direction = LinkHelper.getOtherPdir2(this.lh, ldm.link2Direction)
            } 
        }
        else if (pdir1.indexOf(ldm.forcedOutDirection) === 0) {
            if ((loh.isOut1 || loh.isIn1 || loh.isCorner1) && (!loh.isOut2 && !loh.isIn2 && !loh.isCorner2)) {
                ldm.linkOverlapHelper.isCorner2 = true
                ldm.link2Direction = LinkHelper.getOtherPdir2(this.lh, ldm.link2Direction)
            }
        }

        return this.prototype.drawLinkPathOverlaps(this.lh)
    }
}

export { LinkDrawPathsForcedOutOverlaps }
