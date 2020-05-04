
import { SvgDrawPath } from '../SvgDrawPath'
import { SvgDrawArrow } from '../SvgDrawArrow'

class LinkDrawPathsBase {
    constructor(query) {
        for (const key in query)
            this[key] = query[key]
    }
    get svgDrawPath() {
        if (!this.svgDrawPathService)
            this.svgDrawPathService = new SvgDrawPath(this.lh)

        return this.svgDrawPathService
    }
    get svgDrawArrow() {
        if (!this.svgDrawArrowService)
            this.svgDrawArrowService = new SvgDrawArrow(this.lh)

        return this.svgDrawArrowService
    }
}

export { LinkDrawPathsBase }
