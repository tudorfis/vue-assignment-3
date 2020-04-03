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
        let path, arrow, t1, t2, t3, t4, t5

        if (l.right || l.left) {
            t1 = 'rightLeft'
            t2 = 'eastWest'
            t3 = 'upDown'
            t4 = 'northSouth'
            t5 = 'sameRow'
        }
        
        else if (l.up || l.down) {
            t1 = 'upDown'
            t2 = 'northSouth'
            t3 = 'rightLeft'
            t4 = 'eastWest'
            t5 = 'sameCol'
        }

        path = l.drawPath(l[t1], l.link1, l.link2)
        path.d += l.drawLine(l[t1], 'full')

        if (l[t5]) {
            path.d += l.drawLine(l[t2], 'arrow')
            arrow = l.drawArrow(l[t2], l.link1, l.link2)
        
        } else {
            path.d += l.drawLine(l[t1], 'half', l.link1, l.link2)
            path.d += l.drawLine(l[t3], 'half', l.link1, l.link2)
            path.d += l.drawLine(l[t3], 'full')

            path.d += l.drawLine(l[t4], 'arrow')
            arrow = l.drawArrow(l[t4], l.link1, l.link2)
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