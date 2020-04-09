import { gridArrowService } from "./gridArrow.service"
import { globalConfig } from "../../../config/global.config"
import { gridModel } from "../../../models/grid/grid.model"
import { toolboxService } from "../../toolbox/services/toolbox.service"

export const gridDeleteService = {
    svgEl: null,
    gridlayoutEl: null,
    arrowDeleteEl: null,
    waitMousemove: false,
    waitMousemoveTimeout: null,
    linkKey: '',

    findSvgPath(event) {
        if (!this.arrowDeleteEl)
            this.arrowDeleteEl = document.querySelector('#arrow-delete')

        if (this.waitMousemove || gridArrowService.startedDrag || toolboxService.startedDrag) return

        if (event.target.classList.contains('gridcell')) {
            const el = this.getSvgPath(event)
            if (el)
                this.build(el, event)
            else {
                this.hideArrowDelete()
            }
        }

        const vm = this
        this.waitMousemove = true;
        this.waitMousemoveTimeout = setTimeout(function () { vm.waitMousemove = false; }, 0);
    },
    getSvgPath(event) {
        this.svgEl.style.zIndex = 2
        this.gridlayoutEl.style.zIndex = 1

        const el = document.elementFromPoint(event.pageX, event.pageY);

        this.svgEl.style.zIndex = 1
        this.gridlayoutEl.style.zIndex = 2

        if (el && el.constructor === SVGPathElement)
            return el

        return null
    },
    build(el, event) {
        this.linkKey = el.getAttribute('linkKey')
        const adjust = Math.floor(globalConfig.gridCellElementWidth / 4)

        this.arrowDeleteEl.style.display = `block`
        this.arrowDeleteEl.style.fontSize = `${adjust}px`

        this.arrowDeleteEl.style.width = `${adjust}px`
        this.arrowDeleteEl.style.height = `${adjust}px`
        this.arrowDeleteEl.style.borderRadius = `${adjust}px`
        this.arrowDeleteEl.querySelector('i').style.top = `-${Math.round(adjust / 3.3)}px`

        const rect = this.arrowDeleteEl.getBoundingClientRect()
        this.arrowDeleteEl.style.top = `${event.pageY - Math.ceil(rect.height / 2)}px`
        this.arrowDeleteEl.style.left = `${event.pageX - Math.floor(rect.width / 2)}px`
    },
    deleteLink() {
        const index = gridModel.model.links.indexOf(this.linkKey)
        Vue.delete(gridModel.model.links, index)
        
        gridModel.buildLinks()

        this.linkKey = ''
        this.waitMousemove = false
        this.hideArrowDelete()
    },
    hideArrowDelete() {
        if (!this.arrowDeleteEl)
            this.arrowDeleteEl = document.querySelector('#arrow-delete')

        this.arrowDeleteEl.style.display = 'none'    
    }
}