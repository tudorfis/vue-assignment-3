import { GridLinksIterator } from '../iterators/GridLinksIterator'
import { LinkDrawHelper } from './linkDraw.helper'
import linkEEMapHelper from './linkEEMap.helper'

const linkDirectionsHelper = {
    linkMap: {},
    resetLinkMap() {
        this.linkDirectionsMap = {}
    },
    generateLinkDirections(ldh) {
        if (this.linkDirectionsMap[ldh.linkKey])
            return this.linkDirectionsMap[ldh.linkKey]
            
        const pdir1 = ldh.potentialDirections

        if (!pdir1[1]) {
            this.linkDirectionsMap[ldh.linkKey] = this.generateForSameRowCol(ldh)
            return this.linkDirectionsMap[ldh.linkKey]
        }

        const coh = this.generateLinkDirectionsOverlapHelper(ldh)

        const ldh2  = new LinkDrawHelper(ldh.linkKey, true)
        const pdir2 = ldh2.potentialDirections

        const linkDirections = coh.generateLinkDirections(pdir1, pdir2)
        this.linkDirectionsMap[ldh.linkKey] = [ linkDirections[0], linkDirections[1], coh]

        return this.linkDirectionsMap[ldh.linkKey]
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
    generateLinkDirectionsOverlapHelper(ldh) {
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

class LinkDirectionsOverlapHelper {
    constructor(query) {
        this.isCorner1 = query.isCorner1
        this.isCorner2 = query.isCorner2
        this.isOut1 = query.isOut1
        this.isOut2 = query.isOut2
        this.isIn1 = query.isIn1
        this.isIn2 = query.isIn2
        this.isEE2 = query.isEE2
    }
    /*  
        [ link1 ]       [ isOut2 ]     [ isCorner2 ]

        [ isOut1 ]                     [ isIn2 ]

        [ isCorner1 ]   [ isIn1 ]      [ link2 ]
    */

    generateLinkDirections(pdir1, pdir2) {
             if (this.D1) return [ pdir1[0], pdir2[0] ]
        else if (this.D2) return [ pdir1[1], pdir2[1] ]
        else if (this.C1) return [ pdir1[1], pdir2[0] ]
        else if (this.C2) return [ pdir1[0], pdir2[1] ]
        else if (this.B1) return [ pdir1[0], pdir2[1] ]
        else if (this.B2) return [ pdir1[1], pdir2[0] ]

        else if (this.A2) return [ pdir1[1], pdir2[1] ]
        else if (this.A1) return [ pdir1[0], pdir2[0] ]
        else if (this.A0) return [ pdir1[1], pdir2[1] ]
    }
    get A0() {
        return (!this.o2 && !this.c2 && !this.i2)
        /* [ ]___
                 |
                [ ] */
    }
    get A1() {
        return !this.o1 && !this.c1 && !this.i1
        /* [ ]
            |___[ ] */
    }
    get A2() {
        return this.ee2 && (!this.o2 && !this.c2 && !this.i2)
        /* [ ]___
                 |
                [ ] */
    }

    get B1() {
        return ((this.o1 || this.c1 || this.i1) && !this.i2) &&
            ((this.o2 || this.c2))
        /* [ ]_
               |____[ ] */
    }
    get B2() {
        return ((this.o2 || this.c2 || this.i2) && !this.i1) &&
            ((this.o1 || this.c1))
        /* [ ]
            |______
                   |
                  [ ] */
    }
    get C1() {
        return (this.i1 && this.i2) && this.ee2
        /* [ ]____
                  |
                  |_[ ] */
    }
    get C2() {
        return (this.i1 && this.i2) && !this.ee2
        /* [ ]
            |
            |________
                     |
                    [ ] */
    }
    get D1() {
        return ( 
            ((this.o1 || this.c1) || (this.o2 || this.c2))
            && (this.i1 && this.i2)
        ) && !this.ee2
        /* [ ]_
               |____
                    |
                   [ ] */
    }
    get D2() {
        return (
            ((this.o1 || this.c1) || (this.o2 || this.c2))
            && (this.i1 && this.i2)
        ) && this.ee2
        /* [ ]
            |____    
                 |__[ ] */
    }

    get c1() {
        return this.isCorner1
    }
    get c2() {
        return this.isCorner2
    }
    get o1() {
        return this.isOut1
    }
    get o2() {
        return this.isOut2
    }
    get i1() {
        return this.isIn1
    }
    get i2() {
        return this.isIn2
    }
    get ee2() {
        return this.isEE2
    }
}

globalThis.linkDirectionsHelper = linkDirectionsHelper
export { linkDirectionsHelper }
