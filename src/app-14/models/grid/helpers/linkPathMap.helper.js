import { gridModel } from "../grid.model"
import { Utils } from "../../../utils/utils"
import { globalConfig } from "../../../config/global.config"
import linkEEMapHelper from "../helpers/linkEEMap.helper"

const linkPathMapHelper = {
    pathMap: {},

    getLinkKeys(position) {
        const output = []

        if (!this.pathMap[position]) return output
        const pathMapItem = this.pathMap[position]

        for (const linkKey of pathMapItem)
            output.push(linkKey)

        return output
    },

    generatePathMap() {
        const vm = this

        setTimeout(function(){
            vm.pathMap = {}
            vm.bringSvgElInFront()

            for (const row of Utils.rangeArray(1, gridModel.model.numRows)) {
                for (const col of Utils.rangeArray(1, gridModel.model.numCols)) {

                    const position = gridModel.getPosition(row, col)
                    if (gridModel.model.cells[position].is) continue

                    vm.handleGridIteration({ vm, position, row, col })
                }
            }

            vm.bringSvgElInBack()
        }, 0)
        
    },
    bringSvgElInFront() {
        this.svgEl.style.zIndex = '2'
        this.gridlayoutEl.style.zIndex = '1'
    },
    bringSvgElInBack() {
        this.svgEl.style.zIndex = '1'
        this.gridlayoutEl.style.zIndex = '2'
    },
    handleGridIteration(query) {
        const { vm, position, row, col } = query

        const svgRect = this.svgEl.getBoundingClientRect()
        const difference_ee = linkEEMapHelper.getDiffByPoint(2)
        
        for (const { x, y } of this.generateXYSearchArray({ svgRect, difference_ee, row, col }))
            this.createLinkKeyIfFound({ vm, position, x, y })
    },
    generateXYSearchArray(query) {
        const { svgRect, difference_ee, row, col } = query

        const x = svgRect.x + (globalConfig.gridCellWidth * col) - (globalConfig.gridCellWidth / 2)
        const y = svgRect.y + (globalConfig.gridCellHeight * row) - (globalConfig.gridCellHeight / 2)
        
        const output = []
        for (let diff_ee = -(difference_ee * 3); diff_ee <= (difference_ee * 3); diff_ee += difference_ee) {
            output.push({ x: x - (difference_ee * 3), y: y + diff_ee})
            output.push({ x: x + (difference_ee * 3), y: y + diff_ee})

            output.push({ y: y - (difference_ee * 3), x: x + diff_ee})
            output.push({ y: y + (difference_ee * 3), x: x + diff_ee})
        }

        return output
    },
    createLinkKeyIfFound(query) {
        const { vm, position, x, y } = query

        const el = document.elementFromPoint(x, y)
        if (!el || el.constructor !== SVGPathElement) return
        
        const linkKey = el.getAttribute('linkKey')
        
        if (!vm.pathMap[position])
        vm.pathMap[position] = new Set()
        
        vm.pathMap[position].add(linkKey)
    },
    

    get svgEl() {
        if (!this.svgElement)
            this.svgElement = document.querySelector('svg')
        
        return this.svgElement
    },

    get gridlayoutEl() {
        if (!this.gridlayoutElement)
            this.gridlayoutElement = document.querySelector('.gridlayout')
        
        return this.gridlayoutElement
    },
}

globalThis.linkPathMapHelper = linkPathMapHelper
export { linkPathMapHelper }
