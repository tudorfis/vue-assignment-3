
export class VueUtils {
    static traversePath(mouseEvent, targetRef) {
        if (!mouseEvent.path) return

        for (const { __vue__ } of mouseEvent.path) 
            if (__vue__ && __vue__.$refs[targetRef])
                return __vue__.$refs[targetRef]
        
        return {}
    }
    static traverseByRef(vueElement, targetRef) {
        if (vueElement.$refs[targetRef]) 
            return vueElement.$refs[targetRef]

        if (vueElement.$parent)
            return VueUtils.traverseByRef(vueElement.$parent, targetRef)

        return {}
    }
    static traverseByQuery(vueElement, targetQuery) {
        if (vueElement.$el && vueElement.$el.querySelector(targetQuery)) 
            return vueElement.$el.querySelector(targetQuery)

        if (vueElement.$parent)
            return VueUtils.traverseByQuery(vueElement.$parent, targetQuery)

        return {}
    }

    static traverseByProp(vueElement, targetProp) {
        if (vueElement.$options.propsData && vueElement.$options.propsData[targetProp])
            return vueElement.$options.propsData[targetProp]

        if (vueElement.$parent)
            return VueUtils.traverseByProp(vueElement.$parent, targetProp)

        return null
    }
}