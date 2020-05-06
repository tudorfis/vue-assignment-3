import { Utils } from "../../../utils/utils"

class LinkKeyIterator {
    constructor(links) {
        if (!links)
            throw new Error('Please provide a gridModel.model.links object')
            
        this.stop = !links || typeof links !== 'object' || links.length === 0
        this.items = !this.stop ? Utils.deepclone(links) : []
        
        this.i = 0
        this.item = null
        this.length = this.items.length
    }
    get linkKey() {
        return this.item
    }
    get continue() {
        if (this.stop) return false

        this.next()
        if (!this.hasItem)
            return this.continue

        return true
    }
    get hasItem() {
        return !!this.item
    }
    next() {
        if (this.i + 1 === this.length) 
            this.stop = true

        this.item = this.items[this.i]
        this.i++
    }
}

export { LinkKeyIterator }