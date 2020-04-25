import { GridLinksIterator } from '../iterators/GridLinksIterator'
import { LinkDrawHelper } from './linkDraw.helper'
import linkEEMapHelper from './linkEEMap.helper'

const linkDirectionsHelper = {
    linkMap: {},
    resetLinkMap() {
        this.linkMap = {}
    },
    generateLinkDirections(ldh) {
        if (this.linkMap[ldh.linkKey])
            return this.linkMap[ldh.linkKey]

        let link1Direction, link2Direction

        const ldh2  = new LinkDrawHelper(ldh.linkKey, true)
        
        const pdir1 = ldh.potentialDirections
        const pdir2 = ldh2.potentialDirections

        if (!pdir1[1]) {
            this.linkMap[ldh.linkKey] = this.generateForSameRowCol(ldh)
            return this.linkMap[ldh.linkKey]
        }

        const coh = this.generateCellsOverlapHelper(ldh)
        
        /** link1Direction, link2Direction */
        if (!coh.isOut2 && !coh.isCorner2 && !coh.isIn2) {
            link1Direction = pdir1[1]
            link2Direction = (coh.isIn2) ? pdir2[0] : pdir2[1]
        }
        else if (coh.isOut2) {
            link1Direction = pdir1[0]
            link2Direction = (coh.isIn2) ? pdir2[0] : pdir2[1]
        }
        else if (!coh.isOut1 && !coh.isCorner1) {
            link1Direction = pdir1[0]
            link2Direction = (coh.isIn1) ? pdir2[0] : pdir2[1]
        }
        else if (coh.isOut1) {
            link1Direction = pdir1[1]
            link2Direction = (coh.isIn1) ? pdir2[1] : pdir2[0]
        }
        else {
            link1Direction = pdir1[0]
            link2Direction = pdir2[0]
        }

        if (coh.isCorner1 && coh.isCorner2 && !coh.isIn1 && !coh.isIn2 && !coh.isOut1 && !coh.isOut2) {
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
            switchLink2Direction() 
        }
        else if (coh.isCorner1 && coh.isCorner2 && coh.isOut1 && !coh.isOut2 && coh.isIn1 && !coh.isIn2) {
            console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
            switchLink2Direction() 
        }
        else if (coh.isCorner1 && coh.isCorner2 && coh.isOut1 && !coh.isOut2 && coh.isIn1 && coh.isIn2) {
            console.log('cccccccccccccccccccccccccccccccccc')
            switchLink2Direction() 
        }
        else if (coh.isCorner1 && !coh.isCorner2 && coh.isOut1 && !coh.isOut2 && coh.isIn1 && coh.isIn2) {
            console.log('ddddddddddddddddddddddd')
            switchLink2Direction() 
        }
        else if (!coh.isCorner1 && !coh.isCorner2 && coh.isOut1 && !coh.isOut2 && coh.isIn1 && coh.isIn2) {
            console.log('eeeeeeeeeeeeeeeeeeeee')
            switchLink2Direction() 
        }
        else {
            const isFreeWay = !coh.isOut1 && !coh.isCorner1 && !coh.isIn1

            if (coh.isEE2) {
                if (coh.isCorner2 && !coh.isOut2 && isFreeWay) {
                    console.log('111111111111111111')
                    switchLink2Direction() 
                }
                else if (coh.isOut2 && !coh.isIn2 && isFreeWay) {
                    console.log('222222222222')
                    switchLink2Direction() 
                }
                else if (!coh.isOut2 && !coh.isCorner2 && coh.isIn2 && isFreeWay) {
                    console.log('333333333333333333333')
                    switchLink2Direction() 
                }
                else if (coh.isIn2 && !coh.isOut1 && coh.isIn1) {
                    console.log('4444444444444444')
                    switchLink2Direction() 
                }
                
            }
            else {
                if (coh.isIn2 && !coh.isOut1 && coh.isCorner1) {
                    console.log('5555555555555555555')
                    switchLink2Direction() 
                }
                else if (coh.isOut2 && coh.isIn2 && !coh.isOut1 && (coh.isCorner1 || coh.isIn1)) {
                    console.log('666666666666666')
                    switchLink2Direction() 
                }
                else if (!coh.isOut1 && !coh.isOut2 && coh.isIn1 && (coh.isCorner2 || coh.isIn2)) {
                    console.log('77777777777777777777')
                    switchLink2Direction() 
                }
                else if (coh.isOut2 && coh.isCorner2 && coh.isIn2 && isFreeWay) {
                    console.log('888888888888888888888')
                    // switchLink2Direction()
                }
                else if ((coh.isOut2 || coh.isCorner2 || coh.isIn2) && isFreeWay) {
                    if (!(coh.isOut2 && !coh.isCorner2 && coh.isIn2)) {
                        console.log('999999999999999999999999')
                        switchLink2Direction() 
                    }
                }
            }
        }

        function switchLink2Direction() {
            if (link2Direction === pdir2[0])
                link2Direction = pdir2[1]

            else if (link2Direction === pdir2[1])
                link2Direction = pdir2[0]
        }

        // if (ldh.linkKey === '1-3__4-5') {
            // console.table(coh)
            // console.log(pdir1)
            // console.log(pdir2)
        // }

        this.linkMap[ldh.linkKey] = [ link1Direction, link2Direction, coh, pdir1, pdir2 ]
        return this.linkMap[ldh.linkKey]
    },
    /**
     *  these directions are used
     *  when an element is on the paths way
     * */
    generateForSameRowCol(ldh) {
        const ldh2 = new LinkDrawHelper(ldh.linkKey, true)
        
        const eeMap1 = linkEEMapHelper.eeMap[ldh.link1]
        const eeMap2 = linkEEMapHelper.eeMap[ldh2.link1]

        const pdir1 = ldh.potentialDirections
        const pdir2 = ldh2.potentialDirections

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
    generateCellsOverlapHelper(ldh) {
        const ldh2 = new LinkDrawHelper(ldh.linkKey, true)
        
        const eeMap1 = linkEEMapHelper.eeMap[ldh.link1]

        const pdir1 = ldh.potentialDirections
        const pdir2 = ldh2.potentialDirections

        let isEE2 = (eeMap1[pdir1[1]].total > 0 && eeMap1[pdir1[0]].total === eeMap1[pdir1[1]].total)
        isEE2 |= eeMap1[pdir1[0]].total > eeMap1[pdir1[1]].total

        return {
            isCorner1: GridLinksIterator.hasCellsCorner(ldh, pdir1[0]),
            isCorner2: GridLinksIterator.hasCellsCorner(ldh, pdir1[1]),
            isOut1: GridLinksIterator.hasCellsOut(ldh, pdir1[0]),
            isOut2: GridLinksIterator.hasCellsOut(ldh, pdir1[1]),
            isIn1: GridLinksIterator.hasCellsIn(ldh, LinkDrawHelper.oppositeDirection(pdir2[0])),
            isIn2: GridLinksIterator.hasCellsIn(ldh, LinkDrawHelper.oppositeDirection(pdir2[1])),
            isEE2
        }
        /*  
            link1       isOut2      isCorner2

            isOut1                  isIn2

            isCorner1   isIn1       link2
         */
    }
}

globalThis.linkDirectionsHelper = linkDirectionsHelper
export { linkDirectionsHelper }
