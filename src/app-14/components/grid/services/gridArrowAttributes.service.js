import { globalConfig as gc } from "../../../config/global.config"
import { gridModel } from "../../../models/grid/grid.model"
import { gridHistoryService } from "../../../models/grid/services/gridHistory.service"
import { gridLinksBuilderService } from "../../../models/grid/services/grid-links/gridLinksBuilder.service"
import { toolboxDragService } from "../../toolbox/services/toolboxDrag.service"
import { gridArrowConnectorService } from "./gridArrowConnector.service"
import { gridPanService } from "./gridPan.service"
import { DimensionsConfigEnum } from "../../../config/dimensions/DimensionsConfigEnum"

const gridArrowAttributesService = {
    linkKey: '',
    isModalOpened: false,

    svgEl: null,
    gridlayoutEl: null,

    selectorId: '',
    gridArrowAttributesEl: null,
    
    waitMousemove: false,
    waitMousemoveTimeout: null,
    
    i: 0,
    top: 0,
    left: 0,

    findSvgPath(event) {
        if (this.shouldStopSearchingForSvgPath) return

        if (event.target.classList.contains('gridcell')) {
            const svgPath = this.getSvgPath(event)
            svgPath ? this.build(svgPath, event) : this.hideArrowAttributes()
        }

        const vm = this
        this.waitMousemove = true;
        this.waitMousemoveTimeout = setTimeout(function () { vm.waitMousemove = false; }, 0);
    },
    getSvgPath(event) {
        this.svgEl.style.zIndex = 2
        this.gridlayoutEl.style.zIndex = 1

        const x = event.pageX - this.htmlEl.scrollLeft
        const y = event.pageY - this.htmlEl.scrollTop

        let svgPath
        for (let i = -15; i <= 15; i++) {
            svgPath = document.elementFromPoint(x + i, y + i);
            if (svgPath && svgPath.constructor === SVGPathElement) {
                this.i = i
                break;
            }
        }

        this.svgEl.style.zIndex = 1
        this.gridlayoutEl.style.zIndex = 2

        if (svgPath && svgPath.constructor === SVGPathElement 
                && !svgPath.getAttribute('d').includes('Z'))
            return svgPath

        return null
    },
    build(svgPath, event) {
        this.setIconStyles()
        this.setTopLeft(svgPath, event)

        this.linkKey = svgPath.getAttribute('linkKey')
    },

    setIconStyles() {
        Object.assign(this.gridArrowAttributesEl.style, {
            display: `block`,
            fontSize: `${this.adjustMeasure}px`,
            width: `${this.adjustMeasure}px`,
            height: `${this.adjustMeasure}px`,
        })
        
        this.iconEl.style.top = `-${Math.round(this.adjustMeasure / 3.3)}px`
    },
    setTopLeft(svgPath, event) {
        if (svgPath.getAttribute('linkKey') !== this.linkKey || (!this.top && !this.left)) {
            this.top = event.pageY - this.htmlEl.scrollTop - this.adjustMeasure / 2
            this.left = event.pageX - this.htmlEl.scrollLeft - this.adjustMeasure / 2

            if (Math.sign(this.i) === -1) {
                this.top += this.i
                this.left += this.i + 1.5
            }
            else if (Math.sign(this.i) === 1) {
                this.top += this.i + 1.5
                this.left += this.i + 3
            }
        }

        Object.assign(this.gridArrowAttributesEl.style, {
            top: `${this.top}px`,
            left: `${this.left}px`
        })
    },
    deleteLink() {
        gridModel.deleteLink(this.linkKey)
        
        gridLinksBuilderService.buildLinks()
        gridHistoryService.saveState()
        
        this.linkKey = ''
        this.waitMousemove = false
        this.hideArrowAttributes()
    },
    hideArrowAttributes() {
        this.gridArrowAttributesEl.style.display = 'none'    
    },
    resetLeftTop() {
        this.left = 0
        this.top = 0
    },

    get mathMedium() {
        return (gc.gridCellElementWidth + gc.gridCellElementHeight) / 2
    },
    get gridArrowAttributesEl() {
        if (!this.selectorId)
            throw new Error('Please specificy a selectorId for gridArrowAttributes service before initializing')

        if (!this.mainElement)
            this.mainElement = document.querySelector(`#${this.selectorId}`)

        return this.mainElement
    },
    get adjustMeasure() {
        let adjustMeasure
        if (gc.dimensionType === DimensionsConfigEnum.SQUARE) {
            adjustMeasure = Math.floor(this.mathMedium / 4)
        }
        else if (gc.dimensionType === DimensionsConfigEnum.RECTANGULAR) {
            adjustMeasure = Math.floor(this.mathMedium / 5.5)
        }

        return adjustMeasure
    },
    get htmlEl() {
        return document.querySelector('html')
    },
    get iconEl() {
        return this.gridArrowAttributesEl.querySelector('i')
    },
    get shouldStopSearchingForSvgPath() {
        return this.waitMousemove || gridArrowConnectorService.startedDrag 
            || toolboxDragService.startedDrag || gridPanService.startedPan || this.isModalOpened
    },

    get linkAttribute() {
        if (!this.linkKey) return null

        return gridModel.getLinkAttribute(this.linkKey)
    }
}

globalThis.gridArrowAttributesService = gridArrowAttributesService
export { gridArrowAttributesService }
