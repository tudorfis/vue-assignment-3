import { SvgPathUtils } from "../../../../utils/svgPath.utils"
import { gridModel } from "../../grid.model"
import { globalConfig as gc } from "../../../../config/global.config"

class LinkNamePositioner {
    constructor(query) {
        this.svgD = query.svgD
        this.element = query.element
        this.linkKey = query.linkKey
        this.defaultPathItem = null
    }
    getOptimalPosition() {
        const middleSvgPathItems = this.getMiddleSvgPathItems(this.svgD)
        const { optimalLeft, optimalTop } = this.getOptimalPositionCases(middleSvgPathItems)
        
        if (!optimalLeft && !optimalTop)
            return this.getOptimalPositionDefault(this.svgD)
        
        return { optimalLeft, optimalTop }
    }
    getOptimalPositionCases(middleSvgPathItems) {
        const { element } = this

        let optimalLeft = 0, optimalTop = 0
        for (const { left, top, hv } of middleSvgPathItems) {
            const pchck = this.buildPositioningChecker({ left, top, element })
            
            if (hv === 'h') {
                if (!this.hasCellByPositioning(pchck.hGoUp_left, pchck.hGoUp_top)) {
                    optimalLeft = pchck.hGoUp_left
                    optimalTop = pchck.hGoUp_top
                    element.style.textAlign = 'center'
                }
                else if (!this.hasCellByPositioning(pchck.hGoDown_left, pchck.hGoDown_top)) {
                    optimalLeft = pchck.hGoDown_left
                    optimalTop = pchck.hGoDown_top
                    element.style.textAlign = 'center'
                }
            }
            else if (hv === 'v') {
                if (!this.hasCellByPositioning(pchck.vGoLeft_left, pchck.vGoLeft_top)) {
                    optimalLeft = pchck.vGoLeft_left
                    optimalTop = pchck.vGoLeft_top
                    element.style.textAlign = 'right'
                }
                else if (!this.hasCellByPositioning(pchck.vGoRight_left, pchck.vGoRight_top)) {
                    optimalLeft = pchck.vGoRight_left
                    optimalTop = pchck.vGoRight_top
                    element.style.textAlign = 'left'
                }
            }

            if (!!optimalLeft && !!optimalTop) break
        }

        return { optimalLeft, optimalTop }
    }

    getOptimalPositionDefault(svgD) {
        const svgPathMap = SvgPathUtils.getPathMap(svgD)
        const { element } = this
        const areElementsCloseToEachOther = svgPathMap.length === 4
        
        let optimalLeft = 0, optimalTop = 0
        const { left, top, hv } = this.defaultPathItem
        const pchck = this.buildPositioningChecker({ left, top, element })

        if (hv === 'h') {
            optimalLeft = pchck.hGoDown_left
            optimalTop = pchck.hGoDown_top - 5
            element.style.textAlign = 'center'
            element.style.display = areElementsCloseToEachOther ? 'none' : 'block'
        }
        else if (hv === 'v') {
            optimalLeft = pchck.vGoRight_left
            optimalTop = pchck.vGoRight_top
            element.style.textAlign = 'left'
        }

        return { optimalLeft, optimalTop }
    }

    buildPositioningChecker(query) {
        const { left, top, element } = query
        const rect = element.getBoundingClientRect()

        const hGoUp_left = Math.floor(left - rect.width / 2)
        const hGoUp_top = Math.floor(top - rect.height - 10)
        
        const hGoDown_left = Math.floor(left - rect.width / 2)
        const hGoDown_top = Math.floor(top + 10)

        /////////////////////////////////////
        
        const vGoLeft_left = Math.floor(left - rect.width - 10)
        const vGoLeft_top = Math.floor(top - rect.height / 2)
        
        const vGoRight_left = Math.floor(left + 10)
        const vGoRight_top = Math.floor(top - rect.height / 2)

        return { hGoUp_left, hGoUp_top, hGoDown_left, hGoDown_top,
            vGoLeft_left, vGoLeft_top,  vGoRight_left, vGoRight_top }
    }

    hasCellByPositioning(left, top) {
        const svgRect = this.svgEl.getBoundingClientRect()

        const searchLeft = svgRect.left + left
        const searchTop = svgRect.top + top
        
        if (isNaN(searchLeft) || isNaN(searchTop)) return true

        const gridcell = document.elementFromPoint(searchLeft, searchTop)
        const isValidGridcell = gridcell && gridcell.classList.contains('gridcell')

        if (isValidGridcell) {
            const position = gridcell.__vue__.$options.propsData['position']
            return gridModel.model.cells[position].is
        }

        return true
    }

    getMiddleSvgPathItems(svgD) {
        const svgPathMap = SvgPathUtils.getPathMap(svgD)
        const svgPathMapSliced = svgPathMap.slice(2)
        
        const svgPathItems = this.createOrderedSvgPathItems({ svgPathMapSliced })
        return this.createPositioningSvgPathItems({ svgPathItems, svgPathMap })
    }
    createOrderedSvgPathItems(query) {
        const { svgPathMapSliced } = query

        svgPathMapSliced.sort(function(a, b) {
            var distanceA = Math.abs(a.distance),
                distanceB = Math.abs(b.distance)

            if (distanceA > distanceB) return -1
            if (distanceA < distanceB) return 1

            return 0
        })

        return svgPathMapSliced
    }
    createPositioningSvgPathItems(query) {
        const { svgPathItems, svgPathMap } = query
        const newPathItems = []
        
        for (const svgPathItem of svgPathItems) {
            const isTooSmallDistanceH = Math.abs(svgPathItem.distance) <= gc.gridCellWidth / 2
            const isTooSmallDistanceV = Math.abs(svgPathItem.distance) <= gc.gridCellHeight / 2
            
            let shouldIgnoreItem = svgPathItem.direction === 'h' && isTooSmallDistanceH
            shouldIgnoreItem |= svgPathItem.direction === 'v' && isTooSmallDistanceV
            
            const hasTooLittleItems = svgPathItems.length <= 2

            if (shouldIgnoreItem || hasTooLittleItems) {
                continue
            }

            let svgPathMapClone = Utils.deepclone(svgPathMap)

            const index = svgPathMap.indexOf(svgPathItem)
            const svgPathMapHandle = svgPathMapClone.slice(0, index + 1)

            const svgPathMapHandleLastItem = svgPathMapHandle[svgPathMapHandle.length - 1]
            svgPathMapHandleLastItem.distance /= 2

            const svgDclone = SvgPathUtils.generateSvgD(svgPathMapHandle)
            newPathItems.push({
                ...SvgPathUtils.getM(svgDclone), 
                hv: svgPathMapHandleLastItem.direction
            })
        }

        const svgPathMapClone = Utils.deepclone(svgPathMap)
        const svgDclone = SvgPathUtils.generateSvgD(svgPathMapClone.slice(0, 3))

        this.defaultPathItem = [{
            ...SvgPathUtils.getM(svgDclone), 
            hv: svgPathMapClone[2].direction
        }].map(item => ({
            top: item.svgTop,
            left: item.svgLeft,
            hv: item.hv
        }))[0]

        const result = newPathItems.map(item => ({
            top: item.svgTop,
            left: item.svgLeft,
            hv: item.hv
        }))

        return result
    }

    get svgEl() {
        return document.querySelector('svg')
    }
}

globalThis.LinkNamePositioner = LinkNamePositioner
export { LinkNamePositioner }
