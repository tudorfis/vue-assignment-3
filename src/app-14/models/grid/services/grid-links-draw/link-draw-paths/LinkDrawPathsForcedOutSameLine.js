
import { LinkDrawPathsBase } from './LinkDrawPathsBase'
import linkEEMapHelper from '../../../helpers/link-ee/linkEEMap.helper'
import { LinkHelper } from '../../../helpers/link.helper' 
import { UtilsStrings } from '../../../../../utils/utilsStrings'

class LinkDrawPathsForcedOutSameLine extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawSameRowCol() {
        const { forcedOutDirection } = this.linkDirectionsMap

        const isLeftRight = LinkHelper.isLeftOrRight(forcedOutDirection)
        const isUpDown = LinkHelper.isUpOrDown(forcedOutDirection)

        const helperDirection1 = isLeftRight ? this.lh.getDownUp : this.lh.getRightLeft
        const helperDirection2 = LinkHelper.getOpositeDirection(forcedOutDirection)

        if ((isLeftRight && this.lh.isSameCol) || (isUpDown && this.lh.isSameRow)) {
            console.log('%c drawSameRowColSideways               ', 'background: lightgreen')
            return this.drawSameRowColSideways({ helperDirection1, helperDirection2 }) 
        }

        else if (this.linkDirectionsMap.loh.isOut1) {
            console.log('%c drawSameRowColNotStraight               ', 'background: lightblue')
            return this.drawSameRowColNotStraight({ helperDirection2, isLeftRight, isUpDown })
        }

