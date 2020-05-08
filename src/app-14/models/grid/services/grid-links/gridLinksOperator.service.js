import { Utils } from "../../../../utils/utils"
import { gridModel } from "../../grid.model"
import { linkNameHelper } from "../../helpers/link-attributes/linkName.helper"
import { LinkHelper } from "../../helpers/link.helper"
import { LinkKeyIterator } from "../../iterators/LinkKeyIterator"

const gridLinksOperatorService = {
    rearangeLinks(oldPosition, newPosition) {
        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            const link1 = LinkHelper.getLink1(lki.linkKey)
            const link2 = LinkHelper.getLink2(lki.linkKey)

            if (link1 === oldPosition)
                resetLinkKeys(newPosition, link2)

            else if (link2 === oldPosition)
                resetLinkKeys(link1, newPosition)
        }

        linkNameHelper.rearange()

        function resetLinkKeys(link1, link2) {
            const oldLinkKey = lki.linkKey
            const newLinkKey = LinkHelper.getLinkKey(link1, link2)

            gridModel.model.links[lki.i - 1] = newLinkKey
            const linkAttribute = gridModel.getLinkAttribute(oldLinkKey)
            
            if (linkAttribute) {
                Utils.renameObjKey(gridModel.model.linkAttributes, oldLinkKey, newLinkKey)
                linkNameHelper.renameOldLinkKey(oldLinkKey, newLinkKey)
            }
        }
    },
    hasNoLinks(position) {
        if (!position) return true

        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            if (lki.linkKey.includes(position))
                return false
        }

        return true
    },
    deleteAllLinks(position) {
        if (!position) return
        
        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            if (lki.linkKey.includes(position)) {
                gridModel.deleteLink(lki.linkKey)
            }
        }
    },
    moveLinksToNewPosition(oldPosition, newPosition) {
        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            if (!lki.linkKey.includes(oldPosition)) continue

            const newLinkKey = lki.linkKey.replace(oldPosition, newPosition)
            const index = gridModel.model.links.indexOf(lki.linkKey)
            gridModel.model.links[index] = newLinkKey

            if (gridModel.getLinkAttribute(lki.linkKey))
                Utils.renameObjKey(gridModel.model.linkAttributes, lki.linkKey, newLinkKey)
        }
    }
}

globalThis.gridLinksOperatorService = gridLinksOperatorService
export { gridLinksOperatorService }
