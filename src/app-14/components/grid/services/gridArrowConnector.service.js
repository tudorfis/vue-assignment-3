import { globalConfig as gc } from "../../../config/global.config"
import { gridModel } from "../../../models/grid/grid.model"
import { LinkDrawHelper } from "../../../models/grid/helpers/linkDraw.helper"
import { gridHistoryService } from "../../../models/grid/services/gridHistory.service"
import { gridLinksService } from "../../../models/grid/services/gridLinks.service"
import { VueUtils } from "../../../utils/vue.utils"
import { gridPanService } from "./gridPan.service"

export const gridArrowConnectorService = {
    selectorId: '',
    startedDrag: false,
    startedPosition: '',
    currentPosition: '',
    gridcell: null,
    linkKey: '',
    isHighlight: false,
    recentLink: false,
    
    get hasCell() {
        if (!this.position) return false

        return gridModel.model.cells[this.position].is
    },
    get sameCell() {
        return this.startedPosition === this.currentPosition
    },
    get position() {
        if (!this.gridcell) return ''

        return this.gridcell.__vue__.$options.propsData.position
    },
    get gridcellElement() {
        return this.gridcell.__vue__.$refs['gridcellelement'].$el
    },
    get arrowConnectorEl() {
        if (!this.selectorId)
            throw new Error('Please specificy a selectorId for gridArrowConnector service before initializing')

        return document.querySelector(`#${this.selectorId}`)
    },
    startDrag() {
        this.linkKey = ''
        this.recentLink = false
        this.startedDrag = true
        this.startedPosition = this.currentPosition
    },
    init(event) {
        
        if (event) {
            this.gridcell = VueUtils.traversePath(event, 'gridcell')
            this.highlightCell()
        }

        if (!this.hasCell || this.startedDrag || gridPanService.startedPan) return

        this.setArrowConnectorStyles()    
    },
    setArrowConnectorStyles() {
        const adjust = Math.floor(gc.gridCellElementWidth / 2)
        const rect = this.gridcell.getBoundingClientRect()

        const top = rect.top + rect.height - adjust - 3
        const left = rect.left + rect.width - adjust + 3
        const fontSize = Math.floor(gc.gridCellElementWidth / 4)

        Object.assign(this.arrowConnectorEl.style, {
            display: `block`,
            top: `${top}px`,
            left: `${left}px`,
            fontSize: `${fontSize}px`
        })
        
        this.gridcellElement.append(this.arrowConnectorEl)
    },
    highlightCell() {
        if (this.startedDrag && this.hasCell && !this.sameCell) {
            this.isHighlight = true
            this.gridcell.style.boxShadow = '5px 5px 50px #efefef'
        }
    },
    destroy() {
        this.removeTempPaths()
        this.dehighlightCell()

        if (!this.hasCell || this.startedDrag) return

        this.hideArrowConnector()
    },
    removeTempPaths() {
        if (this.linkKey && !this.recentLink) {
            
            delete gridLinksService.svgPaths[this.linkKey]
            this.linkKey = ''
        }
    },
    dehighlightCell(hideGridCell) {
        if (!this.gridcell) return
        
        if (hideGridCell && this.gridcell) {
            this.isHighlight = false
            this.gridcell.style.boxShadow = 'none'
        } else {
            this.isHighlight = false
            this.gridcell.style.boxShadow = 'none'
        }
    },
    hideArrowConnector() {
        this.arrowConnectorEl.style.display = `none`
        document.querySelector('.gridcontent').append(this.arrowConnectorEl)
    },
    stopDrag() {
        if (this.isHighlight) {
            this.startedDrag = false
            this.isHighlight = false
            this.recentLink = true

            this.init()
            this.gridcellElement.__vue__.showOtherIcons = true

            if (!gridModel.model.links.includes(this.linkKey))
                gridModel.model.links.push(this.linkKey)

            gridHistoryService.saveState()
        }
        else  {
            this.startedDrag = false
            this.removeTempPaths()
            this.hideArrowConnector()
        }

        this.dehighlightCell(true)
        gridLinksService.buildLinks()
    },
    drawPath() {
        if (!this.startedDrag) return

        const start = this.startedPosition
        const end = this.currentPosition
        
        if (start === end) return
        
        const linkKey = LinkDrawHelper.genLinkKey(start,end)
        
        if (this.linkKey === linkKey) return
        this.linkKey = linkKey
        
        gridLinksService.generateSvgPath(linkKey, true)
    },
    doGridcellOperations(position) {
        this.currentPosition = position
        
        if (this.startedDrag)
            this.removeTempPaths()
    },

    get restoreEEMapState() {
        return !this.recentLink && this.startedDrag
    }
}