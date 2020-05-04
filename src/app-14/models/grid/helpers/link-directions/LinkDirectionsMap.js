import { LinkHelper } from "../link.helper"

class LinkDirectionsMap {
    constructor(query) {
        this.linkOverlapHelper = query.linkOverlapHelper
        this.linkOverlapOutsideHelper = query.linkOverlapOutsideHelper

        this.link1Direction = query.link1Direction
        this.link2Direction = query.link2Direction

        this.forcedOutDirection = query.forcedOutDirection
        this.forcedInDirection = query.forcedInDirection
    }
    get loh() {
        return this.linkOverlapHelper
    }
    
    get isValidForcedLinkOut() {
        if (!this.forcedOutDirection) return false
        return this.forcedOutDirection === this.link1Direction
    }
    get isValidForcedLinkIn() {
        if (!this.forcedInDirection) return false
        return this.forcedInDirection === this.link2Direction
    }
    get isValidBothForcedLinks() {
        return this.isValidForcedLinkOut && this.isValidForcedLinkIn
    }
    get hasNoForcedDirections() {
        return !this.forcedOutDirection && !this.forcedInDirection
    }
    get hasForcedOutDirection() {
        return !!this.forcedOutDirection && !this.forcedInDirection

    }
    get hasForcedInDirection() {
        return !this.forcedOutDirection && !!this.forcedInDirection
    }
    get hasBothForcedDirections() {
        return !!this.forcedOutDirection && !!this.forcedInDirection
    }

    get isBothForced() {
        return this.hasBothForcedDirections && !this.isValidBothForcedLinks
    }
    get isOptimal() {
        return this.hasNoForcedDirections || this.isValidForcedLinkOut || this.isValidForcedLinkIn
    }

    isForcedOutSameRowCol(lh) {
        return lh.isSameRowCol
    }
    isForcedOutOppositeOfPdir0(lh) {
        return (LinkHelper.getOpositeDirection(this.forcedOutDirection) === lh.potentialDirections[0])
    }
    isForcedOutOppositeOfPdir1(lh) {
        return (LinkHelper.getOpositeDirection(this.forcedOutDirection) === lh.potentialDirections[1])
    }

    isForcedInSameRowCol(lh) {
        return lh.isSameRowCol
    }
    isForcedInOppositeOfPdir0(lh) {
        return (LinkHelper.getOpositeDirection(this.forcedInDirection) === lh.potentialDirections[0])
    }
    isForcedInOppositeOfPdir1(lh) {
        return (LinkHelper.getOpositeDirection(this.forcedInDirection) === lh.potentialDirections[1])
    }
}

export { LinkDirectionsMap }
