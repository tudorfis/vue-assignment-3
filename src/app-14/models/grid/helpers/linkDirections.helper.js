import { GridLinksIterator } from '../iterators/GridLinksIterator'
import { LinkDrawHelper } from './linkDraw.helper'
import linkEEMapHelper from './linkEEMap.helper'
import { LinkDirectionsOverlapHelper } from './linkDirectionsOverlap.helper'

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
        const eeMap1 = linkEEMapHelper.eeMap[ldh.link1]
        const eeMap2 = linkEEMapHelper.eeMap[ldh.link2]
        const pdir1 = ldh.potentialDirections

        if (!GridLinksIterator.hasCellsOut(ldh, pdir1[0]))
            return [ pdir1[0], LinkDrawHelper.oppositeDirection(pdir1[0]) ]

        let direction = ''

        if (LinkDrawHelper.upOrDown(pdir1[0])) {
            if (eeMap1.left.total === eeMap1.right.total) {

                if (eeMap2.left.total === eeMap2.right.total) direction = 'right'
                else if (eeMap2.left.total > eeMap2.right.total) direction = 'right'
                else if (eeMap2.left.total < eeMap2.right.total) direction = 'left'
            }
            else if (eeMap1.left.total > eeMap1.right.total) direction = 'right'
            else if (eeMap1.left.total < eeMap1.right.total) direction = 'left'
        }
        else if (LinkDrawHelper.leftOrRight(pdir1[0])) {
            if (eeMap1.up.total === eeMap1.down.total) {

                if (eeMap2.up.total === eeMap2.down.total) direction = 'down'
                else if (eeMap2.up.total > eeMap2.down.total) direction = 'down'
                else if (eeMap2.up.total < eeMap2.down.total) direction = 'up'
            }
            else if (eeMap1.up.total > eeMap1.down.total) direction = 'down'
            else if (eeMap1.up.total < eeMap1.down.total) direction = 'up'
        }

        return [ direction, direction ]
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
