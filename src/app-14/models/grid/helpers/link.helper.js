
import { globalConfig as gc } from '../../../config/global.config'
import { gridModel } from '../grid.model'
import { linkDirectionsMap } from './link-directions/linkDirections.helper'

class LinkHelper {
    constructor(linkKey, opposite = false) {
        if (!linkKey) {
            this.badLinkKey = true
            return
        }
    
        this.link1 = LinkHelper.getLink1(linkKey)
        this.link2 = LinkHelper.getLink2(linkKey)
    
        if (opposite) {
            linkKey = LinkHelper.getLinkKey(this.link2, this.link1)
            this.switchLinks(this.link2, this.link1)
        }
            
        this.linkKey = linkKey

        this.row1 = gridModel.getRow(this.link1)
        this.col1 = gridModel.getCol(this.link1)

        this.row2 = gridModel.getRow(this.link2)
        this.col2 = gridModel.getCol(this.link2)
    }
    static getLink1(linkKey) {
        return linkKey.split(gc.linkSeparatorSymbol)[0]
    }
    static getLink2(linkKey) {
        return linkKey.split(gc.linkSeparatorSymbol)[1]
    }
    static getLinkKey(link1, link2) {
        return `${link1}${gc.linkSeparatorSymbol}${link2}`
    }
    static getOpositeDirection(direction) {
        if (direction === 'up') return 'down'
        if (direction === 'down') return 'up'
        if (direction === 'left') return 'right'
        if (direction === 'right') return 'left'
    }
    switchLinks(link2, link1) {
        const temp = link2
        this.link2 = link1
        this.link1 = temp
    }
    get isRight() {
        return this.col1 < this.col2
    }
    get isLeft() {
        return this.col1 > this.col2
    }
    get isUp() {
        return this.row1 > this.row2
    }
    get isDown() {
        return this.row1 < this.row2
    }
    get isSameCol() {
        return this.col1 === this.col2
    }
    get isSameRow() {
        return this.row1 === this.row2
    }
    get isSameRowCol() {
        return this.isSameRow || this.isSameCol
    }
    get getRightLeft() {
        return this.isRight ? 'right' : (this.isLeft ? 'left' : '')
    }
    get getDownUp() {
        return this.isDown ? 'down' : (this.isUp ? 'up' : '')
    }
    static isUpOrDown(direction) {
        return (direction === 'up' || direction === 'down')
    }
    static isLeftOrRight(direction) {
        return (direction === 'left' || direction === 'right')
    }
    get directionOut() {
        const ldm = linkDirectionsMap[this.linkKey]
        if (!ldm) throw new Error(`Unhandled Exception: linkDirectionsMap doesn't contain linkKey: ${this.linkKey}`)

        return ldm.link1Direction
    }
    get directionIn() {
        const ldm = linkDirectionsMap[this.linkKey]
        if (!ldm) throw new Error(`Unhandled Exception: linkDirectionsMap doesn't contain linkKey: ${this.linkKey}`)
    
        return LinkHelper.getOpositeDirection(ldm.link2Direction)
    }
    get potentialDirections() {
        if (this.isDown)
            return [ 'down',  this['getRightLeft'] ]
        
        else if (this.isRight)
            return [ 'right', this['getDownUp'] ]

        else if (this.isLeft)
            return [ 'left', this['getDownUp'] ]
        
        else if (this.isUp)
            return [ 'up', this['getRightLeft'] ]
    }
}

globalThis.LinkHelper = LinkHelper
export { LinkHelper }
