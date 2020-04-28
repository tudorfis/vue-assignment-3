
import { SvgDrawPath } from '../SvgDrawPath'
import { SvgDrawArrow } from '../SvgDrawArrow'

class LinkDrawPathsBase {
    constructor(query) {
        for (const key in query)
            this[key] = query[key]

        this.svgDrawPath = new SvgDrawPath(this.lh)
        this.svgDrawArrow = new SvgDrawArrow()
    }
}

export { LinkDrawPathsBase }
