import Vue from 'vue'
import { gridModel } from "../grid.model"
import { LinkDrawHelper } from '../helpers/linkDraw.helper'
import linkEEhelper from '../helpers/linkEE.helper'
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

        linkEEhelper.generateEEpath()
        linkEEhelper.generateEEmap()

        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while(lki.continue)
            this.genPathTwoCells(lki.linkKey)
    },
    genPathTwoCells(linkKey = '', isDrag = false) {
        if (this.colors.length === 0)
            this.colors = [...globalConfig.colorArray]

        Vue.set(this.paths, linkKey, [])

        const ldh = new LinkDrawHelper(linkKey)
        if (ldh.badLinkKey) return

        const pathDirections = ldh.genPathDirections()
        const direction1 = pathDirections[0]
        const direction2 = pathDirections[1]
        const sameColRow = pathDirections[2]

        let path, arrow
        path = ldh.drawPath(ldh[direction1])
        path.d += ldh.drawLine(ldh[direction1], 'full')
        
        if (ldh[sameColRow]) {
            path.d += ldh.drawLine(ldh[direction1], 'arrow')
            arrow = ldh.drawArrow(path.d, ldh[direction1])
        }
        else {
            
            if (ldh.goOtherWay && ldh.goAroundCell) {
                path.d += ldh.drawHalf(ldh[direction2], ldh[direction1], false, linkKey)
                path.d += ldh.drawHalf(ldh[direction1], ldh[direction2], true, linkKey)
            
            } else {
                // const adjustOtherWay = ldh.goOtherWay && !ldh[sameColRow]
                
                path.d += ldh.drawHalf(ldh[direction1], ldh[direction2], true, linkKey)
                path.d += ldh.drawHalf(ldh[direction2], ldh[direction1], false, linkKey)
            }

            path.d += ldh.drawLine(ldh[direction2], 'full')
            path.d += ldh.drawLine(ldh[direction2], 'arrow')

            arrow = ldh.drawArrow(path.d, ldh[direction2])
        }

        if (ldh.idLink && !this.colorIds[ldh.idLink] && !isDrag)
            this.colorIds[ldh.idLink] = this.colors.pop()

        const color = isDrag ? '#e9e9e9' : this.colorIds[ldh.idLink]

        path.color = color
        path.linkKey = linkKey

        arrow.color = color
        arrow.linkKey = linkKey

        this.paths[linkKey].push(path)
        this.paths[linkKey].push(arrow)

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
        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            if (lki.linkKey.includes(position))
                return false
        }

        return true
    },
    deleteAllLinks(position) {
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