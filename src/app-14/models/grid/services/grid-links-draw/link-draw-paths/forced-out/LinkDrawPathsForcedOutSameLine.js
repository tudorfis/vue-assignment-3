
import { LinkDrawPathsBase } from '../LinkDrawPathsBase'
import linkEEMapHelper from '../../../../helpers/link-ee/linkEEMap.helper'
import { LinkHelper } from '../../../../helpers/link.helper' 
import { UtilsStrings } from '../../../../../../utils/utilsStrings'

const ucase = UtilsStrings.ucase

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

        if ((isLeftRight && this.lh.isSameCol) || (isUpDown && this.lh.isSameRow)) 
            return this.drawSameRowColSideways({ helperDirection1, helperDirection2 }) 

        else if (this.linkDirectionsMap.loh.isOut1) 
            return this.drawSameRowColNotStraight({ helperDirection2, isLeftRight, isUpDown })

        else 
            return this.drawSameRowColBend({ helperDirection2, isLeftRight, isUpDown })
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
        // if (!linkDirectionsMap.hasCellsForcedOut) path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
        path.svgD += svgDrawPath.drawHalf(helperDirection1)
        path.svgD += svgDrawPath.drawLine(helperDirection1, 'full')
        path.svgD += svgDrawPath.drawHalf(helperDirection1)
        // if (!linkDirectionsMap.hasCellsForcedOut) path.svgD += svgDrawPath.drawHalf(helperDirection2)

        path.svgD += svgDrawPath.drawLine(helperDirection2, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection2)

        return [ path, arrow ]
    }
    drawSameRowColNotStraight(query) {
        
        const { linkDirectionsMap } = this
        const { forcedOutDirection, link2Direction } = linkDirectionsMap
        const { helperDirection2 } = query
        // const { helperDirection3, helperDirection4, hasCellsLooh, hasCellsLoohAfter } = this.generateHelpers(query)
        const { helperDirection3, helperDirection4 } = this.generateHelpers(query)
        
        linkEEMapHelper.patchEEDirection({
            link1: this.lh.link2, 
            link2: this.lh.link1, 
            type: 'in',
            oldDirection: link2Direction,
            newDirection: helperDirection3
        })

        // const verifierKey = UtilsStrings.ucase(forcedOutDirection)

        // if (this.lh[`is${verifierKey}`]) {
        if (this.lh[`is${ucase(forcedOutDirection)}`]) {
            return this.drawSameRowColNotStraightSameDirection({ 
                forcedOutDirection,
                helperDirection3,
                helperDirection4,
                // hasCellsLoohAfter
            })
        }
        else {
            return this.drawSameRowColNotStraightDifferentDirection({
                forcedOutDirection,
                helperDirection2,
                helperDirection3,
                helperDirection4,
                // hasCellsLooh,
                // verifierKey
            })
        }
    }
    drawSameRowColNotStraightSameDirection(query) {
        let path, arrow

        // const  { forcedOutDirection, helperDirection3, helperDirection4, hasCellsLoohAfter } = query
        const  { forcedOutDirection, helperDirection3, helperDirection4 } = query
        const { svgDrawPath, svgDrawArrow } = this

        path = svgDrawPath.drawPath(forcedOutDirection)
        path.svgD += svgDrawPath.drawHalf(helperDirection3)

        // if (!hasCellsLoohAfter)
            // path.svgD += svgDrawPath.drawHalf(helperDirection3)

        path.svgD += svgDrawPath.drawHalf(forcedOutDirection)
        path.svgD += svgDrawPath.drawLine(forcedOutDirection, 'full')

        // if (!hasCellsLoohAfter)
            // path.svgD += svgDrawPath.drawHalf(helperDirection4)

        path.svgD += svgDrawPath.drawLine(helperDirection4, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection4)

        return [ path, arrow ]
    }
    drawSameRowColNotStraightDifferentDirection(query) {
        let path, arrow

        // const { forcedOutDirection, helperDirection2, helperDirection3, helperDirection4, hasCellsLooh, verifierKey } = query
        const { forcedOutDirection, helperDirection2, helperDirection3, helperDirection4 } = query
        // const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { svgDrawPath, svgDrawArrow } = this

        path = svgDrawPath.drawPath(forcedOutDirection)

        // const verifierKeyCorner = UtilsStrings.ucase(forcedOutDirection) + UtilsStrings.ucase(helperDirection3)
        // const hasCellOrCorner = linkDirectionsMap.looh[`is${verifierKey}Cells`]
            // || linkDirectionsMap.looh[`is${verifierKeyCorner}Corner`]
            
        // if (!hasCellOrCorner)
            // path.svgD += svgDrawPath.drawHalf(forcedOutDirection)

        path.svgD += svgDrawPath.drawHalf(helperDirection3)

        // if (!hasCellsLooh)
            // path.svgD += svgDrawPath.drawHalf(helperDirection3)
        
        path.svgD += svgDrawPath.drawHalf(helperDirection2)
        path.svgD += svgDrawPath.drawLine(helperDirection2, 'cell')
        path.svgD += svgDrawPath.drawLine(helperDirection2, 'full')
        
        // if (!hasCellOrCorner)
            // path.svgD += svgDrawPath.drawHalf(helperDirection2)

        // if (!hasCellsLooh)
            // path.svgD += svgDrawPath.drawHalf(helperDirection4)

        path.svgD += svgDrawPath.drawLine(helperDirection4, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection4)
        
        return [ path, arrow ]
    }
    drawSameRowColBend(query) {
        let path, arrow

        const { svgDrawPath, svgDrawArrow, linkDirectionsMap } = this
        const { forcedOutDirection, link2Direction } = linkDirectionsMap
        // const { helperDirection3, helperDirection4, hasCellsLooh, hasCornerLooh} = this.generateHelpers(query)
        const { helperDirection3, helperDirection4 } = this.generateHelpers(query)
                
        const { helperDirection2 } = query

        linkEEMapHelper.patchEEDirection({
            link1: this.lh.link2, 
            link2: this.lh.link1, 
            type: 'in',
            oldDirection: link2Direction,
            newDirection: helperDirection3
        })

        path = svgDrawPath.drawPath(forcedOutDirection)
        
        // if (!linkDirectionsMap.hasCellsForcedOut && !hasCornerLooh) 
            // path.svgD += svgDrawPath.drawHalf(forcedOutDirection)

        path.svgD += svgDrawPath.drawHalf(helperDirection3)
        // if (!hasCellsLooh) path.svgD += svgDrawPath.drawHalf(helperDirection3)
        
        // if (!linkDirectionsMap.hasCellsForcedOut && !hasCornerLooh) 
            // path.svgD += svgDrawPath.drawHalf(helperDirection2)

        path.svgD += svgDrawPath.drawLine(helperDirection2, 'cell')
        path.svgD += svgDrawPath.drawLine(helperDirection2, 'full')
        path.svgD += svgDrawPath.drawHalf(helperDirection2)
        // if (!hasCellsLooh) path.svgD += svgDrawPath.drawHalf(helperDirection4)

        path.svgD += svgDrawPath.drawLine(helperDirection4, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, helperDirection4)

        return [ path, arrow ]
    }

    generateHelpers(query) {
        // const { linkDirectionsMap } = this
        // const { forcedOutDirection } = linkDirectionsMap
        const { isLeftRight, isUpDown } = query

        // let helperDirection3 
        // const looh = linkDirectionsMap.looh

        // const verifierKey = UtilsStrings.ucase(forcedOutDirection)
        // const hasAfter = this.lh[`is${verifierKey}`]

        // if (isLeftRight) {
        //     helperDirection3 = !looh[`isDownCells${hasAfter ? 'After' : ''}`] ? 'down' : ''
        //     helperDirection3 = !helperDirection3 && !looh[`isUpCells${hasAfter ? 'After' : ''}`] ? 'up' : 'down'
        // }
        // else if (isUpDown) {
        //     helperDirection3 = !looh[`isRightCells${hasAfter ? 'After' : ''}`] ? 'right' : ''
        //     helperDirection3 = !helperDirection3 && !looh[`isLeftCells${hasAfter ? 'After' : ''}`] ? 'left' : 'right'
        // }

        let helperDirection3
        if (isLeftRight) helperDirection3 = 'down'
        else if (isUpDown) helperDirection3 = 'right'

        const helperDirection4 = LinkHelper.getOpositeDirection(helperDirection3)

        // let cellVerifier = `is${UtilsStrings.ucase(helperDirection3)}Cells`
        // const hasCellsLooh = linkDirectionsMap.looh[cellVerifier]
        
        // cellVerifier = `is${UtilsStrings.ucase(helperDirection3)}CellsAfter`
        // const hasCellsLoohAfter = linkDirectionsMap.looh[cellVerifier]

        // cellVerifier = `is${UtilsStrings.ucase(helperDirection3)}${UtilsStrings.ucase(forcedOutDirection)}Corner`
        // const hasCornerLooh = linkDirectionsMap.looh[cellVerifier]

        return { 
            helperDirection3,
            helperDirection4,
            // hasCellsLooh,
            // hasCornerLooh,
            // hasCellsLoohAfter
        }
    }
}

export { LinkDrawPathsForcedOutSameLine }