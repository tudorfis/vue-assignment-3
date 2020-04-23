import { GridLinksIterator } from '../iterators/GridLinksIterator'
import { LinkDrawHelper } from './linkDraw.helper'
import linkEEMapHelper from './linkEEMap.helper'

const linkDirectionsHelper = {
    getLinkDirections(ldh, ldh2) {
        let link1Direction, link2Direction

        const eeMap1 = linkEEMapHelper.eeMap[ldh.link1]
        const eeMap2 = linkEEMapHelper.eeMap[ldh2.link1]

        const pdir1 = ldh.potentialDirections
        const pdir2 = ldh2.potentialDirections

        if (!pdir1[1]) return eeSameRowCol()
        function eeSameRowCol() {
            if (!GridLinksIterator.hasCellsOut(ldh, pdir1[0]))
                return [pdir1[0], LinkDrawHelper.oppositeDirection(pdir1[0])]

            if (LinkDrawHelper.upOrDown(pdir1[0])) {
                if (eeMap1.left.total === eeMap1.right.total) {

                    if (eeMap2.left.total === eeMap2.right.total) pdir1[1] = 'right'
                    else if (eeMap2.left.total > eeMap2.right.total) pdir1[1] = 'right'
                    else if (eeMap2.left.total < eeMap2.right.total) pdir1[1] = 'left'
                }
                else if (eeMap1.left.total > eeMap1.right.total) pdir1[1] = 'right'
                else if (eeMap1.left.total < eeMap1.right.total) pdir1[1] = 'left'
            }
            else if (LinkDrawHelper.leftOrRight(pdir1[0])) {
                if (eeMap1.up.total === eeMap1.down.total) {

                    if (eeMap2.up.total === eeMap2.down.total) pdir1[1] = 'down'
                    else if (eeMap2.up.total > eeMap2.down.total) pdir1[1] = 'down'
                    else if (eeMap2.up.total < eeMap2.down.total) pdir1[1] = 'up'
                }
                else if (eeMap1.up.total > eeMap1.down.total) pdir1[1] = 'down'
                else if (eeMap1.up.total < eeMap1.down.total) pdir1[1] = 'up'
            }

            return [pdir1[1], pdir1[1]]
        }

        let pickAnyEE1, pickAnyEE2
        eeNotEqual()
        function eeNotEqual() {
            pickAnyEE1 = eeMap1[pdir1[0]].total === eeMap1[pdir1[1]].total
            pickAnyEE2 = eeMap2[pdir2[0]].total === eeMap2[pdir2[1]].total

            if (!pickAnyEE1) {
                if (eeMap1[pdir1[1]].total > eeMap1[pdir1[0]].total) link1Direction = pdir1[0]
                else if (eeMap1[pdir1[0]].total > eeMap1[pdir1[1]].total) link1Direction = pdir1[1]
            }
            if (!pickAnyEE2) {
                if (eeMap2[pdir2[1]].total > eeMap2[pdir2[0]].total) link2Direction = pdir2[0]
                else if (eeMap2[pdir2[0]].total > eeMap2[pdir2[1]].total) link2Direction = pdir2[1]
            }

            const hasCellsOut = GridLinksIterator.hasCellsOut(ldh, link1Direction)
            const hasCellsCorner = GridLinksIterator.hasCellsCorner(ldh, link1Direction)

            if (hasCellsOut || hasCellsCorner)
                if (link1Direction === pdir1[0]) link1Direction = pdir1[1]
                else if (link1Direction === pdir1[1]) link1Direction = pdir1[0]
        }

        let changedEE1 = false, changedEE2 = false
        eeEqual()
        function eeEqual() {
            if (pickAnyEE1) {
                if (!link2Direction)
                    link2Direction = !eeMap2[pdir2[0]].in[ldh.link1] ? pdir2[0] : pdir2[1]
    
                if (LinkDrawHelper.upOrDown(link2Direction)) {
                    link1Direction = ldh.rightLeft
                    changedEE1 = true
                }
                else if (LinkDrawHelper.leftOrRight(link2Direction)) {
                    link1Direction = ldh.upDown
                    changedEE1 = true
                }

                switchDirectionsForMinimumCorners()
            }
    
            if (pickAnyEE2 && !changedEE1) {
                if (!link1Direction)
                    link1Direction = !eeMap1[pdir1[0]].out[ldh2.link1] ? pdir1[0] : pdir1[1]
    
                if (LinkDrawHelper.upOrDown(link1Direction)) {
                    link2Direction = ldh2.rightLeft
                    changedEE2 = true
                }
                else if (LinkDrawHelper.leftOrRight(link1Direction)) {
                    link2Direction = ldh2.upDown
                    changedEE2 = true
                }

                switchDirectionsForMinimumCorners()
            }

            function switchDirectionsForMinimumCorners() {
                const hasCellsOut = GridLinksIterator.hasCellsOut(ldh, link1Direction)
                const hasCellsIn = GridLinksIterator.hasCellsIn(ldh, LinkDrawHelper.oppositeDirection(link2Direction))
                const hasCellsCorner = GridLinksIterator.hasCellsCorner(ldh, link1Direction)
     
                if (hasCellsIn || hasCellsCorner || hasCellsOut) {
                    if (link2Direction === pdir2[0]) link2Direction = pdir2[1]
                    else if (link2Direction === pdir2[1]) link2Direction = pdir2[0]
    
                    if (link1Direction === pdir1[0]) link1Direction = pdir1[1]
                    else if (link1Direction === pdir1[1]) link1Direction = pdir1[0]
                }
            }
        }
        
        eeNotChangedLink1()
        function eeNotChangedLink1() {
            if (!changedEE1 && changedEE2) {
                if (LinkDrawHelper.upOrDown(link2Direction)) link1Direction = ldh.rightLeft
                else if (LinkDrawHelper.leftOrRight(link2Direction)) link1Direction = ldh.upDown
            }
        }
        
        eeHasCellsOutOrCorner()
        function eeHasCellsOutOrCorner() {
            const hasCellsOut = GridLinksIterator.hasCellsOut(ldh, link1Direction)
            const hasCellsCorner = GridLinksIterator.hasCellsCorner(ldh, link1Direction)
    
            if (eeMap1[link1Direction].total !== 0 && (hasCellsOut || hasCellsCorner)) {
                if (LinkDrawHelper.upOrDown(link1Direction)) {
                    link1Direction = ldh.rightLeft
    
                    if (LinkDrawHelper.leftOrRight(link2Direction))
                        link2Direction = ldh2.upDown
                }
                else if (LinkDrawHelper.leftOrRight(link1Direction)) {
                    link1Direction = ldh.upDown
    
                    if (LinkDrawHelper.upOrDown(link2Direction))
                        link2Direction = ldh2.rightLeft
                }
            }
        }
        
        eeNotChangedLink2()
        function eeNotChangedLink2() {
            if (!link2Direction)
                link2Direction = LinkDrawHelper.oppositeDirection(link1Direction)
        }
        
        return [ link1Direction, link2Direction ]
    }
}

export { linkDirectionsHelper }

