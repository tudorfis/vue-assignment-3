import Vue from 'vue'
import { gridModel } from "../grid.model"
import { LinkDrawHelper } from '../helpers/linkDraw.helper'
import linkMapHelper from '../helpers/linkMap.helper'
import { globalConfig } from '../../../config/global.config'
import { LinkKeyIterator } from '../iterators/LinkKeyIterator'

export const gridLinksService = {
    paths: {},
    colors: [],
    colorIds: [],

    buildLinks() {
        this.paths = {}
        this.colors = []
        this.colorIds = []

        linkMapHelper.generateEEmap()
        linkMapHelper.eePathMap = {}

        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while(lki.continue)
            this.genPathTwoCells(lki.linkKey)
    },

    genPathTwoCells(linkKey = '', isDrag = false) {
        Vue.set(this.paths, linkKey, [])
        
        let path = {}, arrow = {}
        const ldh = new LinkDrawHelper(linkKey)

        linkMapHelper.restoreEEforGenPath()
        linkMapHelper.generateEEforGenPath(ldh, isDrag)
        
        path = ldh.drawPath(ldh.directionOut)
        path.d += ldh.drawLine(ldh.directionOut, 'full')
        linkMapHelper.setPathMap(ldh, ldh.directionOut, false)

        if (ldh.sameRow || ldh.sameCol) {
            path.d += ldh.drawLine(ldh.directionOut, 'arrow')
            arrow = ldh.drawArrow(path.d, ldh.directionOut)
        }
        else {
            path.d += ldh.drawHalf(ldh.directionOut, ldh.directionIn, true, linkKey)
            path.d += ldh.drawHalf(ldh.directionIn, ldh.directionOut, false, linkKey)
            linkMapHelper.setPathMapCorner(ldh)

            path.d += ldh.drawLine(ldh.directionIn, 'full')
            linkMapHelper.setPathMap(ldh, ldh.directionIn, true)

            path.d += ldh.drawLine(ldh.directionIn, 'arrow')
            arrow = ldh.drawArrow(path.d, ldh.directionIn)
        }
        
        const color = this.getPathColor(ldh, isDrag)
        this.setPaths(path, arrow, linkKey, color)
    },
    setPaths(path, arrow, linkKey, color) {
        path.color = color
        path.linkKey = linkKey

        arrow.color = color
        arrow.linkKey = linkKey

        this.paths[linkKey].push(path)
        this.paths[linkKey].push(arrow)
    },
    getPathColor(ldh, isDrag) {
        if (this.colors.length === 0)
            this.colors = [...globalConfig.colorArray]
        
        if (ldh.idLink && !this.colorIds[ldh.idLink] && !isDrag)
            this.colorIds[ldh.idLink] = this.colors.pop()

        return isDrag ? '#e9e9e9' : this.colorIds[ldh.idLink]
    },
    rearangeLinks(oldPosition, newPosition) {
        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            const link1 = LinkDrawHelper.getLink1(lki.linkKey)
            const link2 = LinkDrawHelper.getLink2(lki.linkKey)

            if (link1 === oldPosition)
                gridModel.model.links[lki.i - 1] = LinkDrawHelper.genLinkKey(newPosition, link2)

            else if (link2 === oldPosition)
                gridModel.model.links[lki.i - 1] = LinkDrawHelper.genLinkKey(link1, newPosition)
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