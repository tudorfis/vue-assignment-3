import { LinkDrawPathsBase } from "../LinkDrawPathsBase"
import { UtilsStrings } from "../../../../../../utils/utilsStrings"
import { LinkHelper } from "../../../../helpers/link.helper"

const ucase = UtilsStrings.ucase

class LinkDrawPathsBothForcedOverlaps extends LinkDrawPathsBase {
    constructor(query) {
        super(query)
    }
    drawOppositeOfPdir0() { }
    drawOppositeOfPdir1() { }
    drawLastRemainingOfPdir() { }
}

export { LinkDrawPathsBothForcedOverlaps }