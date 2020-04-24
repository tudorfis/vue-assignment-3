import { gridModel } from "../grid.model"
import { LinkDrawHelper } from "../helpers/linkDraw.helper"
import { linkPathMapHelper } from '../helpers/linkPathMap.helper'
import { GridLinksIterator } from "../iterators/GridLinksIterator"
import { linkDirectionsHelper } from '../helpers/linkDirections.helper'

const gridLinksDrawService = {
    createPathAndArrow(ldh) {
        if (ldh.sameRowCol) {

            if (ldh.sameRow && LinkDrawHelper.upOrDown(ldh.directionOut)) {
                return this.drawSameRowButUpOrDown(ldh)
            }
            else if (ldh.sameCol && LinkDrawHelper.leftOrRight(ldh.directionOut)) {
                return this.drawSameColButLeftOrRight(ldh)
            }
            else {
                return this.drawSameRowOrColStraightLine(ldh)
            }
        }
        else {
            return this.drawLinkPaths(ldh)
        }
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
    drawLinkPaths(ldh) {
        let path, arrow
            
        const helper = linkDirectionsHelper.generateLinkDirections(ldh)
        
        const link1Direction = helper[0]
        const link2Direction = helper[1]
        
        const coh = helper[2]
        const pdir1 = helper[3]

        path = ldh.drawPath(link1Direction)

        if (link1Direction === pdir1[0]) {
            generateLinkPaths(coh.isOut1, coh.isIn2, coh.isCorner1, coh.isIn1)
            return [ path, arrow ]
        }
        else if (link1Direction === pdir1[1]) {
            generateLinkPaths(coh.isOut2, coh.isIn1, coh.isCorner2, coh.isIn2)
            return [ path, arrow ]
        }

        function generateLinkPaths(cond1, cond2, cond3, cond4) {
            const otherDirection = (link1Direction === pdir1[0]) ? pdir1[1] : pdir1[0]

            if (cond1) {
                path.svgD += ldh.drawHalfIn(otherDirection, link1Direction)
                path.svgD += ldh.drawLine(otherDirection, 'full')

                if (cond2) {
                    path.svgD += ldh.drawLine(link1Direction, 'full')
                    path.svgD += ldh.drawHalfIn(link1Direction, link2Direction)
                }
                else {
                    path.svgD += ldh.drawHalfIn(otherDirection, link2Direction)
                    path.svgD += ldh.drawLine(link1Direction, 'full')
                }
            }
            else {
                path.svgD += ldh.drawLine(link1Direction, 'full')

                if (cond3 || cond4) {
                    path.svgD += ldh.drawHalfIn(otherDirection, link1Direction)
                    path.svgD += ldh.drawLine(otherDirection, 'full')
                    path.svgD += ldh.drawHalfOut(otherDirection, link1Direction)
                }
                else {
                    path.svgD += ldh.drawHalfOut(link1Direction, ldh.directionIn)
                    path.svgD += ldh.drawHalfIn(otherDirection, link1Direction)
                    path.svgD += ldh.drawLine(otherDirection, 'full')
                }
            }

            path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
            arrow = ldh.drawArrow(path.svgD, ldh.directionIn)
        }
    }
}

export { gridLinksDrawService }
