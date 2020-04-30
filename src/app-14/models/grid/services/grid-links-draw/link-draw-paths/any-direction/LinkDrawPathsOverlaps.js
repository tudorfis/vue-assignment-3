
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
        path.svgD += svgDrawPath.drawHalfOut(directionIn, directionOut)
        path.svgD += svgDrawPath.drawLine(directionIn, 'full')
        path.svgD += svgDrawPath.drawLine(directionOut, 'full')
        path.svgD += svgDrawPath.drawHalfIn(directionOut, directionIn)

        path.svgD += svgDrawPath.drawLine(directionIn, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, directionIn)

        return [ path, arrow ]
    }
    drawOverlapsPatternC() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow } = this
        const { directionOut, directionIn } = this.lh

        const pdir = this.lh.potentialDirections
        const helperDirection = (directionOut === pdir[0]) ? pdir[1] : pdir[0]

        path = svgDrawPath.drawPath(directionOut)
        path.svgD += svgDrawPath.drawLine(directionOut, 'full')
        path.svgD += svgDrawPath.drawHalfOut(helperDirection, directionIn)
        path.svgD += svgDrawPath.drawLine(helperDirection, 'full')
        path.svgD += svgDrawPath.drawHalfIn(helperDirection, directionOut)

        path.svgD += svgDrawPath.drawLine(directionIn, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, directionIn)

        return [ path, arrow ]
    }
    drawOverlapsPatternB() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow } = this
        const { directionOut, directionIn } = this.lh

        const pdir = this.lh.potentialDirections
        const helperDirection = (directionOut === pdir[0]) ? pdir[1] : pdir[0]

        path = svgDrawPath.drawPath(directionOut)
        path.svgD += svgDrawPath.drawHalfOut(helperDirection, directionOut)
        path.svgD += svgDrawPath.drawLine(helperDirection, 'full')
        path.svgD += svgDrawPath.drawHalfIn(helperDirection, directionIn)
        path.svgD += svgDrawPath.drawLine(directionIn, 'full')

        path.svgD += svgDrawPath.drawLine(directionIn, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, directionIn)

        return [ path, arrow ]
    }
    drawOverlapsPatternA() {
        let path, arrow

        const { svgDrawPath, svgDrawArrow } = this
        const { directionOut, directionIn } = this.lh

        path = svgDrawPath.drawPath(directionOut)
        path.svgD += svgDrawPath.drawLine(directionOut, 'full')
        path.svgD += svgDrawPath.drawHalfOut(directionOut, directionIn)
        path.svgD += svgDrawPath.drawHalfIn(directionIn, directionOut)
        path.svgD += svgDrawPath.drawLine(directionIn, 'full')

        path.svgD += svgDrawPath.drawLine(directionIn, 'arrow')
        arrow = svgDrawArrow.drawArrow(path.svgD, directionIn)

        return [ path, arrow ]
    }
}

globalThis.LinkDrawPathsOverlaps = LinkDrawPathsOverlaps
export { LinkDrawPathsOverlaps }
