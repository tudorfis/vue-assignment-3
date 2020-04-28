
import { LinkDrawPathsBase } from './LinkDrawPathsBase'
import { UtilsStrings } from '../../../../../utils/utilsStrings'
import { linkEEMapHelper } from '../../../helpers/link-ee/linkEEDiff.helper'
import { LinkHelper } from '../../../helpers/link.helper' 

class LinkDrawPathsForcedOut extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawOppositeOfPdir0() {
        console.log('drawOppositeOfPdir0')

        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { directionOut, directionIn } = this.lh
        const { linkOverlapHelper, linkOverlapOutsideHelper } = linkDirectionsMap
        const { forcedOutDirection, link1Direction, link2Direction } = linkOverlapOutsideHelper
        
        console.log('directionIn:', directionIn)
        console.log('forcedOutDirection:', forcedOutDirection)

        path = svgDrawPath.drawPath(forcedOutDirection)

        path.svgD += svgDrawPath.drawLine(directionIn, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, directionIn)

        return [ path, arrow ]
    }
    drawOppositeOfPdir1() {
        console.log('drawOppositeOfPdir1')

        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        let { directionIn } = this.lh
        const { forcedOutDirection, link2Direction } = linkDirectionsMap
        
        const helperDirection1 = this.lh.potentialDirections[0]
        const helperDirection2 = this.lh.potentialDirections[1]

        const loh = linkDirectionsMap.linkOverlapHelper
        const looh = linkDirectionsMap.linkOverlapOutsideHelper


        if (loh.isIn1 || loh.isCorner1 && directionIn !== helperDirection1) {
            linkEEMapHelper.patchEEDirection({
                lh: this.lh,
                link1: this.lh.link1, 
                link2: this.lh.link2, 
                type: 'in',
                oldDirection: link2Direction,
                newDirection: LinkHelper.getOppositeDirection(helperDirection1)
            })
            
            this.lh = new LinkHelper(this.lh.linkKey)
            directionIn = this.lh.directionIn

            console.log('%c               ', 'background: green')
        }



        path = svgDrawPath.drawPath(forcedOutDirection)
        const cellVerifierKey = `is${UtilsStrings.ucase(forcedOutDirection)}Cells`

        if (!looh[cellVerifierKey]) path.svgD += svgDrawPath.drawHalfOut(forcedOutDirection, directionIn)
        path.svgD += svgDrawPath.drawHalfIn(helperDirection1, forcedOutDirection)
        path.svgD += svgDrawPath.drawLine(helperDirection1, 'full')
        
        if (!loh.isIn1 && !loh.isCorner1) 
            path.svgD += svgDrawPath.drawHalfIn(helperDirection1, forcedOutDirection)

        path.svgD += svgDrawPath.drawHalfOut(helperDirection2, forcedOutDirection)

        if (looh[cellVerifierKey]) path.svgD += svgDrawPath.drawHalfOut(helperDirection2, forcedOutDirection)
        if (!looh[cellVerifierKey]) path.svgD += svgDrawPath.drawLine(helperDirection2, 'cell')
        
        if (!loh.isIn1 && !loh.isCorner1) 
            path.svgD += svgDrawPath.drawLine(directionIn, 'full')
        else {
            path.svgD += svgDrawPath.drawLine(helperDirection2, 'full')
            path.svgD += svgDrawPath.drawHalfOut(helperDirection2, forcedOutDirection)
        }

        path.svgD += svgDrawPath.drawLine(directionIn, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, directionIn)

        console.log('%c       ', 'background: pink')
        console.log('loh:', loh)
        console.log('helperDirection1:', helperDirection1)
        console.log('helperDirection2:', helperDirection2)
        console.log('directionIn:', directionIn)
        console.log('link2Direction:', link2Direction)
        console.log('forcedOutDirection:', forcedOutDirection)
        console.log('cellVerifierKey:', cellVerifierKey)
        console.log('looh[cellVerifierKey]:', looh[cellVerifierKey])

        return [ path, arrow ]
    }
    drawLastRemaining() {
        console.log('drawLastRemaining')

    }
}

export { LinkDrawPathsForcedOut }