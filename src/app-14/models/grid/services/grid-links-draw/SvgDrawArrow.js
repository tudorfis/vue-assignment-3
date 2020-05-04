import { globalConfig } from '../../../../config/global.config'
import { SvgPathUtils } from '../../../../utils/svgPath.utils'
import linkEEMapHelper from '../../helpers/link-ee/linkEEMap.helper'
import { LinkHelper } from '../../helpers/link.helper'
import { SvgDrawBase } from './SvgDrawBase'

class SvgDrawArrow extends SvgDrawBase {
    constructor(lh) {
        super(lh)
    }
    drawArrow(path, direction)  {
        this.adjustArrowPath(path, direction)
        const difference_ee = linkEEMapHelper.createEEDifferenceForArrow(this.lh, direction)

        if (!!difference_ee) 
            this.adjustArrowPathWithDifferenceEE(path, difference_ee)

        const { svgLeft, svgTop } = SvgPathUtils.getM(path.svgD)
        const arrowDraw = this[`${direction}ArrowDraw`]

        return {
            isArrow: true,
            svgD: `M${svgLeft} ${svgTop} ${arrowDraw}`
        }
    }

    adjustArrowPath(path, direction) {
        const { svgLeft, svgTop } = this.getCurrentSvgLeftTop(path, direction)
        const { svgArrowLeft, svgArrowTop } = this.getBestSvgArrowLeftTop(direction)        
        
        this.handleMisplacementOfSvgPath({ path, svgArrowLeft, svgArrowTop, svgLeft, svgTop })
        this.handleRemainingDistance(path, direction)
    }
    getCurrentSvgLeftTop(path, direction) {
        const svgD = this.getSvgD(direction)
        return SvgPathUtils.getM(path.svgD + ` ${svgD}${this.cellelement_center_size}`)
    }
    getBestSvgArrowLeftTop(direction) {
        const arrowDirection = LinkHelper.getOpositeDirection(direction)
        const { linkKey } = this.lh

        const tempLh = this.lh
        this.lh = new LinkHelper(linkKey, true)

        let svgArrowLeft, svgArrowTop
        if (arrowDirection === 'up') {
            svgArrowLeft = this.horizontal_M + this.cell_center_size
            svgArrowTop =  this.vertical_M + this.cellelement_center_size
        }
        else if (arrowDirection === 'down') {
            svgArrowLeft = this.horizontal_M + this.cell_center_size
            svgArrowTop =  this.vertical_M + (this.cell_size - this.cellelement_center_size)
        }
        else if (arrowDirection === 'left') {
            svgArrowLeft = this.horizontal_M + this.cellelement_center_size
            svgArrowTop =  this.vertical_M + this.cell_center_size
        }
        else if (arrowDirection === 'right') {
            svgArrowLeft = this.horizontal_M + (this.cell_size - this.cellelement_center_size)
            svgArrowTop =  this.vertical_M + this.cell_center_size
        }

        this.lh = tempLh
        return { svgArrowLeft, svgArrowTop }
    }
    handleMisplacementOfSvgPath(query) {
        const { path, svgArrowLeft, svgArrowTop, svgLeft, svgTop } = query
        const hasMisplacement = svgLeft !== svgArrowLeft || svgTop !== svgArrowTop

        if (hasMisplacement) {
            const svgPathMap = SvgPathUtils.getPathMap(path.svgD)
            const lastSvgPathMapItem = svgPathMap[svgPathMap.length - 1]
            const hv = lastSvgPathMapItem.direction

            if (svgTop !== svgArrowTop && hv === 'v') {
                if (svgArrowTop > svgTop) lastSvgPathMapItem.distance += svgArrowTop - svgTop
                else lastSvgPathMapItem.distance -= svgTop - svgArrowTop
            }
            if (svgLeft !== svgArrowLeft && hv === 'h') {
                if (svgArrowLeft > svgLeft) lastSvgPathMapItem.distance += svgArrowLeft - svgLeft
                else lastSvgPathMapItem.distance -= svgLeft - svgArrowLeft
            }

            this.handleMisplacementOfSvgPathComplex({ svgLeft, svgArrowLeft, hv, svgPathMap, svgTop, svgArrowTop })
            path.svgD = SvgPathUtils.generateSvgD(svgPathMap)
        }
    }
    handleMisplacementOfSvgPathComplex(query) {
        const { svgLeft, svgArrowLeft, hv, svgPathMap, svgTop, svgArrowTop } = query
        function handleDistanceRecalculation(svgCurrent, svgArrow, hv, hvCompare) {
            if (svgCurrent !== svgArrow && hv === 'v') {
                let prelastSvgPathMapItem, i = 2
                while (svgPathMap[svgPathMap.length - i]) {
                    prelastSvgPathMapItem = svgPathMap[svgPathMap.length - i]
                    if (svgPathMap[svgPathMap.length - i].direction !== hvCompare) i++
                    break
                }
    
                if (!prelastSvgPathMapItem || !prelastSvgPathMapItem.distance) return
    
                if (svgArrow > svgCurrent) prelastSvgPathMapItem.distance += svgArrow - svgLeft
                else prelastSvgPathMapItem.distance -= svgLeft - svgArrow
            }
        }
        handleDistanceRecalculation(svgLeft, svgArrowLeft, 'v', 'h')
        handleDistanceRecalculation(svgTop, svgArrowTop, 'h', 'v')
    }
    handleRemainingDistance(path, direction) {
        const { row1, col1 } = this.lh
        let adjustForGridEdges = 0

        if (direction === 'down') {
            adjustForGridEdges = (row1 === 1 ? -5 : 0)
        }
        else if (direction === 'right') {
            adjustForGridEdges = (col1 === 1 ? -5 : 0)
        }

        const svgD = this.getSvgD(direction)
        const distance = this.cellelement_center_size - this.arrow_width + 3 + adjustForGridEdges

        path.svgD += ` ${svgD}${distance}`
    }

