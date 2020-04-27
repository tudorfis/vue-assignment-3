import { LinkDirectionsCellVerifier } from './LinkDirectionsCellVerifier'
import { LinkHelper } from '../link.helper'
import linkEEMapHelper from '../link-ee/linkEEMap.helper'
import { LinkDirectionsOverlapHelper } from './linkDirectionsOverlap.helper'
import { LinkDirectionsGenerator } from './LinkDirectionsGenerator'

let linkDirectionsMap = {}

const linkDirectionsHelper = {
    resetLinkMap() {
        linkDirectionsMap = {}
    },
    generateLinkDirectionsMap(lh) {
        const pdir1 = lh.potentialDirections

        if (!pdir1[1]) {
            const generator = new LinkDirectionsGenerator(lh)
            const linkDirections = generator.generateDirectionsWhenSameRowCol(lh)
            
            this.setLinkDirectionsMap(lh, {
                link1Direction: linkDirections[0],
                link2Direction: linkDirections[1]
            })
            return
        }
        
        const linkOverlapHelper = this.createLinkDirectionsOverlapHelper(lh)
        const lh2  = new LinkHelper(lh.linkKey, true)
        const pdir2 = lh2.potentialDirections
        
        const linkDirections = linkOverlapHelper.produceLinkDirections(pdir1, pdir2)
        
        this.setLinkDirectionsMap(lh, {
            link1Direction: linkDirections[0],
            link2Direction: linkDirections[1],
            linkOverlapHelper
        })
    },
    setLinkDirectionsMap(lh, query) {
        linkDirectionsMap[lh.linkKey] = {
            link1Direction: query.link1Direction,
            link2Direction: query.link2Direction,
            linkOverlapHelper: query.linkOverlapHelper
        }
    },
    getLinkDirections(lh) {
        const ldm = linkDirectionsMap[lh.linkKey]
        return [ ldm.link1Direction, ldm.link2Direction ]
    },
    getLinkDirectionsOverlapHelper(lh) {
        return linkDirectionsMap[lh.linkKey].linkOverlapHelper
    },
    /**
     *  this helper is used to generate 
     *  the most optimum path for a link
     *  with least amount of corners, used when not straight lines
     * */
    createLinkDirectionsOverlapHelper(lh) {
        const lh2 = new LinkHelper(lh.linkKey, true)
        
        const eeMap1 = linkEEMapHelper.eeMap[lh.link1]

        const pdir1 = lh.potentialDirections
        const pdir2 = lh2.potentialDirections

        let isEE2 = (eeMap1[pdir1[1]].total > 0 && eeMap1[pdir1[0]].total === eeMap1[pdir1[1]].total)
        isEE2 |= eeMap1[pdir1[0]].total > eeMap1[pdir1[1]].total

        return  new LinkDirectionsOverlapHelper({
            isCorner1: LinkDirectionsCellVerifier.hasCellsCorner(lh, pdir1[0]),
            isCorner2: LinkDirectionsCellVerifier.hasCellsCorner(lh, pdir1[1]),
            isOut1: LinkDirectionsCellVerifier.hasCellsOut(lh, pdir1[0]),
            isOut2: LinkDirectionsCellVerifier.hasCellsOut(lh, pdir1[1]),
            isIn1: LinkDirectionsCellVerifier.hasCellsIn(lh, LinkHelper.getOpositeDirection(pdir2[0])),
            isIn2: LinkDirectionsCellVerifier.hasCellsIn(lh, LinkHelper.getOpositeDirection(pdir2[1])),
            isEE2
        })
        
    }
}

globalThis.linkDirectionsHelper = linkDirectionsHelper

export { 
    linkDirectionsHelper,
    linkDirectionsMap
}
