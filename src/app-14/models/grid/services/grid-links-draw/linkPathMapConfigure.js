import { linkPathMapHelper } from '../../helpers/linkPathMap.helper'
import { gridModel } from '../../grid.model' 

class LinkPathMapConfigure {
    constructor(query) {
        for (const key in query)
            this[key] = query[key]
    }
    handleSameRowButUpOrDown() {
        const { hasCellsOutSameRow, hasCellsLh } = this.lhObj
        
        if (!hasCellsOutSameRow && hasCellsLh) {
            const { linkKey, getRightLeft } = this.lh
            
            linkPathMapHelper.setCorner(hasCellsLh.link1, linkKey)
            linkPathMapHelper.setDirectionOut(hasCellsLh, getRightLeft, linkKey)
            linkPathMapHelper.setCorner(hasCellsLh.link2, linkKey)
        }
    }
    handleSameColButLeftOrRight() {
        const { hasCellsOutSameCol, hasCellsLh } = this.lhObj

        if (!hasCellsOutSameCol && hasCellsLh) {
            const { linkKey, getDownUp } = this.lh

            linkPathMapHelper.setCorner(hasCellsLh.link1, linkKey)
            linkPathMapHelper.setDirectionOut(hasCellsLh, getDownUp, linkKey)
            linkPathMapHelper.setCorner(hasCellsLh.link2, linkKey)
        }
    }
    handleSameRowOrColStraightLine() {
        const { directionIn, linkKey } = this.lh
        linkPathMapHelper.setDirectionOut(this.lh, directionIn, linkKey)
    }
    handleOverlapPatternC() {
        const { directionOut, linkKey } = this.lh
        linkPathMapHelper.setDirectionOut(this.lh, directionOut, linkKey)
    }
    handleOverlapPatternB() {
        const { directionIn, linkKey } = this.lh
        linkPathMapHelper.setDirectionIn(this.lh, directionIn, linkKey)
    }
    handleOverlapPatternA() {
        const { directionOut, directionIn, linkKey } = this.lh
        linkPathMapHelper.setDirectionOut(this.lh, directionOut, linkKey)
        linkPathMapHelper.setDirectionIn(this.lh, directionIn, linkKey)
        
        console.log(`
            linkKey=${this.lh.linkKey}
            A0=${this.loh.A0}
            A1=${this.loh.A1}
            A2=${this.loh.A2}
        `)

        /** @TODO: figure out a way to check if a path goes one way or the other */
        const { row1, row2, col1, col2 } = this.lh
        const potentialLinks = [
            gridModel.getPosition(row2, col1),
            gridModel.getPosition(row1, col2)
        ]
        for (const link of potentialLinks) {
            if (!gridModel.model.cells[link].is) {
                return linkPathMapHelper.setCorner(link, linkKey)
            }
        }
    }
}

export { LinkPathMapConfigure }
