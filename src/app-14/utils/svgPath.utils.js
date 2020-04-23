
class SvgPathUtils {
    static getM(svgD) {
        const svgPathMap = SvgPathUtils.getPathMap(svgD)

        const Mleft = SvgPathUtils.getMLeft(svgPathMap)
        const Mtop = SvgPathUtils.getMTop(svgPathMap)

        return `M${Mleft} ${Mtop}`
    }
    static getPathMap(svgD) {
        return svgD.split(' ').map(item => {
            if (item.includes('M'))
                return Number(item.replace('M', ''))
            
            else if (item.includes('h'))
                return { direction: 'h', distance: Number(item.replace('h', '')) }

            else if (item.includes('v'))
                return { direction: 'v', distance: Number(item.replace('v', '')) }
            
            else return Number(item)
        })
    }
    static getMLeft(svgPathMap) {
        return svgPathMap
            .filter(item => item.direction === 'h')
            .reduce((total, item) => total + item.distance, svgPathMap[0])
    }
    static getMTop(svgPathMap) {
        return svgPathMap
            .filter(item => item.direction === 'v')
            .reduce((total, item) => total + item.distance, svgPathMap[1])
    }
}

globalThis.SvgPathUtils = SvgPathUtils
export { SvgPathUtils }
