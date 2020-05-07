import { SvgPathUtils } from "../../../../utils/svgPath.utils"
import { gridModel } from "../../grid.model"
import { globalConfig as gc } from "../../../../config/global.config"

class LinkNamePositioner {
    constructor(query) {
        this.svgD = query.svgD
        this.element = query.element
        this.linkKey = query.linkKey
    }
    getOptimalPosition() {
        const middleSvgPathItems = this.getMiddleSvgPathItems(this.svgD)
        const { optimalLeft, optimalTop } = this.getOptimalPositionCases(middleSvgPathItems)

        if (!optimalLeft && !optimalTop)
            return this.getOptimalPositionDefault(middleSvgPathItems)

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
                }
                else if (!this.hasCellByPositioning(pchck.hGoDown_left, pchck.hGoDown_top)) {
                    optimalLeft = pchck.hGoDown_left
                    optimalTop = pchck.hGoDown_top
                }
            }
            else if (hv === 'v') {
                if (!this.hasCellByPositioning(pchck.vGoLeft_left, pchck.vGoLeft_top)) {
                    optimalLeft = pchck.vGoLeft_left
                    optimalTop = pchck.vGoLeft_top
                }
                else if (!this.hasCellByPositioning(pchck.vGoRight_left, pchck.vGoRight_top)) {
                    optimalLeft = pchck.vGoRight_left
                    optimalTop = pchck.vGoRight_top
                }
            }

            if (!!optimalLeft && !!optimalTop) break
        }

        return { optimalLeft, optimalTop }
    }

    getOptimalPositionDefault(middleSvgPathItems) {
        const { element } = this

        let optimalLeft = 0, optimalTop = 0
        const { left, top, hv } = middleSvgPathItems[0]
        const pchck = this.buildPositioningChecker({ left, top, element })

        if (hv === 'h') {
            optimalLeft = pchck.hGoDown_left
            optimalTop = pchck.hGoDown_top - 5
        }
        else if (hv === 'v') {
            optimalLeft = pchck.vGoRight_left
            optimalTop = pchck.vGoRight_top
        }

        return { optimalLeft, optimalTop }
    }

    buildPositioningChecker(query) {
        const { left, top, element } = query
        const rect = element.getBoundingClientRect()

        const hGoUp_left = left - rect.width / 2
        const hGoUp_top = top - rect.height - 10
        
        const hGoDown_left = left - rect.width / 2
        const hGoDown_top = top + 10

        /////////////////////////////////////
        
        const vGoLeft_left = left - rect.width - 10
        const vGoLeft_top = top - rect.height / 2
        
        const vGoRight_left = left + 10
        const vGoRight_top = top - rect.height / 2

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
        return this.createPositioningSvgPathItems({ svgPathItems, svgPathMapSliced, svgPathMap })
    }
    createOrderedSvgPathItems(query) {
        const { svgPathMapSliced } = query
        const centerIndex = Math.floor(svgPathMapSliced.length / 2)
        const svgPathItems = []

        let i = centerIndex, increment = 0, goRight = true
        while (increment <= svgPathMapSliced.length) {
            increment++

            if (svgPathMapSliced[i]) {
                svgPathItems.push(svgPathMapSliced[i])
                goRight ? i += increment : i -= increment
                goRight = !goRight
                continue
            }

            const lastItem = svgPathMapSliced.find(item => !svgPathItems.includes(item))
            if (lastItem) svgPathItems.push(lastItem)
        }

        return svgPathItems
    }
    createPositioningSvgPathItems(query) {
        const { svgPathItems, svgPathMapSliced, svgPathMap } = query

        const indexArrForDeletion = []
        for (const svgPathItem of svgPathItems) {
            
            const isTooSmallDistance = Math.abs(svgPathItem.distance) <= gc.gridCellWidth / 2
            const hasTooLittleItems = svgPathItems.length <= 2

            if (svgPathItem.direction === 'h' && isTooSmallDistance  && !hasTooLittleItems) {
                indexArrForDeletion.push(svgPathItems.indexOf(svgPathItem))
                continue
            }

            const index = svgPathMapSliced.indexOf(svgPathItem) + 2
            const svgPathMapClone = svgPathMap.slice(0, index + 1)

            const svgPathMapCloneLastItem = svgPathMapClone[svgPathMapClone.length - 1]
            svgPathMapCloneLastItem.distance /= 2

            const svgDclone = SvgPathUtils.generateSvgD(svgPathMapClone)
            Object.assign(svgPathItem, SvgPathUtils.getM(svgDclone))
        }

        indexArrForDeletion.forEach(index => {
            svgPathItems.splice(index, 1)
        })

        return svgPathItems.map(item => ({
            top: item.svgTop,
            left: item.svgLeft,
            hv: item.direction,
        }))
    }
    get svgEl() {
        return document.querySelector('svg')
    }
}

globalThis.LinkNamePositioner = LinkNamePositioner
export { LinkNamePositioner }
