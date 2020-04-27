import { LinkDrawHelper } from "../helpers/linkDraw.helper"
import { linkDirectionsHelper } from '../helpers/linkDirections.helper'
import { linkPathMapConfigure } from './grid-links-draw/linkPathMapConfigure'
import { linkDrawPathsOverlaps } from './grid-links-draw/linkDrawPathsOverlaps'
import { linkDrawPathsStraights } from './grid-links-draw/linkDrawPathsStraights'

const gridLinksDrawService = {
    createPathAndArrow(ldh) {
        if (ldh.sameRowCol)
            return this.drawLinkPathSameRowOrCol(ldh)
           
        return this.drawLinkPathOverlaps(ldh)
    },
    
    drawLinkPathSameRowOrCol(ldh) {
        if (ldh.sameRow && LinkDrawHelper.upOrDown(ldh.directionOut)) {
            const ldhSameRowObj = linkDirectionsHelper.generateLdhSameRowButUpOrDown(ldh, ldh.directionOut)

            linkPathMapConfigure.sameRowButUpOrDown(ldh, ldhSameRowObj)
            return linkDrawPathsStraights.drawSameRowButUpOrDown(ldh, ldhSameRowObj)
        }

        else if (ldh.sameCol && LinkDrawHelper.leftOrRight(ldh.directionOut)) {
            const ldhSameRowObj = linkDirectionsHelper.generateLdhSameColButLeftOrRight(ldh, ldh.directionOut)

            linkPathMapConfigure.sameColButLeftOrRight(ldh, ldhSameRowObj)
            return linkDrawPathsStraights.drawSameColButLeftOrRight(ldh, ldhSameRowObj)
        }

        linkPathMapConfigure.sameRowOrColStraightLine(ldh)
        return linkDrawPathsStraights.drawSameRowOrColButStraightLine(ldh)
    },
    drawLinkPathOverlaps(ldh) {
        const loh = linkDirectionsHelper.getLinkDirectionsOverlapHelper(ldh)

        if (loh.D1 || loh.D2)
            return linkDrawPathsOverlaps.drawLinkPathOverlapsPatternD(ldh)

        else if (loh.C1 || loh.C2) {
            linkPathMapConfigure.overlapPatternC(ldh)
            return linkDrawPathsOverlaps.drawLinkPathOverlapsPatternC(ldh)
        }
        
        else if (loh.B1 || loh.B2) {
            linkPathMapConfigure.overlapPatternB(ldh)
            return linkDrawPathsOverlaps.drawLinkPathOverlapsPatternB(ldh)
        }
        
        else if (loh.A0 || loh.A1 || loh.A2) {
            linkPathMapConfigure.overlapPatternA(ldh, loh)
            return linkDrawPathsOverlaps.drawLinkPathOverlapsPatternA(ldh, loh)
        }

        throw new Error('Unique Exception: not found a linkDirectionsOverlapHelper pattern to resolve')
    }
}

export { gridLinksDrawService }