        else {
            console.log('%c drawSameRowCol               ', 'background: pink')
            return this.drawSameRowColBend({ helperDirection2, isLeftRight, isUpDown })
        }
    }
    drawSameRowColSideways(query) {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { forcedOutDirection, link2Direction } = linkDirectionsMap
        const { helperDirection1, helperDirection2 } = query

        linkEEMapHelper.patchEEDirection({
            link1: this.lh.link2, 
            link2: this.lh.link1, 
            type: 'in',
            oldDirection: link2Direction,
            newDirection: forcedOutDirection
        })

        path = svgDrawPath.drawPath(forcedOutDirection)
        if (!linkDirectionsMap.hasCellsForcedOut) path.svgD += svgDrawPath.drawHalfOut(forcedOutDirection, helperDirection2)
        path.svgD += svgDrawPath.drawHalfIn(helperDirection1, forcedOutDirection)
        path.svgD += svgDrawPath.drawLine(helperDirection1, 'full')
        path.svgD += svgDrawPath.drawHalfIn(helperDirection1, forcedOutDirection)
        if (!linkDirectionsMap.hasCellsForcedOut) path.svgD += svgDrawPath.drawHalfOut(helperDirection2, helperDirection2)

        path.svgD += svgDrawPath.drawLine(helperDirection2, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection2)

        return [ path, arrow ]
    }
    drawSameRowColNotStraight(query) {
        
        const { linkDirectionsMap } = this
        const { forcedOutDirection, link2Direction } = linkDirectionsMap
        const { helperDirection2 } = query
        const { helperDirection3, helperDirection4, hasCellsHelperDirection, hasCellsAfterHelperDirection } 
            = this.generateSameRowColBendHelpers(query)
        
        linkEEMapHelper.patchEEDirection({
            link1: this.lh.link2, 
            link2: this.lh.link1, 
            type: 'in',
            oldDirection: link2Direction,
            newDirection: helperDirection3
        })

        const verifierKey = UtilsStrings.ucase(forcedOutDirection)

        if (this.lh[`is${verifierKey}`]) {
            return this.drawSameRowColNotStraightSameDirection({ 
                forcedOutDirection,
                helperDirection3,
                helperDirection4,
                hasCellsAfterHelperDirection
            })
        }
        else {
            return this.drawSameRowColNotStraightDifferentDirection({
                forcedOutDirection,
                helperDirection2,
                helperDirection3,
                helperDirection4,
                hasCellsHelperDirection,
                verifierKey
            })
        }
    }
    drawSameRowColNotStraightSameDirection(query) {
        let path, arrow

        const  { forcedOutDirection, helperDirection3, helperDirection4, hasCellsAfterHelperDirection } = query
        const { svgDrawPath, svgDrawArrow } = this

        path = svgDrawPath.drawPath(forcedOutDirection)
        path.svgD += svgDrawPath.drawHalfOut(helperDirection3, helperDirection4)

        if (!hasCellsAfterHelperDirection)
            path.svgD += svgDrawPath.drawHalfOut(helperDirection3, helperDirection4)

        path.svgD += svgDrawPath.drawHalfIn(forcedOutDirection, helperDirection3)
        path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')

        if (!hasCellsAfterHelperDirection)
            path.svgD += svgDrawPath.drawHalfIn(helperDirection4, helperDirection3)

        path.svgD += svgDrawPath.drawLine(helperDirection4, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection4)

        return [ path, arrow ]
    }
    drawSameRowColNotStraightDifferentDirection(query) {
        let path, arrow

        const { forcedOutDirection, helperDirection2, helperDirection3, helperDirection4, hasCellsHelperDirection, verifierKey } = query
        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this

        path = svgDrawPath.drawPath(forcedOutDirection)

        const verifierKeyCorner = UtilsStrings.ucase(forcedOutDirection) + UtilsStrings.ucase(helperDirection3)
        const hasCellOrCorner = linkDirectionsMap.looh[`is${verifierKey}Cells`]
            || linkDirectionsMap.looh[`is${verifierKeyCorner}Corner`]
            
        if (!hasCellOrCorner)
            path.svgD += svgDrawPath.drawHalfOut(forcedOutDirection, helperDirection2)

        path.svgD += svgDrawPath.drawHalfOut(helperDirection3, helperDirection4)

        if (!hasCellsHelperDirection)
            path.svgD += svgDrawPath.drawHalfOut(helperDirection3, helperDirection4)
        
        path.svgD += svgDrawPath.drawHalfIn(helperDirection2, helperDirection3)
        path.svgD += svgDrawPath.drawLine(helperDirection2, 'cell')
        path.svgD += svgDrawPath.drawLine(helperDirection2, 'full')
        
        if (!hasCellOrCorner)
            path.svgD += svgDrawPath.drawHalfIn(helperDirection2, helperDirection3)

        if (!hasCellsHelperDirection)
            path.svgD += svgDrawPath.drawHalfIn(helperDirection4, helperDirection3)

        path.svgD += svgDrawPath.drawLine(helperDirection4, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection4)
        
        return [ path, arrow ]
    }
    drawSameRowColBend(query) {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { forcedOutDirection, link2Direction } = linkDirectionsMap
        const { helperDirection3, helperDirection4, hasCellsHelperDirection, hasCornerHelperDirection} 
            = this.generateSameRowColBendHelpers(query)
                
        const { helperDirection2 } = query

        linkEEMapHelper.patchEEDirection({
            link1: this.lh.link2, 
            link2: this.lh.link1, 
            type: 'in',
            oldDirection: link2Direction,
            newDirection: helperDirection3
        })

        path = svgDrawPath.drawPath(forcedOutDirection)
        
        if (!linkDirectionsMap.hasCellsForcedOut && !hasCornerHelperDirection) 
            path.svgD += svgDrawPath.drawHalfOut(forcedOutDirection, helperDirection2)

        path.svgD += svgDrawPath.drawHalfIn(helperDirection3, helperDirection4)
        if (!hasCellsHelperDirection) path.svgD += svgDrawPath.drawHalfIn(helperDirection3, helperDirection4)
        
        if (!linkDirectionsMap.hasCellsForcedOut && !hasCornerHelperDirection) 
            path.svgD += svgDrawPath.drawHalfOut(helperDirection2, helperDirection4)

        path.svgD += svgDrawPath.drawLine(helperDirection2, 'cell')
        path.svgD += svgDrawPath.drawLine(helperDirection2, 'full')
        path.svgD += svgDrawPath.drawHalfOut(helperDirection2, helperDirection4)
        if (!hasCellsHelperDirection) path.svgD += svgDrawPath.drawHalfIn(helperDirection4, helperDirection3)

        path.svgD += svgDrawPath.drawLine(helperDirection4, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection4)

        return [ path, arrow ]
    }
    generateSameRowColBendHelpers(query) {
        const { linkDirectionsMap } = this
        const { forcedOutDirection } = linkDirectionsMap
        const { isLeftRight, isUpDown } = query

        let helperDirection3 
        const verifierKey = UtilsStrings.ucase(forcedOutDirection)
        const isAfter = this.lh[`is${verifierKey}`]
        const looh = linkDirectionsMap.looh

        if (isLeftRight) {
            helperDirection3 = !looh[`isDownCells${isAfter ? 'After' : ''}`] ? 'down' : ''
            helperDirection3 = !helperDirection3 && !looh[`isUpCells${isAfter ? 'After' : ''}`] ? 'up' : 'down'
        }
        else if (isUpDown) {
            helperDirection3 = !looh[`isRightCells${isAfter ? 'After' : ''}`] ? 'right' : ''
            helperDirection3 = !helperDirection3 && !looh[`isLeftCells${isAfter ? 'After' : ''}`] ? 'left' : 'right'
        }

        const helperDirection4 = LinkHelper.getOpositeDirection(helperDirection3)

        let cellVerifier = `is${UtilsStrings.ucase(helperDirection3)}Cells`
        const hasCellsHelperDirection = linkDirectionsMap.looh[cellVerifier]
        
        cellVerifier = `is${UtilsStrings.ucase(helperDirection3)}CellsAfter`
        const hasCellsAfterHelperDirection = linkDirectionsMap.looh[cellVerifier]

        cellVerifier = `is${UtilsStrings.ucase(helperDirection3)}${UtilsStrings.ucase(forcedOutDirection)}Corner`
        console.log('cellVerifier:', cellVerifier)
        const hasCornerHelperDirection = linkDirectionsMap.looh[cellVerifier]
        console.log('linkDirectionsMap.looh:', linkDirectionsMap.looh)

        return { 
            helperDirection3,
            helperDirection4,
            hasCellsHelperDirection,
            hasCornerHelperDirection,
            hasCellsAfterHelperDirection
        }
    }
}

export { LinkDrawPathsForcedOutSameLine }