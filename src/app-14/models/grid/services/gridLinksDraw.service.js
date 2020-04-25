import { gridModel } from "../grid.model"
import { LinkDrawHelper } from "../helpers/linkDraw.helper"
import { linkPathMapHelper } from '../helpers/linkPathMap.helper'
import { GridLinksIterator } from "../iterators/GridLinksIterator"
import { linkDirectionsHelper } from '../helpers/linkDirections.helper'

const gridLinksDrawService = {
    createPathAndArrow(ldh) {
        if (ldh.sameRowCol)
            return this.drawLinkPathSameRowOrCol(ldh)
           
        return this.drawLinkPathOverlaps(ldh)
    },
    
    drawLinkPathSameRowOrCol(ldh) {
        if (ldh.sameRow && LinkDrawHelper.upOrDown(ldh.directionOut))
            return this.drawSameRowButUpOrDown(ldh)

        else if (ldh.sameCol && LinkDrawHelper.leftOrRight(ldh.directionOut))
            return this.drawSameColButLeftOrRight(ldh)

        return this.drawSameRowOrColButStraightLine(ldh)
    },
    drawSameRowButUpOrDown(ldh) {
        let path, arrow

        const row1 =  ldh.row1 + (ldh.directionOut === 'down' ? 1 : -1)
        const row2 =  ldh.row2 + (ldh.directionOut === 'down' ? 1 : -1)
        
        let hasCellsOutSameRow, hasCellsLdh
        if (row1 === 0 || row2 === 0)
            hasCellsOutSameRow = true
        
        else {
            const hasCellsLinkKey = LinkDrawHelper.genLinkKey(
                gridModel.getPosition(row1, ldh.col1), 
                gridModel.getPosition(row2, ldh.col2))
                
            hasCellsLdh = new LinkDrawHelper(hasCellsLinkKey)

            hasCellsOutSameRow = GridLinksIterator.hasCellsOut(hasCellsLdh, ldh.rightLeft)
            hasCellsOutSameRow |= gridModel.model.cells[gridModel.getPosition(row1, ldh.col1)].is
            hasCellsOutSameRow |= gridModel.model.cells[gridModel.getPosition(row2, ldh.col2)].is
        }
        
        path = ldh.drawPath(ldh.directionOut)
        
        if (!hasCellsOutSameRow) {
            path.svgD += ldh.drawHalfOut(ldh.directionOut, ldh.leftRight)

            if (hasCellsLdh)
                linkPathMapHelper.setCorner(hasCellsLdh.link1, ldh.linkKey)
        }
        
        path.svgD += ldh.drawHalfIn(ldh.rightLeft, ldh.directionOut)
        path.svgD += ldh.drawLine(ldh.rightLeft, 'full')

        if (!hasCellsOutSameRow && hasCellsLdh)
            linkPathMapHelper.setDirectionOut(hasCellsLdh, ldh.rightLeft, ldh.linkKey)

        path.svgD += ldh.drawHalfIn(ldh.rightLeft, ldh.directionIn)
        if (!hasCellsOutSameRow) {
            path.svgD += ldh.drawHalfOut(ldh.directionIn, ldh.rightLeft)
            
            if (hasCellsLdh) 
                linkPathMapHelper.setCorner(hasCellsLdh.link2, ldh.linkKey)
        }
        
        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    },
    drawSameColButLeftOrRight(ldh) {
        let path, arrow

        const col1 =  ldh.col1 + (ldh.directionOut === 'right' ? 1 : -1)
        const col2 =  ldh.col2 + (ldh.directionOut === 'right' ? 1 : -1)
        
        let hasCellsOutSameCol, hasCellsLdh
        if (col1 === 0 || col2 === 0)
            hasCellsOutSameCol = true
        
        else {
            const hasCellsLinkKey = LinkDrawHelper.genLinkKey(
                gridModel.getPosition(ldh.row1, col1), 
                gridModel.getPosition(ldh.row2, col2))
                
            hasCellsLdh = new LinkDrawHelper(hasCellsLinkKey)

            hasCellsOutSameCol = GridLinksIterator.hasCellsOut(hasCellsLdh, ldh.upDown)
            hasCellsOutSameCol |= gridModel.model.cells[gridModel.getPosition(ldh.row1, col1)].is
            hasCellsOutSameCol |= gridModel.model.cells[gridModel.getPosition(ldh.row2, col2)].is
        }

        path = ldh.drawPath(ldh.directionOut)
        
        if (!hasCellsOutSameCol) {
            path.svgD += ldh.drawHalfOut(ldh.directionOut, ldh.upDown)
            
            if (hasCellsLdh)
                linkPathMapHelper.setCorner(hasCellsLdh.link1, ldh.linkKey)
        }
        
        path.svgD += ldh.drawHalfIn(ldh.upDown, ldh.directionOut)
        path.svgD += ldh.drawLine(ldh.upDown, 'full')
        
        if (!hasCellsOutSameCol && hasCellsLdh)
            linkPathMapHelper.setDirectionOut(hasCellsLdh, ldh.upDown, ldh.linkKey)

        path.svgD += ldh.drawHalfIn(ldh.upDown, ldh.directionIn)
        
        if (!hasCellsOutSameCol) {
            path.svgD += ldh.drawHalfOut(ldh.directionIn, ldh.upDown)
            
            if (hasCellsLdh) 
                linkPathMapHelper.setCorner(hasCellsLdh.link2, ldh.linkKey)
        }
        
        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    },
    drawSameRowOrColButStraightLine(ldh) {
        let path, arrow

        path = ldh.drawPath(ldh.directionIn)
        path.svgD += ldh.drawLine(ldh.directionIn, 'full')

        linkPathMapHelper.setDirectionOut(ldh, ldh.directionIn, ldh.linkKey)

        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    },

    drawLinkPathOverlaps(ldh) {
        const loh = linkDirectionsHelper.getLinkDirectionsOverlapHelper(ldh)

        if (loh.D1 || loh.D2) 
            return this.drawLinkPathOverlapsPatternD(ldh)

        else if (loh.C1 || loh.C2)
            return this.drawLinkPathOverlapsPatternC(ldh)
        
        else if (loh.B1 || loh.B2)
            return this.drawLinkPathOverlapsPatternB(ldh)
        
        else if (loh.A0 || loh.A1 || loh.A2)
            return this.drawLinkPathOverlapsPatternA(ldh)

        throw new Error('Unique Exception: not found a linkDirectionsOverlapHelper pattern to resolve')
    },
    drawLinkPathOverlapsPatternD(ldh) {
        let path, arrow
        path = ldh.drawPath(ldh.directionOut)

        path.svgD += ldh.drawHalfOut(ldh.directionIn, ldh.directionOut)
        path.svgD += ldh.drawLine(ldh.directionIn, 'full')
        path.svgD += ldh.drawLine(ldh.directionOut, 'full')
        path.svgD += ldh.drawHalfIn(ldh.directionOut, ldh.directionIn)

        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    },
    drawLinkPathOverlapsPatternC(ldh) {
        let path, arrow
        path = ldh.drawPath(ldh.directionOut)

        const pdir1 = ldh.potentialDirections
        const helperDirection = (ldh.directionOut === pdir1[0]) ? pdir1[1] : pdir1[0]

        path.svgD += ldh.drawLine(ldh.directionOut, 'full')
        path.svgD += ldh.drawHalfOut(helperDirection, ldh.directionIn)
        path.svgD += ldh.drawLine(helperDirection, 'full')
        path.svgD += ldh.drawHalfIn(helperDirection, ldh.directionOut)
        
        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    },
    drawLinkPathOverlapsPatternB(ldh) {
        let path, arrow
        path = ldh.drawPath(ldh.directionOut)

        const pdir1 = ldh.potentialDirections
        const helperDirection = (ldh.directionOut === pdir1[0]) ? pdir1[1] : pdir1[0]
        
        path.svgD += ldh.drawHalfOut(helperDirection, ldh.directionOut)
        path.svgD += ldh.drawLine(helperDirection, 'full')
        path.svgD += ldh.drawHalfIn(helperDirection, ldh.directionIn)
        path.svgD += ldh.drawLine(ldh.directionIn, 'full')

        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    },
    drawLinkPathOverlapsPatternA(ldh) {
        let path, arrow
        path = ldh.drawPath(ldh.directionOut)

        path.svgD += ldh.drawLine(ldh.directionOut, 'full')
        path.svgD += ldh.drawHalfOut(ldh.directionOut, ldh.directionIn)
        path.svgD += ldh.drawHalfIn(ldh.directionIn, ldh.directionOut)
        path.svgD += ldh.drawLine(ldh.directionIn, 'full')
        
        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    }
}

export { gridLinksDrawService }
