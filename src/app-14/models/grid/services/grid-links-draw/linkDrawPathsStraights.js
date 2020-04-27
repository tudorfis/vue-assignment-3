
import { LinkDrawPathsBase } from './LinkDrawPathsBase'

class LinkDrawPathsStraights extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawSameRowButUpOrDown() {
        let path, arrow
        const hasCellsOut = this.lhObj.hasCellsOutSameRow

        path = this.svgDrawPath.drawPath(this.lh.directionOut)
        
        if (!hasCellsOut) path.svgD += this.svgDrawPath.drawHalfOut(this.lh.directionOut, this.lh.getRightLeft)
        path.svgD += this.svgDrawPath.drawHalfIn(this.lh.getRightLeft, this.lh.directionOut)
        path.svgD += this.svgDrawPath.drawLine(this.lh.getRightLeft, 'full')
        path.svgD += this.svgDrawPath.drawHalfIn(this.lh.getRightLeft, this.lh.directionIn)
        if (!hasCellsOut) path.svgD += this.svgDrawPath.drawHalfOut(this.lh.directionIn, this.lh.getRightLeft)

        path.svgD += this.svgDrawPath.drawLine(this.lh.directionIn, 'arrow')
        arrow = this.svgDrawArrow.drawArrow(path.svgD, this.lh.directionIn)

        return [ path, arrow ]
    }
    drawSameColButLeftOrRight() {
        let path, arrow
        const hasCellsOut = this.lhObj.hasCellsOutSameCol

        path = this.svgDrawPath.drawPath(this.lh.directionOut)

        if (!hasCellsOut) path.svgD += this.svgDrawPath.drawHalfOut(this.lh.directionOut, this.lh.getDownUp)
        path.svgD += this.svgDrawPath.drawHalfIn(this.lh.getDownUp, this.lh.directionOut)
        path.svgD += this.svgDrawPath.drawLine(this.lh.getDownUp, 'full')
        path.svgD += this.svgDrawPath.drawHalfIn(this.lh.getDownUp, this.lh.directionIn)
        if (!hasCellsOut) path.svgD += this.svgDrawPath.drawHalfOut(this.lh.directionIn, this.lh.getDownUp)
        
        path.svgD += this.svgDrawPath.drawLine(this.lh.directionIn, 'arrow')
        arrow = this.svgDrawArrow.drawArrow(path.svgD, this.lh.directionIn)

        return [ path, arrow ]
    }
    drawSameRowOrColButStraightLine() {
        let path, arrow

        path = this.svgDrawPath.drawPath(this.lh.directionIn)
        path.svgD += this.svgDrawPath.drawLine(this.lh.directionIn, 'full')
        path.svgD += this.svgDrawPath.drawLine(this.lh.directionIn, 'arrow')
        arrow = this.svgDrawArrow.drawArrow(path.svgD, this.lh.directionIn)

        return [ path, arrow ]
    }
}

globalThis.LinkDrawPathsStraights = LinkDrawPathsStraights
export { LinkDrawPathsStraights }
