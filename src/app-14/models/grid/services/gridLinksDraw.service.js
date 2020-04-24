import { gridModel } from "../grid.model"
import { LinkDrawHelper } from "../helpers/linkDraw.helper"
import { linkPathMapHelper } from '../helpers/linkPathMap.helper'
import { GridLinksIterator } from "../iterators/GridLinksIterator"
import { globalService } from '../../../services/global.service'

const gridLinksDrawService = {
    createPathAndArrow(ldh) {
        const leftOrRight = LinkDrawHelper.leftOrRight(ldh.directionOut)
        const potentialDirection = ldh.potentialDirections[leftOrRight ? 0 : 1]

        const cellsOverlapHelper = {
            potentialDirection,
            hasCellsOut:        GridLinksIterator.hasCellsOut(ldh, ldh.directionOut),
            hasCellsIn:         GridLinksIterator.hasCellsIn(ldh, potentialDirection),
            hasCellsCorner:     GridLinksIterator.hasCellsCorner(ldh, ldh.directionOut)
        }

        
        if (globalService.linkKey === '3-1__4-6') {
            console.log('ldh.sameRowCol:', ldh.sameRowCol)

            console.log('cellsOverlapHelper.hasCellsOut:', cellsOverlapHelper.hasCellsOut)
            console.log('cellsOverlapHelper.hasCellsCorner:', cellsOverlapHelper.hasCellsCorner)

            console.log('ldh.sameDirection:', ldh.sameDirection)
            console.log('cellsOverlapHelper.hasCellsIn:', cellsOverlapHelper.hasCellsIn)
        }

        let output

        if (ldh.sameRowCol) {
            if (ldh.sameRow && LinkDrawHelper.upOrDown(ldh.directionOut)) 
                output = this.drawSameRowButUpOrDown(ldh)

            else if (ldh.sameCol && LinkDrawHelper.leftOrRight(ldh.directionOut)) 
                output = this.drawSameColButLeftOrRight(ldh)

            else output = this.drawSameRowOrColStraightLine(ldh)
        }

        else if (cellsOverlapHelper.hasCellsOut || cellsOverlapHelper.hasCellsCorner)
            output = this.drawHasCellsOverlapOut(ldh, cellsOverlapHelper)
        
        else if (cellsOverlapHelper.hasCellsIn || ldh.sameDirection)
            output = this.drawHasCellsOverlapIn(ldh, cellsOverlapHelper)

        else 
            output = this.drawWithoutOverlappingCells(ldh)

        return [ output[0], output[1] ]
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
    drawSameRowOrColStraightLine(ldh) {
        let path, arrow

        path = ldh.drawPath(ldh.directionIn)
        path.svgD += ldh.drawLine(ldh.directionIn, 'full')

        linkPathMapHelper.setDirectionOut(ldh, ldh.directionIn, ldh.linkKey)

        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    },
    drawHasCellsOverlapOut(ldh, coh) {
        let path, arrow

        path = ldh.drawPath(ldh.directionOut)

        if (coh.hasCellsOut) {
            path.svgD += ldh.drawHalfIn(coh.potentialDirection, ldh.directionOut)
            path.svgD += ldh.drawLine(ldh.directionOut, 'full')
        }
        else if (coh.hasCellsCorner) {
            path.svgD += ldh.drawLine(ldh.directionOut, 'full')
            
            linkPathMapHelper.setDirectionOut(ldh, ldh.directionOut, ldh.linkKey)
            path.svgD += ldh.drawHalfIn(coh.potentialDirection, ldh.directionOut)
        }

        if (coh.hasCellsIn || ldh.sameDirection) {
            path.svgD += ldh.drawLine(coh.potentialDirection, 'full')
            path.svgD += ldh.drawHalfIn(coh.potentialDirection, ldh.directionOut)
            path.svgD += ldh.drawLine(ldh.directionOut, 'arrow')
            arrow = ldh.drawArrow(path.svgD, ldh.directionOut)
        }
        else {
            path.svgD += ldh.drawHalfOut(ldh.directionOut, ldh.directionIn)
            path.svgD += ldh.drawLine(ldh.directionIn, 'full')

            linkPathMapHelper.setDirectionIn(ldh, ldh.directionIn, ldh.linkKey)
            path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
            arrow = ldh.drawArrow(path.svgD, ldh.directionIn)
        }

        return [ path, arrow ]
    },
    drawHasCellsOverlapIn(ldh, coh) {
        let path, arrow

        path = ldh.drawPath(ldh.directionOut)
        path.svgD += ldh.drawLine(ldh.directionOut, 'full')
        linkPathMapHelper.setDirectionOut(ldh, ldh.directionOut, ldh.linkKey)

        path.svgD += ldh.drawHalfIn(coh.potentialDirection, ldh.directionOut)
        path.svgD += ldh.drawLine(coh.potentialDirection, 'full')

        if (ldh.sameDirection) {
            path.svgD += ldh.drawHalfIn(coh.potentialDirection, ldh.directionOut)
            path.svgD += ldh.drawLine(ldh.directionOut, 'arrow')
            arrow = ldh.drawArrow(path.svgD, ldh.directionOut)
        }
        else {
            path.svgD += ldh.drawHalfOut(ldh.directionOut, ldh.directionIn)
            path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
            arrow = ldh.drawArrow(path.svgD, ldh.directionIn)
        }

        return [ path, arrow ]
    },
    drawWithoutOverlappingCells(ldh) {
        let path, arrow

        path = ldh.drawPath(ldh.directionOut)
        path.svgD += ldh.drawLine(ldh.directionOut, 'full')
        linkPathMapHelper.setDirectionOut(ldh, ldh.directionOut, ldh.linkKey)

        path.svgD += ldh.drawHalfOut(ldh.directionOut, ldh.directionIn)
        path.svgD += ldh.drawHalfIn(ldh.directionIn, ldh.directionOut)
        
        let link
        if (LinkDrawHelper.leftOrRight(ldh.directionOut)) link = gridModel.getPosition(ldh.row1, ldh.col2)
        else if (LinkDrawHelper.upOrDown(ldh.directionOut)) link = gridModel.getPosition(ldh.row2, ldh.col1)
        linkPathMapHelper.setCorner(link, ldh.linkKey)

        path.svgD += ldh.drawLine(ldh.directionIn, 'full')
        linkPathMapHelper.setDirectionIn(ldh, ldh.directionIn, ldh.linkKey)

        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    }
}

export { gridLinksDrawService }
