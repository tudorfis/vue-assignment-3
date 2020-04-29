import { gridModel } from '../../grid.model'
import linkEEMapHelper from '../link-ee/linkEEMap.helper'
import { LinkHelper } from '../link.helper'
import { LinkCellCornerVerifier } from './cell-verifiers/LinkCellCornerVerifier'
import { LinkCellInVerifier } from './cell-verifiers/LinkCellInVerifier'
import { LinkCellOrientationVerifier } from './cell-verifiers/LinkCellOrientationVerifier'
import { LinkCellOutVerifier } from './cell-verifiers/LinkCellOutVerifier'
import { LinkDirectionsGenerator } from './LinkDirectionsGenerator'
import { LinkDirectionsMap } from './LinkDirectionsMap'
import { LinkOverlapHelper } from './LinkOverlapHelper'
import { LinkOverlapOutsideHelper } from './LinkOverlapOutsideHelper'

let linkDirectionsMap = {}

const linkDirectionsHelper = {
    resetLinkMap() {
        linkDirectionsMap = {}
    },
    generateLinkDirectionsMap(lh) {
        const pdir1 = lh.potentialDirections

        const linkOverlapOutsideHelper = this.createLinkOverlapOutsideHelper(lh)
        const forcedDirectionsObj = this.createForcedDirections(lh)
        const linkOverlapHelper = this.createLinkOverlapHelper(lh)
        const linkDirectionsObj = linkOverlapHelper.produceLinkDirections(lh)

        if (!pdir1[1]) {
            const generator = new LinkDirectionsGenerator(lh)
            
            this.setLinkDirectionsMap(lh, {
                linkOverlapHelper,
                linkOverlapOutsideHelper,
                ...generator.generateDirectionsWhenSameRowCol(lh),
                ...forcedDirectionsObj
            })
        }
        else {
            this.setLinkDirectionsMap(lh, { 
                linkOverlapHelper,
                linkOverlapOutsideHelper,
                ...linkDirectionsObj,
                ...forcedDirectionsObj
            })
        }
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
    },
    createLinkOverlapOutsideHelper(lh) {

        return new LinkOverlapOutsideHelper({
            isUpLeftCorner: LinkCellCornerVerifier.hasCellsCornerOutside(lh, 'upLeft'),
            isUpRightCorner: LinkCellCornerVerifier.hasCellsCornerOutside(lh, 'upRight'),
            isDownLeftCorner: LinkCellCornerVerifier.hasCellsCornerOutside(lh, 'downLeft'),
            isDownRightCorner: LinkCellCornerVerifier.hasCellsCornerOutside(lh, 'downRight'),

            isUpCells: LinkCellOrientationVerifier.hasCellsOrientation(lh, 'up'),
            isRightCells: LinkCellOrientationVerifier.hasCellsOrientation(lh, 'right'),
            isLeftCells: LinkCellOrientationVerifier.hasCellsOrientation(lh, 'left'),
            isDownCells: LinkCellOrientationVerifier.hasCellsOrientation(lh, 'down'),

            isUpCellsAfter: LinkCellOrientationVerifier.hasCellsOrientation(lh, 'upAfter'),
            isRightCellsAfter: LinkCellOrientationVerifier.hasCellsOrientation(lh, 'rightAfter'),
            isLeftCellsAfter: LinkCellOrientationVerifier.hasCellsOrientation(lh, 'leftAfter'),
            isDownCellsAfter: LinkCellOrientationVerifier.hasCellsOrientation(lh, 'downAfter'),
        })
    }

}

globalThis.linkDirectionsMap = linkDirectionsMap
globalThis.linkDirectionsHelper = linkDirectionsHelper

export { linkDirectionsHelper, linkDirectionsMap }
