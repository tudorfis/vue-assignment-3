import { LinkDrawHelper } from "../helpers/linkDraw.helper"
import linkMapHelper from "../helpers/linkMap.helper"
import { gridModel } from "../grid.model"

export const gridLinksDroppointService = {
    hasDroppointMiddle(position) {
        if (!linkMapHelper.eePathMap[position]) return false  
        if (gridModel.model.cells[position].is) return false

        const eePathMap = linkMapHelper.eePathMap[position]
        return eePathMap.h.length > 0 || eePathMap.v.length > 0 || eePathMap.c.length
    },
    setDroppointLinksByMiddle(position) {
        if (!linkMapHelper.eePathMap[position]) return
        const eePathMap = linkMapHelper.eePathMap[position]

        if (eePathMap.v.length > 0)
            for (const linkKey of eePathMap.v)
                this.connectDroppointLinksByMiddle(linkKey, position)

        if (eePathMap.h.length > 0)
            for (const linkKey of eePathMap.h)
                this.connectDroppointLinksByMiddle(linkKey, position)
        
        if (eePathMap.c.length > 0)
            for (const linkKey of eePathMap.c)
                this.connectDroppointLinksByMiddle(linkKey, position)
        
    },
    connectDroppointLinksByMiddle(linkKey, position) {
        const ldh = new LinkDrawHelper(linkKey)

        const newLinkKey1 = LinkDrawHelper.genLinkKey(ldh.link1, position)
        const newLinkKey2 = LinkDrawHelper.genLinkKey(position, ldh.link2)

        gridModel.model.links.push(newLinkKey1)
        gridModel.model.links.push(newLinkKey2)

        const index = gridModel.model.links.indexOf(linkKey)
        delete gridModel.model.links[index]
    },
    getEmptyPositionAfterDroppoint(newPosition, oldPosition) {
        if (!newPosition || !oldPosition) return null
        
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
