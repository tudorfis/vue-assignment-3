
import { LinkDrawPathsBase } from '../LinkDrawPathsBase'

class LinkDrawPathsOverlaps extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawOverlapsPatternD() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow } = this
        const { directionOut, directionIn } = this.lh

        path = svgDrawPath.drawPath(directionOut)
        path.svgD += svgDrawPath.drawHalf(directionIn)
        path.svgD += svgDrawPath.drawLine(directionIn)
        path.svgD += svgDrawPath.drawLine(directionOut)
        path.svgD += svgDrawPath.drawHalf(directionOut)
        arrow = svgDrawArrow.drawArrow(path, directionIn)

        return [ path, arrow ]
    }
    drawOverlapsPatternC() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow } = this
        const { directionOut, directionIn } = this.lh

        const pdir = this.lh.potentialDirections
        const helperDirection = (directionOut === pdir[0]) ? pdir[1] : pdir[0]

        path = svgDrawPath.drawPath(directionOut)
        path.svgD += svgDrawPath.drawLine(directionOut)
        path.svgD += svgDrawPath.drawHalf(helperDirection)
        path.svgD += svgDrawPath.drawLine(helperDirection)
        path.svgD += svgDrawPath.drawHalf(helperDirection)
        arrow = svgDrawArrow.drawArrow(path, directionIn)

        return [ path, arrow ]
    }
    drawOverlapsPatternB() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow } = this
        const { directionOut, directionIn } = this.lh

        const pdir = this.lh.potentialDirections
        const helperDirection = (directionOut === pdir[0]) ? pdir[1] : pdir[0]

        path = svgDrawPath.drawPath(directionOut)
        path.svgD += svgDrawPath.drawHalf(helperDirection)
        path.svgD += svgDrawPath.drawLine(helperDirection)
        path.svgD += svgDrawPath.drawHalf(helperDirection)
        path.svgD += svgDrawPath.drawLine(directionIn)
        arrow = svgDrawArrow.drawArrow(path, directionIn)

        return [ path, arrow ]
    }
    drawOverlapsPatternA() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow } = this
        const { directionOut, directionIn } = this.lh

        path = svgDrawPath.drawPath(directionOut)
        path.svgD += svgDrawPath.drawLine(directionOut)
        path.svgD += svgDrawPath.drawHalf(directionOut)
        path.svgD += svgDrawPath.drawHalf(directionIn)
        path.svgD += svgDrawPath.drawLine(directionIn)
        arrow = svgDrawArrow.drawArrow(path, directionIn)

        return [ path, arrow ]
    }
}

globalThis.LinkDrawPathsOverlaps = LinkDrawPathsOverlaps
export { LinkDrawPathsOverlaps }
