import Vue from 'vue'
import { gridModel } from "../grid.model"
import { LinkDrawHelper } from '../helpers/linkDraw.helper'
import linkEEhelper from '../helpers/linkEE.helper'

export const gridLinksOperations = {
    buildLinks() {
        linkEEhelper.generateEEmap()
        gridModel.paths = {}

        if (gridModel.model.links && gridModel.model.links.length)
            for (const linkKey of gridModel.model.links)
                gridLinksOperations.genPathTwoCells(linkKey)
        
    },
    genPathTwoCells(linkKey) {
        Vue.set(gridModel.paths, linkKey, [])

        const l = new LinkDrawHelper(linkKey, gridModel)
        let path, arrow, direction1, direction2, sameColRow

        if (l.right || l.left) {
            direction1 = 'rightLeft'
            direction2 = 'upDown'
            sameColRow = 'sameRow'
        }
        
        else if (l.up || l.down) {
            direction1 = 'upDown'
            direction2 = 'rightLeft'
            sameColRow = 'sameCol'
        }

        path = l.drawPath(l[direction1])
        path.d += l.drawLine(l[direction1], 'full')

        if (l[sameColRow]) {
            path.d += l.drawLine(l[direction1], 'arrow')
            arrow = l.drawArrow(l[direction1])
        
        } else {
            path.d += l.drawLine(l[direction1], 'half')
            path.d += l.drawLine(l[direction2], 'half')
            path.d += l.drawLine(l[direction2], 'full')

            path.d += l.drawLine(l[direction2], 'arrow')
            arrow = l.drawArrow(l[direction2])
        }

        gridModel.paths[linkKey].push(...[path, arrow])
    },
    rearangeLinks(oldPosition, newPosition) {
        for (const i in gridModel.model.links) {
            const linkKey = gridModel.model.links[i]

            const link1 = LinkDrawHelper.getLink1(linkKey)
            const link2 = LinkDrawHelper.getLink2(linkKey)

            if (link1 === oldPosition)
                gridModel.model.links[i] = LinkDrawHelper.genLinkKey(newPosition, link2)

            else if (link2 === oldPosition)
                gridModel.model.links[i] = LinkDrawHelper.genLinkKey(link1, newPosition)
        }
    }
}