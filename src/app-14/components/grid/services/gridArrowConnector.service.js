import { DimensionsConfigEnum } from "../../../config/dimensions/DimensionsConfigEnum"
import { globalConfig as gc } from "../../../config/global.config"
import { gridModel } from "../../../models/grid/grid.model"
import { LinkHelper } from "../../../models/grid/helpers/link.helper"
import { linkPathDragHelper } from "../../../models/grid/helpers/linkPathDrag.helper"
import { gridLinksBuilderService } from "../../../models/grid/services/grid-links/gridLinksBuilder.service"
import { gridHistoryService } from "../../../models/grid/services/gridHistory.service"
import { VueUtils } from "../../../utils/vue.utils"
import { Utils } from "../../../utils/utils"
import { toolboxElementsEnum } from "../../toolbox/enum/toolboxElements.enum"
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
    
    isSplitNoDrag: false,
    isSplitYesDrag: false,

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
    get gridcellType() {
        if (!gridModel.model) return ''

        let invalid = !this.gridcell || !this.position
        invalid |= !gridModel.model.cells[this.position]
        
        if (invalid) return ''

        return gridModel.model.cells[this.position].type
    },
    get gridcellElement() {
        return this.gridcell.__vue__.$refs['gridcellelement'].$el
    },
    get arrowConnectorEl() {
        if (!this.selectorId)
            throw new Error('Please specificy a selectorId for gridArrowConnector service before initializing')

        return document.querySelector(`#${this.selectorId}`)
    },
    get arrowIconGeneral() {
        return document.querySelector(`#${this.selectorId} .icon-general`)
    },
    get arrowIconSplitYes() {
        return document.querySelector(`#${this.selectorId} .icon-split-yes`)
    },
    get arrowIconSplitNo() {
        return document.querySelector(`#${this.selectorId} .icon-split-no`)
    },
    get mathMedium() {
        return (gc.gridCellElementWidth + gc.gridCellElementHeight) / 2
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

        if (this.shouldHideArrowConnector) return
        this.setArrowConnectorStyles()    
    },

    get shouldHideArrowConnector() {
        let shouldHideArrowConnector = !this.hasCell || this.startedDrag
        shouldHideArrowConnector |= gridPanService.startedPan || this.hasSufficientLinkConnections

        return  shouldHideArrowConnector
    },

    get hasSufficientLinkConnections() {
        const links = Utils.deepclone(gridModel.model.links)
        const totalLinkConnections = links.reduce((total, linkKey) => {
            const match = linkKey.match(new RegExp(`^${this.position}`, 'g'))
            if (match) total++
            
            return total
        }, 0)

        const conditionForOtherBoxes = !this.isElementOfTypeSplit && totalLinkConnections >= Infinity
        const conditionForSplitBox = this.isElementOfTypeSplit && totalLinkConnections >= 2

        return conditionForOtherBoxes || conditionForSplitBox
    },

    get isElementOfTypeSplit() {
        return this.gridcellType === toolboxElementsEnum.SPLIT
    },

    setArrowConnectorStyles() {
        this.isElementOfTypeSplit ?
            this.hideGeneralShowSplitIcons() :
            this.showGeneralHideSplitIcons()

        this.setArrowConnectorStylesPositioning()
    },
    hideGeneralShowSplitIcons() {
        this.arrowIconGeneral.style.display = 'none'
        this.arrowIconSplitYes.style.display = 'block'
        this.arrowIconSplitNo.style.display = 'block'

        this.hideSplitIconYesOrNo()
    },
    hideSplitIconYesOrNo() {
        const linkAttributes = gridModel.getLinkAttributes(this.currentPosition)
        if (!linkAttributes.length) return

        if (linkAttributes[0].splitType === 'no') 
            this.arrowIconSplitNo.style.display = 'none'
        
        else if (linkAttributes[0].splitType === 'yes')
            this.arrowIconSplitYes.style.display = 'none'
    },
    showGeneralHideSplitIcons() {
        this.arrowIconGeneral.style.display = 'block'
        this.arrowIconSplitYes.style.display = 'none'
        this.arrowIconSplitNo.style.display = 'none'
    },
    setArrowConnectorStylesPositioning() {
        const adjust = Math.floor(this.mathMedium / 2)
        const rect = this.gridcell.getBoundingClientRect()

        let top, left, fontSize
        if (gc.dimensionType === DimensionsConfigEnum.SQUARE) {
            top = rect.top + rect.height - adjust - 3
            left = rect.left + rect.width - adjust + 3
            fontSize = Math.floor(this.mathMedium / 4)
        }
        else if (gc.dimensionType === DimensionsConfigEnum.RECTANGULAR) {
            top = rect.top + gc.gridCellElementHeight + 5
            left = rect.left + gc.gridCellElementWidth + 15
            fontSize = Math.floor(this.mathMedium / 5)
        }

        Object.assign(this.arrowConnectorEl.style, {
            display: `flex`,
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

            if (this.isCurrentLinkKeyNotSet)        
                linkPathDragHelper.handleFoundPotentialConnection()
        }
    },
    get isCurrentLinkKeyNotSet() {
        if (this.startedPosition && this.currentPosition && this.startedPosition !== this.currentPosition) {
            const linkKey = LinkHelper.getLinkKey(this.startedPosition, this.currentPosition)    

            return !gridModel.model.links.includes(linkKey)
        }

        return false
    },
    destroy() {
        this.removeTempPaths()
        this.dehighlightCell()

        if (!this.hasCell || this.startedDrag) return

        this.hideArrowConnector()
    },
    removeTempPaths() {
        if (this.linkKey && !this.recentLink) {
            
            delete gridLinksBuilderService.svgPaths[this.linkKey]
            this.linkKey = ''
        }
    },
    dehighlightCell() {
        if (!this.gridcell) return
        
        this.isHighlight = false
        this.gridcell.style.boxShadow = 'none'
        
        if (!this.recentLink)
            linkPathDragHelper.handleNoPotentialConnection()
        
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
            linkPathDragHelper.handleLinkConnected()
            linkPathDragHelper.deletePreviousSplitGridcellCase(true)
        }
        else  {
            this.startedDrag = false
            this.removeTempPaths()
            this.hideArrowConnector()
            linkPathDragHelper.deletePreviousSplitGridcellCase(false)
        }

        this.dehighlightCell()
        gridLinksBuilderService.buildLinks()
    },
    drawPath() {
        if (!this.startedDrag) return

        const start = this.startedPosition
        const end = this.currentPosition
        
        if (start === end) return
        
        const linkKey = LinkHelper.getLinkKey(start, end)
        if (this.linkKey === linkKey) return

        if (gridModel.model.links.includes(linkKey)) {
            this.isHighlight = false
            this.gridcell.style.boxShadow = 'none'
        }
        else {
            this.linkKey = linkKey
            gridLinksBuilderService.generateSvgPath(this.linkKey, true)
        }
    },
    doGridcellOperations(position) {
        this.currentPosition = position
        
        if (this.startedDrag)
            this.removeTempPaths()
    },

    get shouldRestoreEEMapState() {
        return !this.recentLink && this.startedDrag
    }
}