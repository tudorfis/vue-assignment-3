
const linkDrawPathsOverlaps = {
    drawLinkPathOverlapsPatternD(ldh) {
        let path, arrow
        path = ldh.drawPath(ldh.directionOut)

        path.svgD += ldh.drawHalfOut(ldh.directionIn, ldh.directionOut)
        path.svgD += ldh.drawLine(ldh.directionIn, 'full')
        path.svgD += ldh.drawLine(ldh.directionOut, 'full')
        path.svgD += ldh.drawHalfIn(ldh.directionOut, ldh.directionIn)

        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    },
    drawLinkPathOverlapsPatternC(ldh) {
        let path, arrow
        path = ldh.drawPath(ldh.directionOut)

        const pdir1 = ldh.potentialDirections
        const helperDirection = (ldh.directionOut === pdir1[0]) ? pdir1[1] : pdir1[0]

        path.svgD += ldh.drawLine(ldh.directionOut, 'full')
        path.svgD += ldh.drawHalfOut(helperDirection, ldh.directionIn)
        path.svgD += ldh.drawLine(helperDirection, 'full')
        path.svgD += ldh.drawHalfIn(helperDirection, ldh.directionOut)
        
        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    },
    drawLinkPathOverlapsPatternB(ldh) {
        let path, arrow
        path = ldh.drawPath(ldh.directionOut)

        const pdir1 = ldh.potentialDirections
        const helperDirection = (ldh.directionOut === pdir1[0]) ? pdir1[1] : pdir1[0]
        
        path.svgD += ldh.drawHalfOut(helperDirection, ldh.directionOut)
        path.svgD += ldh.drawLine(helperDirection, 'full')
        path.svgD += ldh.drawHalfIn(helperDirection, ldh.directionIn)
        path.svgD += ldh.drawLine(ldh.directionIn, 'full')

        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    },
    drawLinkPathOverlapsPatternA(ldh) {
        let path, arrow
        path = ldh.drawPath(ldh.directionOut)

        path.svgD += ldh.drawLine(ldh.directionOut, 'full')
        path.svgD += ldh.drawHalfOut(ldh.directionOut, ldh.directionIn)
        path.svgD += ldh.drawHalfIn(ldh.directionIn, ldh.directionOut)
        path.svgD += ldh.drawLine(ldh.directionIn, 'full')

        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    }
}

globalThis.linkDrawPathsOverlaps = linkDrawPathsOverlaps
export { linkDrawPathsOverlaps }
