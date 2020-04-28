import { LinkHelper } from "../helpers/link.helper"
import { linkDirectionsHelper } from '../helpers/link-directions/linkDirections.helper'
import { LinkPathMapConfigure } from './grid-links-draw/LinkPathMapConfigure'
import { LinkDrawPathsOverlaps } from './grid-links-draw/link-draw-paths/LinkDrawPathsOverlaps'
import { LinkDrawPathsStraights } from './grid-links-draw/link-draw-paths/LinkDrawPathsStraights'
import { LinkDrawPathsForcedOut } from './grid-links-draw/link-draw-paths/LinkDrawPathsForcedOut'
import { LinkDirectionsGenerator } from "../helpers/link-directions/LinkDirectionsGenerator"

const gridLinksDrawService = {
    createPathAndArrow(lh) {
        const linkDirectionsMap = linkDirectionsHelper.getLinkDirectionsMap(lh)
        
        if (linkDirectionsMap.hasNoForcedDirections || !linkDirectionsMap.isDifferentForcedLinkOut) {
            if (lh.isSameRowCol)
                return this.drawLinkPathSameRowOrCol(lh)
           
            return this.drawLinkPathOverlaps(lh)

        } else if (linkDirectionsMap.hasForcedOutDirection) {
            return this.drawLinkPathForcedOut(lh, linkDirectionsMap)
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
    drawLinkPathForcedOut(lh, linkDirectionsMap) {
        const isForcedOutOppositeOfPdir0 = linkDirectionsMap.isForcedOutOppositeOfPdir0(lh)
        const isForcedOutOppositeOfPdir1 = linkDirectionsMap.isForcedOutOppositeOfPdir1(lh)
        
        const linkDrawPathsForcedOut = new LinkDrawPathsForcedOut({ lh, linkDirectionsMap })

        if (isForcedOutOppositeOfPdir0) {
            // linkPathMapConfigure.handleForcedOutOppositePdir0()
            return linkDrawPathsForcedOut.drawOppositeOfPdir0()
        }
        else if (isForcedOutOppositeOfPdir1) {
            // linkPathMapConfigure.handleForcedOutOppositePdir1()
            return linkDrawPathsForcedOut.drawOppositeOfPdir1()
        }
        else {
            // linkPathMapConfigure.handleForcedOut()
            return linkDrawPathsForcedOut.drawLastRemaining()
        }

        throw new Error('Unique Exception: not found a linkDirectionsOverlapHelper pattern to resolve')

    }
}

export { gridLinksDrawService }
