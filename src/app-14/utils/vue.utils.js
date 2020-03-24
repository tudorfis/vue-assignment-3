
export class VueUtils {
    static traversePath(mouseEvent, targetRef) {
        if (!mouseEvent.path) return

        for (const { __vue__ } of mouseEvent.path) 
            if (__vue__ && __vue__.$refs[targetRef])
                return __vue__.$refs[targetRef]
        
        return {}
    }
    static traverseParent(vueElement, targetRef) {
        if (vueElement.$parent && vueElement.$parent) {
            const parent = vueElement.$parent

            if (parent.$refs[targetRef]) 
                return parent.$refs[targetRef]
            
            return VueUtils.traverseParent(parent, targetRef)
        }

        return {}
    }
}