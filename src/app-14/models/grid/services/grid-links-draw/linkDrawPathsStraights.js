
const linkDrawPathsStraights = {
    drawSameRowButUpOrDown(ldh, ldhSameRowObj) {
        let path, arrow
        const hasCellsOut = ldhSameRowObj.hasCellsOutSameRow

        path = ldh.drawPath(ldh.directionOut)
        
        if (!hasCellsOut) path.svgD += ldh.drawHalfOut(ldh.directionOut, ldh.leftRight)
        path.svgD += ldh.drawHalfIn(ldh.rightLeft, ldh.directionOut)
        path.svgD += ldh.drawLine(ldh.rightLeft, 'full')
        path.svgD += ldh.drawHalfIn(ldh.rightLeft, ldh.directionIn)
        if (!hasCellsOut) path.svgD += ldh.drawHalfOut(ldh.directionIn, ldh.rightLeft)

        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    },
    drawSameColButLeftOrRight(ldh, ldhSameRowObj) {
        let path, arrow
        const hasCellsOut = ldhSameRowObj.hasCellsOutSameCol

        path = ldh.drawPath(ldh.directionOut)

        if (!hasCellsOut) path.svgD += ldh.drawHalfOut(ldh.directionOut, ldh.upDown)
        path.svgD += ldh.drawHalfIn(ldh.upDown, ldh.directionOut)
        path.svgD += ldh.drawLine(ldh.upDown, 'full')
        path.svgD += ldh.drawHalfIn(ldh.upDown, ldh.directionIn)
        if (!hasCellsOut) path.svgD += ldh.drawHalfOut(ldh.directionIn, ldh.upDown)
        
        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    },
    drawSameRowOrColButStraightLine(ldh) {
        let path, arrow

        path = ldh.drawPath(ldh.directionIn)
        path.svgD += ldh.drawLine(ldh.directionIn, 'full')
        path.svgD += ldh.drawLine(ldh.directionIn, 'arrow')
        arrow = ldh.drawArrow(path.svgD, ldh.directionIn)

        return [ path, arrow ]
    },
}

globalThis.linkDrawPathsStraights = linkDrawPathsStraights
export { linkDrawPathsStraights }