    adjustArrowPathWithDifferenceEE(path, difference_ee) {
        let svgPathMap = SvgPathUtils.getPathMap(path.svgD)    
            
        const { totalDistance, itemsCounted, hvDirection } = this.getSvgPathMapTotalDistanceAndItemsCounted(svgPathMap)
        this.handleNewSvgPathWithDifferenceEE({ path, svgPathMap, difference_ee, itemsCounted, totalDistance, hvDirection })
    }
    getSvgPathMapTotalDistanceAndItemsCounted(svgPathMap) {
        const svgPathMapArr = svgPathMap.slice(2).reverse()
        let hvDirection = svgPathMapArr[0].direction, 
            totalDistance = 0,
            itemsCounted = 0

        for (const item of svgPathMapArr) {
            if (hvDirection !== item.direction) break

            totalDistance += item.distance
            itemsCounted++
        }

        return { totalDistance, itemsCounted, hvDirection }
    }
    handleNewSvgPathWithDifferenceEE(query) {
        const { path, difference_ee, itemsCounted, totalDistance, hvDirection } = query

        let { svgPathMap } = query
        svgPathMap = svgPathMap.slice(0, -itemsCounted)

        if (svgPathMap.length === 2) return
        
        const lastSvgPathMapItem = svgPathMap[svgPathMap.length - 1]
        if (!lastSvgPathMapItem) return
        
        lastSvgPathMapItem.distance -= difference_ee
        
        svgPathMap.push({
            direction: hvDirection,
            distance: totalDistance
        })

        path.svgD = SvgPathUtils.generateSvgD(svgPathMap)
    }

    get downArrowDraw() { 
        const { arrowPointerHeight, arrowPointerWidth } = globalConfig
        return `h${arrowPointerHeight} l-${arrowPointerHeight} ${arrowPointerWidth} l-${arrowPointerHeight} -${arrowPointerWidth} Z`
    }
    get upArrowDraw() { 
        const { arrowPointerHeight, arrowPointerWidth } = globalConfig
        return `h${arrowPointerHeight} l-${arrowPointerHeight} -${arrowPointerWidth} l-${arrowPointerHeight} ${arrowPointerWidth} Z`
    }
    get rightArrowDraw() { 
        const { arrowPointerHeight, arrowPointerWidth } = globalConfig
        return `v-${arrowPointerHeight} l${arrowPointerWidth} ${arrowPointerHeight} l-${arrowPointerWidth} ${arrowPointerHeight} Z`
    }
    get leftArrowDraw() { 
        const { arrowPointerHeight, arrowPointerWidth } = globalConfig
        return `v-${arrowPointerHeight} l-${arrowPointerWidth} ${arrowPointerHeight} l${arrowPointerWidth} ${arrowPointerHeight} Z`
    }
}

globalThis.SvgDrawArrow = SvgDrawArrow
export { SvgDrawArrow }
