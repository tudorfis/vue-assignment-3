import { linkPathMapHelper } from '../../helpers/linkPathMap.helper'
import { gridModel } from '../../grid.model' 

class LinkPathMapConfigure {
    constructor(query) {
        for (const key in query)
            this[key] = query[key]
    }
    handleSameRowButUpOrDown() {
        const hasCellsOut = this.lhObj.hasCellsOutSameRow
        const hasCellsLh = this.lhObj.hasCellsLh
        
        if (!hasCellsOut && hasCellsLh) {
            linkPathMapHelper.setCorner(hasCellsLh.link1, this.lh.linkKey)
            linkPathMapHelper.setDirectionOut(hasCellsLh, this.lh.getRightLeft, this.lh.linkKey)
            linkPathMapHelper.setCorner(hasCellsLh.link2, this.lh.linkKey)
        }
    }
    handleSameColButLeftOrRight() {
        const hasCellsOut = this.lhObj.hasCellsOutSameCol
        const hasCellsLh = this.lhObj.hasCellsLh

        if (!hasCellsOut && hasCellsLh) {
            linkPathMapHelper.setCorner(hasCellsLh.link1, this.lh.linkKey)
            linkPathMapHelper.setDirectionOut(hasCellsLh, this.lh.getDownUp, this.lh.linkKey)
            linkPathMapHelper.setCorner(hasCellsLh.link2, this.lh.linkKey)
        }
    }
    handleSameRowOrColStraightLine() {
        linkPathMapHelper.setDirectionOut(this.lh, this.lh.directionIn, this.lh.linkKey)
    }
    handleOverlapPatternC() {
        linkPathMapHelper.setDirectionOut(this.lh, this.lh.directionOut, lh.linkKey)
    }
    handleOverlapPatternB() {
        linkPathMapHelper.setDirectionIn(this.lh, this.lh.directionIn, this.lh.linkKey)
    }
    handleOverlapPatternA() {
        linkPathMapHelper.setDirectionOut(this.lh, this.lh.directionOut, this.lh.linkKey)
        linkPathMapHelper.setDirectionIn(this.lh, this.lh.directionIn, this.lh.linkKey)
        
        console.log(`
            linkKey=${this.lh.linkKey}
            A0=${this.loh.A0}
            A1=${this.loh.A1}
            A2=${this.loh.A2}
        `)

        /** @TODO: figure out a way to check if a path goes one way or the other */
        const potentialLinks = [
            gridModel.getPosition(this.lh.row2, this.lh.col1),
            gridModel.getPosition(this.lh.row1, this.lh.col2)
        ]
        for (const link of potentialLinks) {
            if (!gridModel.model.cells[link].is) {
                return linkPathMapHelper.setCorner(link, this.lh.linkKey)
            }
        }
    }
}

export { LinkPathMapConfigure }
