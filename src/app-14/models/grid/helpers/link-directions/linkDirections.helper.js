import { gridModel } from '../../grid.model'
import linkEEMapHelper from '../link-ee/linkEEMap.helper'
import { LinkHelper } from '../link.helper'
import { LinkCellCornerVerifier } from './cell-verifiers/LinkCellCornerVerifier'
import { LinkCellInVerifier } from './cell-verifiers/LinkCellInVerifier'
import { LinkCellOutVerifier } from './cell-verifiers/LinkCellOutVerifier'
import { LinkDirectionsMap } from './LinkDirectionsMap'
import { LinkOverlapHelper } from './LinkOverlapHelper'
import { LinkKeyIterator } from '../../iterators/LinkKeyIterator'

let linkDirectionsMap = {}

const linkDirectionsHelper = {
    buildLinkDirectionsMap() {
        this.linkDirectionsMap = {}

        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            const lh = new LinkHelper(lki.linkKey)
            linkDirectionsHelper.generateLinkDirectionsMap(lh)
        }

    },
    generateLinkDirectionsMap(lh) {
        const pdir1 = lh.potentialDirections

        const forcedDirectionsObj = this.createForcedDirections(lh)
        const linkOverlapHelper = this.createLinkOverlapHelper(lh)
        let linkDirectionsObj = linkOverlapHelper.produceLinkDirections(lh)

        if (!pdir1[1]) {
            if (!LinkCellOutVerifier.hasCellsOut(lh, pdir1[0]))
                linkDirectionsObj = { link1Direction: pdir1[0], link2Direction: LinkHelper.getOpositeDirection(pdir1[0])  }
    
            else if (LinkHelper.isUpOrDown(pdir1[0]))
                linkDirectionsObj = { link1Direction: 'right', link2Direction: 'right' }

            else if (LinkHelper.isLeftOrRight(pdir1[0]))
                linkDirectionsObj = { link1Direction: 'down', link2Direction: 'down' }
        }

        this.setLinkDirectionsMap(lh, {
            linkOverlapHelper,
            ...linkDirectionsObj,
            ...forcedDirectionsObj
        })
    },
    setLinkDirectionsMap(lh, query) {
        linkDirectionsMap[lh.linkKey] = new LinkDirectionsMap(query) 
    },
    getLinkDirectionsMap(lh) {
        return linkDirectionsMap[lh.linkKey]
    },
    getLinkDirections(lh) {
        const { link1Direction, link2Direction } = linkDirectionsMap[lh.linkKey]
        return [ link1Direction, link2Direction ]
    },
    getForcedLinkDirections(lh) {
        const { forcedOutDirection, forcedInDirection } = linkDirectionsMap[lh.linkKey]
        return [ forcedOutDirection, forcedInDirection ]
    },
    getLinkDirectionsOverlapHelper(lh) {
        return linkDirectionsMap[lh.linkKey].linkOverlapHelper
    },
    createForcedDirections(lh) {
        const forcedDirectionsObj = {}
        const linkAttributes = gridModel.model.linkAttributes[lh.linkKey]

        if (linkAttributes && linkAttributes.outDirection)
            forcedDirectionsObj.forcedOutDirection = linkAttributes.outDirection
            
        if (linkAttributes && linkAttributes.inDirection)
            forcedDirectionsObj.forcedInDirection = linkAttributes.inDirection

        return forcedDirectionsObj
    },
    /**
     *  this helper is used to generate 
     *  the most optimum path for a link
     *  with least amount of corners, used when not straight lines
     * */
    createLinkOverlapHelper(lh) {
        const lh2 = new LinkHelper(lh.linkKey, true)
        
        const eeMap1 = linkEEMapHelper.eeMap[lh.link1]

        const pdir1 = lh.potentialDirections
        const pdir2 = lh2.potentialDirections


        let isEE2 = false

        if (!lh.isSameRowCol) {
            isEE2 = (eeMap1[pdir1[1]].total > 0 && eeMap1[pdir1[0]].total === eeMap1[pdir1[1]].total)
            isEE2 |= eeMap1[pdir1[0]].total > eeMap1[pdir1[1]].total
        }

        return new LinkOverlapHelper({
            isCorner1: LinkCellCornerVerifier.hasCellsCorner(lh, pdir1[0]),
            isCorner2: LinkCellCornerVerifier.hasCellsCorner(lh, pdir1[1]),
            isOut1: LinkCellOutVerifier.hasCellsOut(lh, pdir1[0]),
            isOut2: LinkCellOutVerifier.hasCellsOut(lh, pdir1[1]),
            isIn1: LinkCellInVerifier.hasCellsIn(lh, LinkHelper.getOpositeDirection(pdir2[0])),
            isIn2: LinkCellInVerifier.hasCellsIn(lh, LinkHelper.getOpositeDirection(pdir2[1])),
            isEE2
        })
    }
}

globalThis.linkDirectionsMap = linkDirectionsMap
globalThis.linkDirectionsHelper = linkDirectionsHelper

export { linkDirectionsHelper, linkDirectionsMap }
