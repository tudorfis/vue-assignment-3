import { LinkHelper } from "../helpers/link.helper"
import { linkDirectionsHelper } from '../helpers/link-directions/linkDirections.helper'
import { LinkDrawPathsOverlaps } from './grid-links-draw/link-draw-paths/any-direction/LinkDrawPathsOverlaps'
import { LinkDrawPathsStraights } from './grid-links-draw/link-draw-paths/any-direction/LinkDrawPathsStraights'
import { LinkDrawPathsForcedOutSameLine } from "./grid-links-draw/link-draw-paths/forced-out/LinkDrawPathsForcedOutSameLine"
import { LinkDrawPathsForcedOutOverlaps } from "./grid-links-draw/link-draw-paths/forced-out/LinkDrawPathsForcedOutOverlaps"
import { LinkDrawPathsForcedInSameLine } from "./grid-links-draw/link-draw-paths/forced-in/LinkDrawPathsForcedInSameLine"
import { LinkDrawPathsForcedInOverlaps } from "./grid-links-draw/link-draw-paths/forced-in/LinkDrawPathsForcedInOverlaps"
import { LinkDrawPathsBothForcedSameLine } from "./grid-links-draw/link-draw-paths/both-forced/LinkDrawPathsBothForcedSameLine"
import { LinkDrawPathsBothForcedOverlaps } from "./grid-links-draw/link-draw-paths/both-forced/LinkDrawPathsBothForcedOverlaps"

const gridLinksDrawService = {
    createPathAndArrow(lh) {
        const ldm = linkDirectionsHelper.getLinkDirectionsMap(lh)

        if (ldm.isBothForced)
            return this.drawLinkPathBothForcedDirections(lh, new LinkHelper(lh.linkKey, true), ldm)

        else if (ldm.isOptimal)
            return this.drawLinkPathNoForcedDirections(lh)

        else if (ldm.hasForcedOutDirection)
            return this.drawLinkPathForcedOut(lh, ldm)

        else if (ldm.hasForcedInDirection) 
            return this.drawLinkPathForcedIn(lh, new LinkHelper(lh.linkKey, true), ldm)
    },
    drawLinkPathNoForcedDirections(lh) {
        if (lh.isSameRowCol)
            return this.drawLinkPathSameRowOrCol(lh)
   
        return this.drawLinkPathOverlaps(lh)
    },
    drawLinkPathSameRowOrCol(lh) {
        const linkDrawPathsStraights = new LinkDrawPathsStraights({ lh })

        if (lh.isSameRow && LinkHelper.isUpOrDown(lh.directionOut))
            return linkDrawPathsStraights.drawSameRowButUpOrDown()

        else if (lh.isSameCol && LinkHelper.isLeftOrRight(lh.directionOut))
            return linkDrawPathsStraights.drawSameColButLeftOrRight()

        return linkDrawPathsStraights.drawSameRowOrColButStraightLine()
    },
    drawLinkPathOverlaps(lh) {
        const linkDirectionsMap = linkDirectionsHelper.getLinkDirectionsMap(lh)
        const loh = linkDirectionsMap.linkOverlapHelper
        
        const linkDrawPathsOverlaps = new LinkDrawPathsOverlaps({ lh, loh })

        if (loh.D1 || loh.D2)
            return linkDrawPathsOverlaps.drawOverlapsPatternD()

        else if (loh.C1 || loh.C2)
            return linkDrawPathsOverlaps.drawOverlapsPatternC()
        
        else if (loh.B1 || loh.B2)
            return linkDrawPathsOverlaps.drawOverlapsPatternB()
        
        else if (loh.A0 || loh.A1 || loh.A2)
            return linkDrawPathsOverlaps.drawOverlapsPatternA()

        throw new Error('Unique Exception: not found a linkDirectionsOverlapHelper pattern to resolve')
    },

    drawLinkPathForcedOut(lh, ldm) {
        const linkDrawPathsForcedOutSameLine = new LinkDrawPathsForcedOutSameLine({ lh, linkDirectionsMap: ldm })
        const linkDrawPathsForcedOutOverlaps = new LinkDrawPathsForcedOutOverlaps({ lh, linkDirectionsMap: ldm })

        if (ldm.isForcedOutSameRowCol(lh)) 
            return linkDrawPathsForcedOutSameLine.drawSameRowCol()
        
        else {
            if (ldm.isForcedOutOppositeOfPdir0(lh))
                return linkDrawPathsForcedOutOverlaps.drawOppositeOfPdir0()

            else if (ldm.isForcedOutOppositeOfPdir1(lh))
                return linkDrawPathsForcedOutOverlaps.drawOppositeOfPdir1()

            else {
                linkDrawPathsForcedOutOverlaps.prototype = this
                return linkDrawPathsForcedOutOverlaps.drawLastRemainingOfPdir(ldm)
            }
        }
    },
    drawLinkPathForcedIn(lh, lh2, ldm) {
        const linkDrawPathsForcedInSameLine = new LinkDrawPathsForcedInSameLine({ lh, lh2, linkDirectionsMap: ldm })
        const linkDrawPathsForcedInOverlaps = new LinkDrawPathsForcedInOverlaps({ lh, lh2, linkDirectionsMap: ldm })

        if (ldm.isForcedInSameRowCol(lh2)) 
            return linkDrawPathsForcedInSameLine.drawSameRowCol()
        
        else {
            if (ldm.isForcedInOppositeOfPdir0(lh2))
                return linkDrawPathsForcedInOverlaps.drawOppositeOfPdir0()

            else if (ldm.isForcedInOppositeOfPdir1(lh2))
                return linkDrawPathsForcedInOverlaps.drawOppositeOfPdir1()
            
            else
                return linkDrawPathsForcedInOverlaps.drawLastRemainingOfPdir(ldm)
        }
    },
    drawLinkPathBothForcedDirections(lh, lh2, ldm) {
        const linkDrawPathsBothForcedSameLine = new LinkDrawPathsBothForcedSameLine({ lh, lh2, linkDirectionsMap: ldm })
        const linkDrawPathsBothForcedOverlaps = new LinkDrawPathsBothForcedOverlaps({ lh, lh2, linkDirectionsMap: ldm })

        if (ldm.isForcedInSameRowCol(lh))
            return linkDrawPathsBothForcedSameLine.drawSameRowCol()
            
        else 
            return linkDrawPathsBothForcedOverlaps.drawOverlaps()
    }
}

export { gridLinksDrawService }
