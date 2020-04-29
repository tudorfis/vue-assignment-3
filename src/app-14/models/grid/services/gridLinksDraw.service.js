import { LinkHelper } from "../helpers/link.helper"
import { linkDirectionsHelper } from '../helpers/link-directions/linkDirections.helper'
import { LinkPathMapConfigure } from './grid-links-draw/LinkPathMapConfigure'
import { LinkDrawPathsOverlaps } from './grid-links-draw/link-draw-paths/LinkDrawPathsOverlaps'
import { LinkDrawPathsStraights } from './grid-links-draw/link-draw-paths/LinkDrawPathsStraights'
import { LinkDirectionsGenerator } from "../helpers/link-directions/LinkDirectionsGenerator"
import { LinkDrawPathsForcedOutSameLine } from "./grid-links-draw/link-draw-paths/LinkDrawPathsForcedOutSameLine"
import { LinkDrawPathsForcedOutOverlaps } from "./grid-links-draw/link-draw-paths/LinkDrawPathsForcedOutOverlaps"

const gridLinksDrawService = {
    createPathAndArrow(lh) {
        const ldm = linkDirectionsHelper.getLinkDirectionsMap(lh)

        if (ldm.hasNoForcedDirections || !ldm.isDifferentForcedLinkOut) {
            if (lh.isSameRowCol)
                return this.drawLinkPathSameRowOrCol(lh)
           
            return this.drawLinkPathOverlaps(lh)

        } else if (ldm.hasForcedOutDirection) {
            return this.drawLinkPathForcedOut(lh, ldm)
        }
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
        const isForcedOutSameRowCol = ldm.isForcedOutSameRowCol(lh)
        const isForcedOutOppositeOfPdir0 = ldm.isForcedOutOppositeOfPdir0(lh)
        const isForcedOutOppositeOfPdir1 = ldm.isForcedOutOppositeOfPdir1(lh)
        
        const linkDrawPathsForcedOutSameLine = new LinkDrawPathsForcedOutSameLine({ lh, linkDirectionsMap: ldm })
        const linkDrawPathsForcedOutOverlaps = new LinkDrawPathsForcedOutOverlaps({ lh, linkDirectionsMap: ldm })

        if (isForcedOutSameRowCol) {
            // linkPathMapConfigure.handleForcedOutSameRowCol()
            return linkDrawPathsForcedOutSameLine.drawSameRowCol()
        }
        else {
            if (isForcedOutOppositeOfPdir0) {
                // linkPathMapConfigure.handleForcedOutOppositePdir0()
                return linkDrawPathsForcedOutOverlaps.drawOppositeOfPdir0()
            }
            else if (isForcedOutOppositeOfPdir1) {
                // linkPathMapConfigure.handleForcedOutOppositePdir1()
                return linkDrawPathsForcedOutOverlaps.drawOppositeOfPdir1()
            }
            else {
                console.log('%c drawLastRemainingOfPdir               ', 'background: green; color: white')
                // linkPathMapConfigure.handleForcedOut()
                linkDrawPathsForcedOutOverlaps.prototype = this
                return linkDrawPathsForcedOutOverlaps.drawLastRemainingOfPdir(ldm)
            }
        }
    }
}

export { gridLinksDrawService }
