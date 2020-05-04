
const linkPathMapHelper = {
    pathMap: {},
    resetPathMap() {
        this.pathMap = {}
    },
    getLinkKeys(position) {
        const output = []

        if (!this.pathMap[position]) return output
        
        const pathMapItem = this.pathMap[position]

        for (const orientation of Object.keys(pathMapItem)) { 
            for (const linkKey of pathMapItem[orientation]) {
                output.push(linkKey)
            }
        }
                
        return output
    }
}

globalThis.linkPathMapHelper = linkPathMapHelper
export { linkPathMapHelper }
