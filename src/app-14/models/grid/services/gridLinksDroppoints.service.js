import { gridModel } from "../grid.model"
import { LinkDrawHelper } from "../helpers/linkDraw.helper"
import { linkPathMapHelper } from "../helpers/linkPathMap.helper"

export const gridLinksDroppointService = {
    hasDroppointMiddle(newPosition, oldPosition) {
        if (gridModel.model.cells[newPosition].is) return false

        const linkKeys = linkPathMapHelper.getLinkKeys(newPosition)
        const hasDifferent = this.hasDifferentLinksForDroppoint(linkKeys, oldPosition) 

        return hasDifferent && linkKeys.length > 0
    },
    hasDifferentLinksForDroppoint(linkKeys, position) {
        if (!position) return true
        
        const filteredLinkKeys = linkKeys.filter(linkKey => linkKey.match(position))
        return filteredLinkKeys.length !== linkKeys.length
    },
    setDroppointLinksByMiddle(position) {
        const linkKeys = linkPathMapHelper.getLinkKeys(position)
        
        for (const linkKey of linkKeys)
            this.connectDroppointLinksByMiddle(linkKey, position)
    },
    connectDroppointLinksByMiddle(linkKey, position) {
        const ldh = new LinkDrawHelper(linkKey)
        const gm = gridModel.model

        const newLinkKey1 = LinkDrawHelper.genLinkKey(ldh.link1, position)
        const newLinkKey2 = LinkDrawHelper.genLinkKey(position, ldh.link2)

        if (gm.links.indexOf(newLinkKey1) === -1)
            gm.links.push(newLinkKey1)

        if (gm.links.indexOf(newLinkKey2) === -1)
            gm.links.push(newLinkKey2)

        const index = gm.links.indexOf(linkKey)
        delete gm.links[index]
    },
    getEmptyPositionAfterDroppoint(newPosition, oldPosition) {
        if (!newPosition || !oldPosition) return ''
        
        const rowNew = gridModel.getRow(newPosition)
        const colNew = gridModel.getCol(newPosition)

        const rowOld = gridModel.getRow(oldPosition)
        const colOld = gridModel.getCol(oldPosition)

        if (rowNew === rowOld && colNew < colOld)
            return gridModel.getPositionDiff(oldPosition, 0, 1)

        else if (colNew === colOld &&  rowNew < rowOld)
            return gridModel.getPositionDiff(oldPosition, 1, 0)
    
        return oldPosition
    },
    setDroppointLinksByDirection(position, direction) {
        const gm = gridModel.model
        let coordinates = [[],[]]

        if (['right', 'left'].indexOf(direction) !== -1) {
            coordinates[0] = [0, -1]
            coordinates[1] = [0, 1]
        }
        else if (['up', 'down'].indexOf(direction) !== -1) {
            coordinates[0] = [-1, 0]
            coordinates[1] = [1, 0]
        }

        const prevPosition = gridModel.getPositionDiff(position, ...coordinates[0])
        const nextPosition = gridModel.getPositionDiff(position, ...coordinates[1])
        
        const linkKeyDirection1 = LinkDrawHelper.genLinkKey(prevPosition, nextPosition)
        const linkKeyDirection2 = LinkDrawHelper.genLinkKey(nextPosition, prevPosition)

        const index1 = gm.links.indexOf(linkKeyDirection1)
        if (index1 !== -1) {
            const newLinkKey1 = LinkDrawHelper.genLinkKey(prevPosition, position)
            const newLinkKey2 = LinkDrawHelper.genLinkKey(position, nextPosition)

            gm.links.push(newLinkKey1)
            gm.links.push(newLinkKey2)
            delete gm.links[index1]
        }

        const index2 = gm.links.indexOf(linkKeyDirection2)
        if (index2 !== -1) {
            const newLinkKey1 = LinkDrawHelper.genLinkKey(nextPosition, position)
            const newLinkKey2 = LinkDrawHelper.genLinkKey(position, prevPosition)

            gm.links.push(newLinkKey1)
            gm.links.push(newLinkKey2)
            delete gm.links[index2]
        }
    }
}
