import { LinkHelper } from "../link.helper"
import { UtilsStrings } from "../../../../utils/utilsStrings"

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
    get looh() {
        return this.linkOverlapOutsideHelper
    }
    
    get isValidForcedLinkOut() {
        if (!this.forcedOutDirection) return false
        return this.forcedOutDirection === this.link1Direction
    }
    get isValidForcedLinkIn() {
        if (!this.forcedInDirection) return false
        return this.forcedInDirection === this.link2Direction
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

    get hasCellsForcedOut() {
        const cellVerifierKey = `is${UtilsStrings.ucase(this.forcedOutDirection)}Cells`
        return this.linkOverlapOutsideHelper[cellVerifierKey]
    }
    get hasCellsForcedIn() {
        const cellVerifierKey = `is${UtilsStrings.ucase(this.forcedInDirection)}Cells`
        return this.linkOverlapOutsideHelper[cellVerifierKey]
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
