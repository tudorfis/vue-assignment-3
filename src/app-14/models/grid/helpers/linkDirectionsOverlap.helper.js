
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

   produceLinkDirections(pdir1, pdir2) {
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

globalThis.LinkDirectionsOverlapHelper = LinkDirectionsOverlapHelper
export { LinkDirectionsOverlapHelper }
