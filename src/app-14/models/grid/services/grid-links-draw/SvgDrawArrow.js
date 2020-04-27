import { globalConfig } from '../../../../config/global.config'
import { SvgPathUtils } from '../../../../utils/svgPath.utils'

class SvgDrawArrow {
    drawArrow(svgD, direction)  {
        const M = SvgPathUtils.getM(svgD)
        const arrowDraw = this[`${direction}ArrowDraw`]

        return {
            isArrow: true,
            svgD: `${M} ${arrowDraw}`
        }
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
