import { SvgPathUtils } from '../../../../../utils/svgPath.utils'
import { LinkHelper } from '../../../helpers/link.helper'

class SvgPathAdjuster {
    constructor(svgDrawArrow) {
        this.svgDrawArrow = svgDrawArrow
    }
    adjustArrowPath(path, direction, difference_ee) {
        const { svgLeft, svgTop } = this.getCurrentSvgLeftTop(path, direction)
        const { svgCorrectLeft, svgCorrectTop } = this.getBestSvgArrowLeftTop(direction, difference_ee)
        const svgPathMap = SvgPathUtils.getPathMap(path.svgD)

        if (this.isStraightLine(svgPathMap) && this.isOverlapLine(direction)) {
            if (svgTop !== svgCorrectTop) svgPathMap[1] = svgCorrectTop
            else if (svgLeft !== svgCorrectLeft) svgPathMap[0] = svgCorrectLeft
        }
        else {
            if (svgTop !== svgCorrectTop) {
                const vDiff = Math.max(svgTop, svgCorrectTop) - Math.min(svgTop, svgCorrectTop)
                const vItem = svgPathMap.slice(3).reverse().find(item => item.direction && item.direction === 'v')
                
                if (vItem) {
                    if (svgTop > svgCorrectTop) vItem.distance -= vDiff
                    else vItem.distance += vDiff
                }
            }
    
            if (svgLeft !== svgCorrectLeft) {
                const hDiff = Math.max(svgLeft, svgCorrectLeft) - Math.min(svgLeft, svgCorrectLeft)
                const hItem = svgPathMap.slice(3).reverse().find(item => item.direction && item.direction === 'h')
                
                if (hItem) {
                    if (svgLeft > svgCorrectLeft) hItem.distance -= hDiff
                    else hItem.distance += hDiff
                }
            }
        }

        if (svgTop !== svgCorrectTop || svgLeft !== svgCorrectLeft)
            path.svgD = SvgPathUtils.generateSvgD(svgPathMap)
    }

    getCurrentSvgLeftTop(path, direction) {
        const { svgDrawArrow } = this
        
        const svgD = svgDrawArrow.getSvgD(direction)
        const { cellelement_center_size } = svgDrawArrow.getCellsSizes(direction)

        return SvgPathUtils.getM(path.svgD + ` ${svgD}${cellelement_center_size}`)
    }
    getBestSvgArrowLeftTop(direction, difference_ee) {
        const { svgDrawArrow } = this
        
        const arrowDirection = LinkHelper.getOpositeDirection(direction)
        const { linkKey } = svgDrawArrow.lh

        const tempLh = svgDrawArrow.lh
        svgDrawArrow.lh = new LinkHelper(linkKey, true)

        let svgCorrectLeft, svgCorrectTop

        if (arrowDirection === 'up') {
            svgCorrectLeft = svgDrawArrow.horizontal_M + svgDrawArrow.cell_center_size_width - difference_ee
            svgCorrectTop =  svgDrawArrow.vertical_M + svgDrawArrow.cellelement_center_size_height
        }
        else if (arrowDirection === 'down') {
            svgCorrectLeft = svgDrawArrow.horizontal_M + svgDrawArrow.cell_center_size_width - difference_ee
            svgCorrectTop =  svgDrawArrow.vertical_M + (svgDrawArrow.cell_size_height - svgDrawArrow.cellelement_center_size_height)
        }
        else if (arrowDirection === 'left') {
            svgCorrectLeft = svgDrawArrow.horizontal_M + svgDrawArrow.cellelement_center_size_width
            svgCorrectTop =  svgDrawArrow.vertical_M + svgDrawArrow.cell_center_size_height - difference_ee
        }
        else if (arrowDirection === 'right') {
            svgCorrectLeft = svgDrawArrow.horizontal_M + (svgDrawArrow.cell_size_width - svgDrawArrow.cellelement_center_size_width)
            svgCorrectTop =  svgDrawArrow.vertical_M + svgDrawArrow.cell_center_size_height - difference_ee
        }

        svgDrawArrow.lh = tempLh
        return { svgCorrectLeft, svgCorrectTop }
    }

    isOverlapLine(direction) {
        const { svgDrawArrow } = this

        const eeMapOut = linkEEMapHelper.eeMap[svgDrawArrow.lh.link1][direction].out[svgDrawArrow.lh.link2]
        const eeMapIn = linkEEMapHelper.eeMap[svgDrawArrow.lh.link2][LinkHelper.getOpositeDirection(direction)].in[svgDrawArrow.lh.link1]
        
        return eeMapIn > eeMapOut
    }
    isStraightLine(svgPathMap) {
        const hItems = svgPathMap.filter(item => item.direction && item.direction === 'h') || []
        const vItems = svgPathMap.filter(item => item.direction && item.direction === 'v') || []
        
        return (hItems.length && !vItems.length) || (vItems.length && !hItems.length)
    }

    adjustForHideHead(query) {
        const { path, direction, difference_ee } = query

        const svgPathMap = SvgPathUtils.getPathMap(path.svgD)
        const lastItem = svgPathMap[svgPathMap.length - 1]

        const { svgLeft, svgTop } = SvgPathUtils.getM(path.svgD)
        const { svgCorrectLeft, svgCorrectTop } = this.getBestSvgArrowLeftTop(direction, difference_ee)

        if (svgTop !== svgCorrectTop && lastItem.direction === 'v') {
            const diff = Math.max(svgTop, svgCorrectTop) - Math.min(svgTop, svgCorrectTop)

            if (svgTop < svgCorrectTop) lastItem.distance += diff
            else lastItem.distance -= diff
        }
        else if (svgLeft !== svgCorrectLeft && lastItem.direction === 'h') {
            const diff = Math.max(svgLeft, svgCorrectLeft) - Math.min(svgLeft, svgCorrectLeft)

            if (svgLeft < svgCorrectTop) lastItem.distance -= diff
            else lastItem.distance -= diff
        }

        return SvgPathUtils.generateSvgD(svgPathMap)
    }
}

export { SvgPathAdjuster }