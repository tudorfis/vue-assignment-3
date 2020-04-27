import Vue from 'vue'
import { globalConfig } from '../../../config/global.config'
import { gridModel } from "../grid.model"
import { LinkHelper } from '../helpers/link.helper'
import linkEEMapHelper from '../helpers/link-ee/linkEEMap.helper'
import { linkPathMapHelper } from '../helpers/linkPathMap.helper'
import { LinkKeyIterator } from '../iterators/LinkKeyIterator'
import { gridLinksDrawService } from './gridLinksDraw.service'

export const gridLinksService = {
    svgPaths: {},
    colors: [],
    colorIds: [],

    buildLinks() {
        this.svgPaths = {}
        this.colors = []
        this.colorIds = []

        this.sortLinkKeys()

        linkDirectionsHelper.resetLinkMap()
        linkEEMapHelper.generateEEmap()
        linkPathMapHelper.resetPathMap()

        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while(lki.continue)
            this.generateSvgPath(lki.linkKey)
    },
    sortLinkKeys() {
        const sortedLinks = []
        gridModel.model.links.forEach(linkKey => {
            if (linkKey !== null) {
                const lh = new LinkHelper(linkKey)
    
                if (lh.isSameRowCol) {
                    sortedLinks.unshift(linkKey)
                } else {
                    sortedLinks.push(linkKey)
                }
            }
        })

        gridModel.model.links = sortedLinks
    },
    generateSvgPath(linkKey = '', isDrag = false) {
        Vue.set(this.svgPaths, linkKey, [])
        const lh = new LinkHelper(linkKey)

        linkEEMapHelper.restoreEEMapState()
        if (isDrag) linkEEMapHelper.saveEEMapState(lh)
        
        const pathArrow = gridLinksDrawService.createPathAndArrow(lh)
        const color = this.getPathColor(lh, isDrag)

        this.setPaths(pathArrow[0], pathArrow[1], linkKey, color)
    },
    setPaths(path, arrow, linkKey, color) {
        path.color = color
        path.linkKey = linkKey

        arrow.color = color
        arrow.linkKey = linkKey

        this.svgPaths[linkKey].push(path)
        this.svgPaths[linkKey].push(arrow)
    },
    getPathColor(lh, isDrag) {
        if (this.colors.length === 0)
            this.colors = [...globalConfig.colorArray]
        
        if (lh.idLink && !this.colorIds[lh.idLink] && !isDrag)
            this.colorIds[lh.idLink] = this.colors.pop()

        return isDrag ? '#e9e9e9' : this.colorIds[lh.idLink]
    },
    rearangeLinks(oldPosition, newPosition) {
        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            const link1 = LinkHelper.getLink1(lki.linkKey)
            const link2 = LinkHelper.getLink2(lki.linkKey)

            if (link1 === oldPosition)
                gridModel.model.links[lki.i - 1] = LinkHelper.getLinkKey(newPosition, link2)

            else if (link2 === oldPosition)
                gridModel.model.links[lki.i - 1] = LinkHelper.getLinkKey(link1, newPosition)
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
                const index = gridModel.model.links.indexOf(lki.linkKey)
                delete gridModel.model.links[index]
            }
        }
    }
}