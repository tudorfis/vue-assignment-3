import { LinkHelper } from "../helpers/link.helper"
import { linkDirectionsHelper } from '../helpers/link-directions/linkDirections.helper'
import { LinkPathMapConfigure } from './grid-links-draw/LinkPathMapConfigure'
import { LinkDirectionsGenerator } from "../helpers/link-directions/LinkDirectionsGenerator"
import { LinkDrawPathsOverlaps } from './grid-links-draw/link-draw-paths/any-direction/LinkDrawPathsOverlaps'
import { LinkDrawPathsStraights } from './grid-links-draw/link-draw-paths/any-direction/LinkDrawPathsStraights'
import { LinkDrawPathsForcedOutSameLine } from "./grid-links-draw/link-draw-paths/forced-out/LinkDrawPathsForcedOutSameLine"
import { LinkDrawPathsForcedOutOverlaps } from "./grid-links-draw/link-draw-paths/forced-out/LinkDrawPathsForcedOutOverlaps"
import { LinkDrawPathsForcedInSameLine } from "./grid-links-draw/link-draw-paths/forced-in/LinkDrawPathsForcedInSameLine"
import { LinkDrawPathsForcedInOverlaps } from "./grid-links-draw/link-draw-paths/forced-in/LinkDrawPathsForcedInOverlaps"
import { LinkDrawPathsBothForced } from "./grid-links-draw/link-draw-paths/both-forced/LinkDrawPathsBothForced"

const gridLinksDrawService = {
    createPathAndArrow(lh) {
        const ldm = linkDirectionsHelper.getLinkDirectionsMap(lh)

        if (ldm.hasBothForcedDirections && !ldm.isValidBothForcedLinks) {
            console.log('%c ldm.hasBothForcedDirections              ', 'background: black; color: white;')
        }
        else if (ldm.hasNoForcedDirections || ldm.isValidForcedLinkOut || ldm.isValidForcedLinkIn) {
            console.log('%c ldm.hasNoForcedDirections              ', 'background: black; color: white;')
            return this.drawLinkPathNoForcedDirections(lh)
        }
        else if (ldm.hasForcedOutDirection) {
            console.log('%c ldm.hasForcedOutDirection              ', 'background: black; color: white;')
            return this.drawLinkPathForcedOut(lh, ldm)
        }
        else if (ldm.hasForcedInDirection) {
            console.log('%c ldm.hasForcedInDirection              ', 'background: black; color: white;')
            return this.drawLinkPathForcedIn(lh, new LinkHelper(lh.linkKey, true), ldm)
        }
    },
    drawLinkPathNoForcedDirections(lh) {
        if (lh.isSameRowCol)
            return this.drawLinkPathSameRowOrCol(lh)
   
        return this.drawLinkPathOverlaps(lh)
    },
    drawLinkPathSameRowOrCol(lh) {
        if (lh.isSameRow && LinkHelper.isUpOrDown(lh.directionOut)) {
            
            const lhObj = LinkDirectionsGenerator.generateLhObjWhenSameRow(lh, lh.directionOut)
            const linkDrawPathsStraights = new LinkDrawPathsStraights({ lh, lhObj })
            const linkPathMapConfigure = new LinkPathMapConfigure({ lh, lhObj })

            linkPathMapConfigure.handleSameRowButUpOrDown()
            return linkDrawPathsStraights.drawSameRowButUpOrDown()
        }

        else if (lh.isSameCol && LinkHelper.isLeftOrRight(lh.directionOut)) {

            const lhObj = LinkDirectionsGenerator.generateLhObjWhenSameCol(lh, lh.directionOut)
            const linkDrawPathsStraights = new LinkDrawPathsStraights({ lh, lhObj })
            const linkPathMapConfigure = new LinkPathMapConfigure({ lh, lhObj })

            linkPathMapConfigure.handleSameColButLeftOrRight()
            return linkDrawPathsStraights.drawSameColButLeftOrRight()
        }

        const linkDrawPathsStraights = new LinkDrawPathsStraights({ lh })
        const linkPathMapConfigure = new LinkPathMapConfigure({ lh })

        linkPathMapConfigure.handleSameRowOrColStraightLine()
        return linkDrawPathsStraights.drawSameRowOrColButStraightLine()
    },
    drawLinkPathOverlaps(lh) {
        const loh = linkDirectionsHelper.getLinkDirectionsOverlapHelper(lh)

        const linkDrawPathsOverlaps = new LinkDrawPathsOverlaps({ lh, loh })
        const linkPathMapConfigure = new LinkPathMapConfigure({ lh, loh })

        if (loh.D1 || loh.D2)
            return linkDrawPathsOverlaps.drawOverlapsPatternD()

        else if (loh.C1 || loh.C2) {
            linkPathMapConfigure.handleOverlapPatternC()
            return linkDrawPathsOverlaps.drawOverlapsPatternC()
        }
        
        else if (loh.B1 || loh.B2) {
            linkPathMapConfigure.handleOverlapPatternB()
            return linkDrawPathsOverlaps.drawOverlapsPatternB()
        }
        
        else if (loh.A0 || loh.A1 || loh.A2) {
            linkPathMapConfigure.handleOverlapPatternA()
            return linkDrawPathsOverlaps.drawOverlapsPatternA()
        }

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
    }
}

export { gridLinksDrawService }
