import { linkPathMapHelper } from '../../helpers/linkPathMap.helper'
import { gridModel } from '../../grid.model' 
import { LinkHelper } from '../../helpers/link.helper'

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

        let link
        const { row1, row2, col1, col2 } = this.lh

        if (LinkHelper.isUpOrDown(directionOut))
            link = gridModel.getPosition(row2, col1)

        else if (LinkHelper.isLeftOrRight(directionOut))
            link = gridModel.getPosition(row1, col2)

        linkPathMapHelper.setCorner(link, linkKey)
    }
}

export { LinkPathMapConfigure }
