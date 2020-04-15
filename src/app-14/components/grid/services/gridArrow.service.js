import { globalConfig } from '../../../config/global.config'
import { VueUtils } from '../../../utils/vue.utils'
import { gridModel } from '../../../models/grid/grid.model'
import { LinkDrawHelper } from '../../../models/grid/helpers/linkDraw.helper'
import { gridLinksOperations } from '../../../models/grid/operations/gridLinks.operations'
import { gridPanService } from './gridPan.service'

export const gridArrowService = {
    arrowConnectorId: '#arrow-connector',
    startedDrag: false,
    startedPosition: '',
    currentPosition: '',
    gridcell: null,
    linkKey: '',
    isHighlight: false,
    recentLink: false,
    showOtherIcons: false,
    
    get hasCell() {
        return this.gridcell.__vue__.$options.propsData.cell.is
    },
    get sameCell() {
        return this.startedPosition === this.currentPosition
    },
    get position() {
        return this.gridcell.__vue__.$options.propsData.position
    },
    get gridcellElement() {
        return this.gridcell.__vue__.$refs['gridcellelement'].$el
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
        const arrowConnector = document.querySelector(this.arrowConnectorId)

        const adjust = Math.floor(globalConfig.gridCellElementWidth / 2)
        const rect = this.gridcell.getBoundingClientRect()

        const top = rect.top + rect.height - adjust - 3
        const left = rect.left + rect.width - adjust + 3
        const fontSize = Math.floor(globalConfig.gridCellElementWidth / 4)

        arrowConnector.style.display = `block`
        arrowConnector.style.top = `${top}px`
        arrowConnector.style.left = `${left}px`
        arrowConnector.style.fontSize = `${fontSize}px`

        this.gridcellElement.append(arrowConnector)
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
            delete gridModel.paths[this.linkKey]
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
        document.querySelector('#arrow-connector').style.display = `none`
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

            gridModel.saveModel()
        }
        else  {
            this.startedDrag = false
            this.removeTempPaths()
            this.hideArrowConnector()
        }

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
    },
    doGridcellOperations(position) {
        this.currentPosition = position
        
        if (this.startedDrag)
            this.removeTempPaths()
    }
}