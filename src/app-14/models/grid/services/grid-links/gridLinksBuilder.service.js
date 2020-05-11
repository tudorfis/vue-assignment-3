import Vue from "vue"
import { globalConfig as gc } from "../../../../config/global.config"
import { gridModel } from "../../grid.model"
import { LinkHelper } from "../../helpers/link.helper"
import linkEEMapHelper from "../../helpers/linkEEMap.helper"
import { linkPathMapHelper } from "../../helpers/linkPathMap.helper"
import { LinkKeyIterator } from "../../iterators/LinkKeyIterator"
import { gridLinksDrawService } from "../grid-links/gridLinksDraw.service"
import { linkPathDragHelper } from "../../helpers/linkPathDrag.helper"

const gridLinksBuilderService = {
    svgPaths: {},

    buildLinks() {
        this.svgPaths = {}
        this.colors = []

        linkEEMapHelper.resetEEMap()

        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while(lki.continue)
            this.generateSvgPath(lki.linkKey)

        linkPathMapHelper.generatePathMap()
    },
    generateSvgPath(linkKey = '', isDrag = false) {
        Vue.set(this.svgPaths, linkKey, [])
        const lh = new LinkHelper(linkKey)

        linkPathDragHelper.handleLinkDraw(lh, isDrag)

        const pathArrow = gridLinksDrawService.createPathAndArrow(lh)
        const color = this.getPathColor(linkKey, isDrag)
        const width = this.getPathWidth(linkKey, isDrag)
        const style = this.getPathStyle(linkKey, isDrag, width)
        
        this.setPaths({ pathArrow, linkKey, color, width, style })
    },
    getPathColor(linkKey, isDrag) {
        let color = gc.defaultPathColor
        
        const linkAttribute = gridModel.getLinkAttribute(linkKey)
        
        if (linkAttribute && linkAttribute.color) {
            color = linkAttribute.color
        }
        
        const isSplitGridCell = linkAttribute.isSplit
        const isSplitYesDrag = linkAttribute.splitType === 'yes' 
        
        const dragSplitColor = isSplitYesDrag ? gc.drawPathSplitDragYesColor : gc.drawPathSplitDragNoColor
        const dragPathColor = isSplitGridCell ? dragSplitColor : gc.defaultPathDragColor

        return isDrag ? dragPathColor : color
    },
    getPathWidth(linkKey, isDrag) {
        let width = gc.arrowLineWidth

        const linkAttribute = gridModel.getLinkAttribute(linkKey)

        if (linkAttribute && linkAttribute.width)
            width += +linkAttribute.width

        if (gc.zoomLevel === 50 && width >= 5) width = 3
        if (width <= 0) width = 2

        return isDrag ? gc.arrowLineWidth : width
    },
    getPathStyle(linkKey, isDrag, width) {
        let style = ''

        const linkAttribute = gridModel.getLinkAttribute(linkKey)

        if (linkAttribute && linkAttribute.style) {
            switch (linkAttribute.style) {
                case 'dotted':
                    style = `${width},${width}`
                    break;
                
                case 'dashed':
                    style = `${width * 8},${width * 2}`
                    break;
            }
        }

        return isDrag ? '' : style
    },
    setPaths(query) {
        const vm = this
        const { pathArrow, linkKey, color, width, style } = query

        setPathArrow(0)
        setPathArrow(1)

        function setPathArrow(i) {
            pathArrow[i].color = color
            pathArrow[i].linkKey = linkKey
            pathArrow[i].width = width
            pathArrow[i].style = style

            vm.svgPaths[linkKey].push(pathArrow[i])
        }
    },

}

globalThis.gridLinksBuilderService = gridLinksBuilderService
export { gridLinksBuilderService }
