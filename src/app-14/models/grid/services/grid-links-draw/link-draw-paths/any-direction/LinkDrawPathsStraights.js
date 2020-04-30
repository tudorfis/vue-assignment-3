
import { LinkDrawPathsBase } from '../LinkDrawPathsBase'

class LinkDrawPathsStraights extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawSameRowButUpOrDown() {
        let path, arrow

        const { hasCellsOutSameRow } = this.lhObj
        const { svgDrawPath, svgDrawArrow } = this
        const { directionOut, directionIn, getRightLeft } = this.lh

        path = svgDrawPath.drawPath(this.lh.directionOut)
        
        if (!hasCellsOutSameRow) 
            path.svgD += svgDrawPath.drawHalfOut(directionOut, getRightLeft)

        path.svgD += svgDrawPath.drawHalfIn(getRightLeft, directionOut)
        path.svgD += svgDrawPath.drawLine(getRightLeft, 'full')
        path.svgD += svgDrawPath.drawHalfIn(getRightLeft, directionIn)
        
        if (!hasCellsOutSameRow)
            path.svgD += svgDrawPath.drawHalfOut(directionIn, getRightLeft)

        path.svgD += svgDrawPath.drawLine(directionIn, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, directionIn)

        return [ path, arrow ]
    }
    drawSameColButLeftOrRight() {
        let path, arrow

        const { hasCellsOutSameCol } = this.lhObj
        const { svgDrawPath, svgDrawArrow } = this
        const { directionOut, directionIn, getDownUp } = this.lh

        path = svgDrawPath.drawPath(this.lh.directionOut)

        if (!hasCellsOutSameCol) 
            path.svgD += svgDrawPath.drawHalfOut(directionOut, getDownUp)

        path.svgD += svgDrawPath.drawHalfIn(getDownUp, directionOut)
        path.svgD += svgDrawPath.drawLine(getDownUp, 'full')
        path.svgD += svgDrawPath.drawHalfIn(getDownUp, directionIn)

        if (!hasCellsOutSameCol)
            path.svgD += svgDrawPath.drawHalfOut(directionIn, getDownUp)
        
        path.svgD += svgDrawPath.drawLine(directionIn, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, directionIn)

        return [ path, arrow ]
    }
    drawSameRowOrColButStraightLine() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow } = this
        const { directionIn } = this.lh

        path = svgDrawPath.drawPath(directionIn)
        path.svgD += svgDrawPath.drawLine(directionIn, 'full')
        path.svgD += svgDrawPath.drawLine(directionIn, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, directionIn)

        return [ path, arrow ]
    }
}

globalThis.LinkDrawPathsStraights = LinkDrawPathsStraights
export { LinkDrawPathsStraights }
