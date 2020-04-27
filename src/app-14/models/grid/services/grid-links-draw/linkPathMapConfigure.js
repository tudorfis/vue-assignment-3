import { linkPathMapHelper } from '../../helpers/linkPathMap.helper'
import { gridModel } from '../../grid.model' 

const linkPathMapConfigure = {
    sameRowButUpOrDown(ldh, ldhSameRowObj) {
        const hasCellsOut = ldhSameRowObj.hasCellsOutSameRow
        const hasCellsLdh = ldhSameRowObj.hasCellsLdh
        
        if (!hasCellsOut && hasCellsLdh) {
            linkPathMapHelper.setCorner(hasCellsLdh.link1, ldh.linkKey)
            linkPathMapHelper.setDirectionOut(hasCellsLdh, ldh.rightLeft, ldh.linkKey)
            linkPathMapHelper.setCorner(hasCellsLdh.link2, ldh.linkKey)
        }
    },
    sameColButLeftOrRight(ldh, ldhSameRowObj) {
        const hasCellsOut = ldhSameRowObj.hasCellsOutSameCol
        const hasCellsLdh = ldhSameRowObj.hasCellsLdh

        if (!hasCellsOut && hasCellsLdh) {
            linkPathMapHelper.setCorner(hasCellsLdh.link1, ldh.linkKey)
            linkPathMapHelper.setDirectionOut(hasCellsLdh, ldh.upDown, ldh.linkKey)
            linkPathMapHelper.setCorner(hasCellsLdh.link2, ldh.linkKey)
        }
    },
    sameRowOrColStraightLine(ldh) {
        linkPathMapHelper.setDirectionOut(ldh, ldh.directionIn, ldh.linkKey)
    },
    overlapPatternC(ldh) {
        linkPathMapHelper.setDirectionOut(ldh, ldh.directionOut, ldh.linkKey)
    },
    overlapPatternB(ldh) {
        linkPathMapHelper.setDirectionIn(ldh, ldh.directionIn, ldh.linkKey)
    },
    overlapPatternA(ldh, loh) {
        linkPathMapHelper.setDirectionOut(ldh, ldh.directionOut, ldh.linkKey)
        linkPathMapHelper.setDirectionIn(ldh, ldh.directionIn, ldh.linkKey)
        
        let link
        if (loh.A1) link = gridModel.getPosition(ldh.row2, ldh.col1)
        else if (loh.A0 || loh.A2) link = gridModel.getPosition(ldh.row1, ldh.col2)
        linkPathMapHelper.setCorner(link, ldh.linkKey)
    }
}

globalThis.linkPathMapConfigure = linkPathMapConfigure
export { linkPathMapConfigure }
