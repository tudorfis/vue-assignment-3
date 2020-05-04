
import { LinkDrawPathsBase } from '../LinkDrawPathsBase'

class LinkDrawPathsStraights extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawSameRowButUpOrDown() {
        let path, arrow

        // const { hasCellsOutSameRow } = this.lhObj
        const { svgDrawPath, svgDrawArrow } = this
        // const { directionOut, directionIn, getRightLeft } = this.lh
        const { directionIn, getRightLeft } = this.lh

        path = svgDrawPath.drawPath(this.lh.directionOut)
        
        // if (!hasCellsOutSameRow) 
            // path.svgD += svgDrawPath.drawHalf(directionOut)

        path.svgD += svgDrawPath.drawHalf(getRightLeft)
        path.svgD += svgDrawPath.drawLine(getRightLeft)
        path.svgD += svgDrawPath.drawHalf(getRightLeft)
        arrow = svgDrawArrow.drawArrow(path, directionIn)

        return [ path, arrow ]
    }
    drawSameColButLeftOrRight() {
        let path, arrow

        // const { hasCellsOutSameCol } = this.lhObj
        const { svgDrawPath, svgDrawArrow } = this
        // const { directionOut, directionIn, getDownUp } = this.lh
        const { directionIn, getDownUp } = this.lh

        path = svgDrawPath.drawPath(this.lh.directionOut)

        // if (!hasCellsOutSameCol) 
            // path.svgD += svgDrawPath.drawHalf(directionOut)

        path.svgD += svgDrawPath.drawHalf(getDownUp)
        path.svgD += svgDrawPath.drawLine(getDownUp)
        path.svgD += svgDrawPath.drawHalf(getDownUp)
        arrow = svgDrawArrow.drawArrow(path, directionIn)

        return [ path, arrow ]
    }
    drawSameRowOrColButStraightLine() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow } = this
        const { directionIn } = this.lh

        path = svgDrawPath.drawPath(directionIn)
        path.svgD += svgDrawPath.drawLine(directionIn)
        arrow = svgDrawArrow.drawArrow(path, directionIn)

        return [ path, arrow ]
    }
}

globalThis.LinkDrawPathsStraights = LinkDrawPathsStraights
export { LinkDrawPathsStraights }
