import { globalConfig } from '../../../config/global.config'
import { VueUtils } from '../../../utils/vue.utils'
import { gridModel } from '../../../models/grid/grid.model'
import { LinkDrawHelper } from '../../../models/grid/helpers/linkDraw.helper'
import { gridLinksOperations } from '../../../models/grid/operations/gridLinks.operations'

export const gridArrowService = {
    arrowConnectorId: '#arrow-connector',
    startedDrag: false,
    startedPosition: '',
    currentPosition: '',
    gridCellElement: null,
    linkKey: '',
    isHighlight: false,
    recentLink: false,
    
    startDrag() {
        this.linkKey = ''
        this.recentLink = false
        this.startedDrag = true
        this.startedPosition = this.currentPosition
    },
    init(event) {
        this.saveGridCellElement(event)

        this.currentPosition = this.prototype.position
        this.highlightCell()

        if (!this.prototype.cell.is || this.startedDrag) return

        const element = this.prototype.$el
        const arrowConnector = document.querySelector(this.arrowConnectorId)

        const adjust = Math.floor(globalConfig.gridCellElementWidth / 2)
        const rect = element.getBoundingClientRect()
        const top = rect.top + rect.height - adjust
        const left = rect.left + rect.width - adjust + 10
        const fontSize = Math.floor(globalConfig.gridCellElementWidth / 4)

        arrowConnector.style.display = `block`
        arrowConnector.style.top = `${top}px`
        arrowConnector.style.left = `${left}px`
        arrowConnector.style.fontSize = `${fontSize}px`

        this.prototype.$el.append(arrowConnector)
    },
    saveGridCellElement(event) {
        this.gridCellElement = VueUtils.traversePath(event, 'gridcell')
    },
    highlightCell() {
        if (this.startedDrag && this.prototype.cell.is && this.startedPosition !== this.currentPosition) {
            this.isHighlight = true
            this.prototype.$el.style.boxShadow = '5px 5px 50px #efefef'
        }
    },
    destroy() {
        this.removeTempPaths()
        this.dehighlightCell()

        if (!this.prototype.cell.is || this.startedDrag) return

        this.hideArrowConnector()
    },
    removeTempPaths() {
        if (this.linkKey && !this.recentLink) {
            Vue.delete(gridModel.paths, this.linkKey)
            this.linkKey = ''
        }
    },
    dehighlightCell(hideGridCell) {
        if (hideGridCell && this.gridCellElement) {
            this.isHighlight = false
            this.gridCellElement.style.boxShadow = 'none'
        } else {
            this.isHighlight = false
            this.prototype.$el.style.boxShadow = 'none'
        }
    },
    hideArrowConnector() {
        document.querySelector('#arrow-connector').style.display = `none`
    },
    stopDrag() {
        if (this.isHighlight) {
            this.recentLink = true

            if (!gridModel.model.links.includes(this.linkKey))
                gridModel.model.links.push(this.linkKey)
        }
        else this.removeTempPaths()

        this.startedDrag = false
        this.hideArrowConnector()
        this.dehighlightCell(true)

        gridModel.buildLinks()
    },
    drawPath() {
        if (!this.startedDrag) return

        const start = this.startedPosition
        const end = this.currentPosition

        if (start === end) return

        const linkKey = LinkDrawHelper.genLinkKey(start,end)

        if (this.linkKey === linkKey) return
        this.linkKey = linkKey
            
        gridLinksOperations.genPathTwoCells.call(gridModel, linkKey, true)
    }

}