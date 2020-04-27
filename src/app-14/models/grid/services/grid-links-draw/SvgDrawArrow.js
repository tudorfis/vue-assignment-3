import { globalConfig as gc } from '../../../../config/global.config'
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
        return `h${gc.arrowPointerHeight} l-${gc.arrowPointerHeight} ${gc.arrowPointerWidth} l-${gc.arrowPointerHeight} -${gc.arrowPointerWidth} Z`
    }
    get upArrowDraw() { 
        return `h${gc.arrowPointerHeight} l-${gc.arrowPointerHeight} -${gc.arrowPointerWidth} l-${gc.arrowPointerHeight} ${gc.arrowPointerWidth} Z`
    }
    get rightArrowDraw() { 
        return `v-${gc.arrowPointerHeight} l${gc.arrowPointerWidth} ${gc.arrowPointerHeight} l-${gc.arrowPointerWidth} ${gc.arrowPointerHeight} Z`
    }
    get leftArrowDraw() { 
        return `v-${gc.arrowPointerHeight} l-${gc.arrowPointerWidth} ${gc.arrowPointerHeight} l${gc.arrowPointerWidth} ${gc.arrowPointerHeight} Z`
    }
}

globalThis.SvgDrawArrow = SvgDrawArrow
export { SvgDrawArrow }
