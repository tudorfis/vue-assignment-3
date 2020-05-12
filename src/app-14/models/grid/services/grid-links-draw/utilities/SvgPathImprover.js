import { SvgPathUtils } from '../../../../../utils/svgPath.utils'

class SvgPathImprover {
    constructor(svgDrawArrow) {
        this.svgDrawArrow = svgDrawArrow
    }
    improvePath(svgD) {
        const svgPathMap = SvgPathUtils.getPathMap(svgD)
        
        let currentItem, indexesForDeletion = []
        for (let i = 3; i < svgPathMap.length; i++) {
            if (currentItem && svgPathMap[i].direction === currentItem.direction) {
                currentItem.distance += svgPathMap[i].distance
                indexesForDeletion.push(i)
                
                continue
            }
            
            currentItem = svgPathMap[i]
        }

        while (indexesForDeletion.length) {
            svgPathMap.splice(indexesForDeletion.pop(), 1)
        }

        return SvgPathUtils.generateSvgD(svgPathMap)
    }

    improveEdges(path) {
        const { svgDrawArrow } = this
        const { arrowPointerAdjust } = svgDrawArrow.getArrowPointers()
        const { col2, row2 } = svgDrawArrow.lh
        const svgPathMap = SvgPathUtils.getPathMap(path.svgD)
        
        if (col2 !== 1 && row2 !== 1) return path.svgD

        for (let i = 3; i < svgPathMap.length; i++) {
            const svgD = SvgPathUtils.generateSvgD(svgPathMap.slice(0, i + 1))
            
            const { svgLeft, svgTop } = SvgPathUtils.getM(svgD)
            const isOnEdge = (col2 === 1 && svgLeft === 0) || (row2 === 1 && svgTop === 0)

            if (isOnEdge)  {
                svgPathMap[i].distance += arrowPointerAdjust
            }
        }

        return SvgPathUtils.generateSvgD(svgPathMap)
    }
    
    get linkKey() {
        return this.svgDrawArrow.lh.linkKey
    }
}

export { SvgPathImprover }