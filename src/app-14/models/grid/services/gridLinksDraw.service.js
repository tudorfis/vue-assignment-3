import { LinkDrawHelper } from "../helpers/linkDraw.helper"
import { GridLinksIterator } from "../iterators/GridLinksIterator"
import { gridModel } from "../grid.model"

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

        let output

        if (ldh.sameRowCol) {
            if (ldh.sameRow && LinkDrawHelper.upOrDown(ldh.directionOut)) 
                output = this.drawSameRowButUpOrDown(ldh)

            else if (ldh.sameCol && LinkDrawHelper.leftOrRight(ldh.directionOut)) 
                output = this.drawSameColButLeftOrRight(ldh)

            else output = this.drawSameRowOrColStraightLine(ldh)
        }

        else if (cellsOverlapHelper.hasCellsOut || cellsOverlapHelper.hasCellsCorner)
            output = this.drawHasCellsInOverlapOut(ldh, cellsOverlapHelper)
        
        else if (cellsOverlapHelper.hasCellsIn || ldh.sameDirection)
            output = this.drawHasCellsInOverlapIn(ldh, cellsOverlapHelper)

        else 
            output = this.drawWithoutOverlapingCells(ldh)

        return [ output[0], output[1] ]
    },
    drawSameRowButUpOrDown(ldh) {
        let path, arrow

        const row1 =  ldh.row1 + (ldh.directionOut === 'down' ? 1 : -1)
        const row2 =  ldh.row2 + (ldh.directionOut === 'down' ? 1 : -1)
        
        let hasCellsOutSameRow
        if (row1 === 0 || row2 === 0)
            hasCellsOutSameRow = true
        
        else {
            const hasCellsLinkKey = LinkDrawHelper.genLinkKey(
                gridModel.getPosition(row1, ldh.col1), 
                gridModel.getPosition(row2, ldh.col2))
                
            const hasCellsLdh = new LinkDrawHelper(hasCellsLinkKey)

            hasCellsOutSameRow = GridLinksIterator.hasCellsOut(hasCellsLdh, ldh.rightLeft)
            hasCellsOutSameRow |= gridModel.model.cells[gridModel.getPosition(row1, ldh.col1)].is
            hasCellsOutSameRow |= gridModel.model.cells[gridModel.getPosition(row2, ldh.col2)].is
        }
        
        path = ldh.drawPath(ldh.directionOut)
        
        if (!hasCellsOutSameRow)
            path.d += ldh.drawHalf(ldh.directionOut, ldh.leftRight, true)
        
        path.d += ldh.drawHalf(ldh.rightLeft, ldh.directionOut, false)
        path.d += ldh.drawLine(ldh.rightLeft, 'full')
        path.d += ldh.drawHalf(ldh.rightLeft, ldh.directionIn, false)
        
        if (!hasCellsOutSameRow)
            path.d += ldh.drawHalf(ldh.directionIn, ldh.rightLeft, true)
        
        path.d += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.d, ldh.directionIn)

        return [ path, arrow ]
    },
    drawSameColButLeftOrRight(ldh) {
        let path, arrow

        const col1 =  ldh.col1 + (ldh.directionOut === 'right' ? 1 : -1)
        const col2 =  ldh.col2 + (ldh.directionOut === 'right' ? 1 : -1)
        
        let hasCellsOutSameCol
        if (col1 === 0 || col2 === 0)
            hasCellsOutSameCol = true
        
        else {
            const hasCellsLinkKey = LinkDrawHelper.genLinkKey(
                gridModel.getPosition(ldh.row1, col1), 
                gridModel.getPosition(ldh.row2, col2))
                
            const hasCellsLdh = new LinkDrawHelper(hasCellsLinkKey)

            hasCellsOutSameCol = GridLinksIterator.hasCellsOut(hasCellsLdh, ldh.upDown)
            hasCellsOutSameCol |= gridModel.model.cells[gridModel.getPosition(ldh.row1, col1)].is
            hasCellsOutSameCol |= gridModel.model.cells[gridModel.getPosition(ldh.row2, col2)].is
        }

        path = ldh.drawPath(ldh.directionOut)
        
        if (!hasCellsOutSameCol)
            path.d += ldh.drawHalf(ldh.directionOut, ldh.upDown, true)
        
        path.d += ldh.drawHalf(ldh.upDown, ldh.directionOut, false)
        path.d += ldh.drawLine(ldh.upDown, 'full')
        path.d += ldh.drawHalf(ldh.upDown, ldh.directionIn, false)
        
        if (!hasCellsOutSameCol)
            path.d += ldh.drawHalf(ldh.directionIn, ldh.upDown, true)
        
        path.d += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.d, ldh.directionIn)

        return [ path, arrow ]
    },
    drawSameRowOrColStraightLine(ldh) {
        let path, arrow

        path = ldh.drawPath(ldh.directionIn)
        path.d += ldh.drawLine(ldh.directionIn, 'full')
        path.d += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.d, ldh.directionIn)

        return [ path, arrow ]
    },
    drawHasCellsInOverlapOut(ldh, coh) {
        let path, arrow

        path = ldh.drawPath(ldh.directionOut)

        if (coh.hasCellsOut) {
            path.d += ldh.drawHalf(coh.potentialDirection, ldh.directionOut, false)
            path.d += ldh.drawLine(ldh.directionOut, 'full')
        }
        else if (coh.hasCellsCorner) {
            path.d += ldh.drawLine(ldh.directionOut, 'full')
            path.d += ldh.drawHalf(coh.potentialDirection, ldh.directionOut, false)
        }

        if (coh.hasCellsIn || ldh.sameDirection) {
            path.d += ldh.drawLine(coh.potentialDirection, 'full')
            path.d += ldh.drawHalf(coh.potentialDirection, ldh.directionOut, false)
            path.d += ldh.drawLine(ldh.directionOut, 'arrow')
            arrow = ldh.drawArrow(path.d, ldh.directionOut)
        }
        else {
            path.d += ldh.drawHalf(ldh.directionOut, ldh.directionIn, true)
            path.d += ldh.drawLine(ldh.directionIn, 'full')
            path.d += ldh.drawLine(ldh.directionIn, 'arrow')
            arrow = ldh.drawArrow(path.d, ldh.directionIn)
        }

        return [ path, arrow ]
    },
    drawHasCellsInOverlapIn(ldh, coh) {
        let path, arrow

        path = ldh.drawPath(ldh.directionOut)

        path.d += ldh.drawLine(ldh.directionOut, 'full')
        path.d += ldh.drawHalf(coh.potentialDirection, ldh.directionOut, false)
        path.d += ldh.drawLine(coh.potentialDirection, 'full')

        if (ldh.sameDirection) {
            path.d += ldh.drawHalf(coh.potentialDirection, ldh.directionOut, false)
            path.d += ldh.drawLine(ldh.directionOut, 'arrow')
            arrow = ldh.drawArrow(path.d, ldh.directionOut)
        }
        else {
            path.d += ldh.drawHalf(ldh.directionOut, ldh.directionIn, true)
            path.d += ldh.drawLine(ldh.directionIn, 'arrow')
            arrow = ldh.drawArrow(path.d, ldh.directionIn)
        }

        return [ path, arrow ]
    },
    drawWithoutOverlapingCells(ldh) {
        let path, arrow

        path = ldh.drawPath(ldh.directionOut)
        path.d += ldh.drawLine(ldh.directionOut, 'full')
        path.d += ldh.drawHalf(ldh.directionOut, ldh.directionIn, true)
        path.d += ldh.drawHalf(ldh.directionIn, ldh.directionOut, false)
        path.d += ldh.drawLine(ldh.directionIn, 'full')
        path.d += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.d, ldh.directionIn)

        return [ path, arrow ]
    }
}

export { gridLinksDrawService }