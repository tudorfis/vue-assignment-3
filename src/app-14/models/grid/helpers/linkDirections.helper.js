import { GridLinksIterator } from '../iterators/GridLinksIterator'
import { LinkDrawHelper } from './linkDraw.helper'
import linkEEMapHelper from './linkEEMap.helper'
import { LinkDirectionsOverlapHelper } from './linkDirectionsOverlap.helper'
import { gridModel } from '../grid.model'

const linkDirectionsHelper = {
    resetLinkMap() {
        this.linkDirectionsMap = {}
    },
    generateLinkDirectionsMap(ldh) {
        const pdir1 = ldh.potentialDirections

        if (!pdir1[1]) {
            const linkDirections = this.generateForSameRowCol(ldh)
            this.setLinkDirectionsMap(ldh, {
                link1Direction: linkDirections[0],
                link2Direction: linkDirections[1]
            })
            return
        }
        
        const linkOverlapHelper = this.createLinkDirectionsOverlapHelper(ldh)
        const ldh2  = new LinkDrawHelper(ldh.linkKey, true)
        const pdir2 = ldh2.potentialDirections
        
        const linkDirections = linkOverlapHelper.produceLinkDirections(pdir1, pdir2)
        
        this.setLinkDirectionsMap(ldh, {
            link1Direction: linkDirections[0],
            link2Direction: linkDirections[1],
            linkOverlapHelper
        })
    },
    setLinkDirectionsMap(ldh, query) {
        this.linkDirectionsMap[ldh.linkKey] = {
            link1Direction: query.link1Direction,
            link2Direction: query.link2Direction,
            linkOverlapHelper: query.linkOverlapHelper
        }
    },
    getLinkDirections(ldh) {
        const ldm = this.linkDirectionsMap[ldh.linkKey]
        return [ ldm.link1Direction, ldm.link2Direction ]
    },
    getLinkDirectionsOverlapHelper(ldh) {
        return this.linkDirectionsMap[ldh.linkKey].linkOverlapHelper
    },
    /**
     *  these directions are used
     *  when an element is on the paths way
     * */
    generateForSameRowCol(ldh) {
        const pdir1 = ldh.potentialDirections
        const firstChoiceDirection = pdir1[0]

        if (!GridLinksIterator.hasCellsOut(ldh, firstChoiceDirection))
            return [ firstChoiceDirection, LinkDrawHelper.oppositeDirection(firstChoiceDirection) ]

        const direction = this.generateSameRowColDirection(ldh, firstChoiceDirection)
        return [ direction, direction ]
    },
    generateSameRowColDirection(ldh, controlDirection) {
        let direction = ''

        const eeMap1 = linkEEMapHelper.eeMap[ldh.link1]
        const eeMap2 = linkEEMapHelper.eeMap[ldh.link2]

        const left1 = eeMap1.left.total
        const right1 = eeMap1.right.total
        const up1 = eeMap1.up.total
        const down1 = eeMap1.down.total

        const left2 = eeMap2.left.total
        const right2 = eeMap2.right.total
        const up2 = eeMap2.up.total
        const down2 = eeMap2.down.total

        if (LinkDrawHelper.upOrDown(controlDirection)) {
            if (left1 === right1) {

                if (left2 === right2) direction = 'right'
                else if (left2 > right2) direction = 'right'
                else if (left2 < right2) direction = 'left'
            }
            else if (left1 > right1) direction = 'right'
            else if (left1 < right1) direction = 'left'

            if (this.generateLdhSameColButLeftOrRight(ldh, direction).hasCellsOutSameCol) 
                direction = direction === 'right' ? 'left' : 'right'
        }
        else if (LinkDrawHelper.leftOrRight(controlDirection)) {
            if (up1 === down1) {

                if (up2 === down2) direction = 'down'
                else if (up2 > down2) direction = 'down'
                else if (up2 < down2) direction = 'up'
            }
            else if (up1 > down1) direction = 'down'
            else if (up1 < down1) direction = 'up'

            if (this.generateLdhSameRowButUpOrDown(ldh, direction).hasCellsOutSameRow) 
                direction = direction === 'down' ? 'up' : 'down'
        }

        return direction
    },
    generateLdhSameColButLeftOrRight(ldh, controlDirection) {
        const col1 =  ldh.col1 + (controlDirection === 'right' ? 1 : -1)
        const col2 =  ldh.col2 + (controlDirection === 'right' ? 1 : -1)
        
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

        return { hasCellsOutSameCol, hasCellsLdh }
    },
    generateLdhSameRowButUpOrDown(ldh, controlDirection) {
        const row1 =  ldh.row1 + (controlDirection === 'down' ? 1 : -1)
        const row2 =  ldh.row2 + (controlDirection === 'down' ? 1 : -1)
        
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

        return { hasCellsOutSameRow, hasCellsLdh }
    },
    /**
     *  this helper is used to generate 
     *  the most optimum path for a link
     * */
    createLinkDirectionsOverlapHelper(ldh) {
        const ldh2 = new LinkDrawHelper(ldh.linkKey, true)
        
        const eeMap1 = linkEEMapHelper.eeMap[ldh.link1]

        const pdir1 = ldh.potentialDirections
        const pdir2 = ldh2.potentialDirections

        let isEE2 = (eeMap1[pdir1[1]].total > 0 && eeMap1[pdir1[0]].total === eeMap1[pdir1[1]].total)
        isEE2 |= eeMap1[pdir1[0]].total > eeMap1[pdir1[1]].total

        return  new LinkDirectionsOverlapHelper({
            isCorner1: GridLinksIterator.hasCellsCorner(ldh, pdir1[0]),
            isCorner2: GridLinksIterator.hasCellsCorner(ldh, pdir1[1]),
            isOut1: GridLinksIterator.hasCellsOut(ldh, pdir1[0]),
            isOut2: GridLinksIterator.hasCellsOut(ldh, pdir1[1]),
            isIn1: GridLinksIterator.hasCellsIn(ldh, LinkDrawHelper.oppositeDirection(pdir2[0])),
            isIn2: GridLinksIterator.hasCellsIn(ldh, LinkDrawHelper.oppositeDirection(pdir2[1])),
            isEE2
        })
        
    }
}

globalThis.linkDirectionsHelper = linkDirectionsHelper
export { linkDirectionsHelper }
