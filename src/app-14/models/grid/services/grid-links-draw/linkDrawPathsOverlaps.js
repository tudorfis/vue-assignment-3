
import { LinkDrawPathsBase } from './LinkDrawPathsBase'

class LinkDrawPathsOverlaps extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawLinkPathOverlapsPatternD() {
        let path, arrow

        path = this.svgDrawPath.drawPath(this.lh.directionOut)
        path.svgD += this.svgDrawPath.drawHalfOut(this.lh.directionIn, this.lh.directionOut)
        path.svgD += this.svgDrawPath.drawLine(this.lh.directionIn, 'full')
        path.svgD += this.svgDrawPath.drawLine(this.lh.directionOut, 'full')
        path.svgD += this.svgDrawPath.drawHalfIn(this.lh.directionOut, this.lh.directionIn)

        path.svgD += this.svgDrawPath.drawLine(this.lh.directionIn, 'arrow')
        arrow = this.svgDrawArrow.drawArrow(path.svgD, this.lh.directionIn)

        return [ path, arrow ]
    }
    drawLinkPathOverlapsPatternC() {
        let path, arrow
        path = this.svgDrawPath.drawPath(this.lh.directionOut)

        const pdir1 = this.lh.potentialDirections
        const helperDirection = (this.lh.directionOut === pdir1[0]) ? pdir1[1] : pdir1[0]

        path.svgD += this.svgDrawPath.drawLine(this.lh.directionOut, 'full')
        path.svgD += this.svgDrawPath.drawHalfOut(helperDirection, this.lh.directionIn)
        path.svgD += this.svgDrawPath.drawLine(helperDirection, 'full')
        path.svgD += this.svgDrawPath.drawHalfIn(helperDirection, this.lh.directionOut)
        
        path.svgD += this.svgDrawPath.drawLine(this.lh.directionIn, 'arrow')
        arrow = this.svgDrawArrow.drawArrow(path.svgD, this.lh.directionIn)

        return [ path, arrow ]
    }
    drawLinkPathOverlapsPatternB() {
        let path, arrow
        path = this.svgDrawPath.drawPath(this.lh.directionOut)

        const pdir1 = this.lh.potentialDirections
        const helperDirection = (this.lh.directionOut === pdir1[0]) ? pdir1[1] : pdir1[0]
        
        path.svgD += this.svgDrawPath.drawHalfOut(helperDirection, this.lh.directionOut)
        path.svgD += this.svgDrawPath.drawLine(helperDirection, 'full')
        path.svgD += this.svgDrawPath.drawHalfIn(helperDirection, this.lh.directionIn)
        path.svgD += this.svgDrawPath.drawLine(this.lh.directionIn, 'full')

        path.svgD += this.svgDrawPath.drawLine(this.lh.directionIn, 'arrow')
        arrow = this.svgDrawArrow.drawArrow(path.svgD, this.lh.directionIn)

        return [ path, arrow ]
    }
    drawLinkPathOverlapsPatternA() {
        let path, arrow
        path = this.svgDrawPath.drawPath(this.lh.directionOut)

        path.svgD += this.svgDrawPath.drawLine(this.lh.directionOut, 'full')
        path.svgD += this.svgDrawPath.drawHalfOut(this.lh.directionOut, this.lh.directionIn)
        path.svgD += this.svgDrawPath.drawHalfIn(this.lh.directionIn, this.lh.directionOut)
        path.svgD += this.svgDrawPath.drawLine(this.lh.directionIn, 'full')

        path.svgD += this.svgDrawPath.drawLine(this.lh.directionIn, 'arrow')
        arrow = this.svgDrawArrow.drawArrow(path.svgD, this.lh.directionIn)

        return [ path, arrow ]
    }
}

globalThis.LinkDrawPathsOverlaps = LinkDrawPathsOverlaps
export { LinkDrawPathsOverlaps }
