
import { globalConfig as gc } from '../../../config/global.config'
import { SvgPathUtils } from '../../../utils/svgPath.utils'
import { gridModel } from '../grid.model'
import { linkDiffEEHelper } from './linkDiffEE.helper'
import linkEEMapHelper from './linkEEMap.helper'

export class LinkDrawHelper {
    constructor(linkKey, opposite = false) {
        if (!linkKey) {
            this.badLinkKey = true
            return
        }
    
        this.link1 = LinkDrawHelper.getLink1(linkKey)
        this.link2 = LinkDrawHelper.getLink2(linkKey)
    
        if (opposite) {
            linkKey = LinkDrawHelper.genLinkKey(this.link2, this.link1)
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
    static genLinkKey(link1, link2) {
        return `${link1}${gc.linkSeparatorSymbol}${link2}`
    }
    static oppositeDirection(direction) {
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
    get idLink() {
        const cells = gridModel.model.cells
        if (!cells[this.link1] || !cells[this.link2]) return ''

        const id1 = cells[this.link1].id
        const id2 = cells[this.link2].id

        return `${id1}=>${id2}`
    }
    get right() {
        return this.col1 < this.col2
    }
    get left() {
        return this.col1 > this.col2
    }
    get up() {
        return this.row1 > this.row2
    }
    get down() {
        return this.row1 < this.row2
    }
    get sameCol() {
        return this.col1 === this.col2
    }
    get sameRow() {
        return this.row1 === this.row2
    }
    get sameRowCol() {
        return this.sameRow || this.sameCol
    }
    get rightLeft() {
        return this.right ? 'right' : (this.left ? 'left' : '')
    }
    get upDown() {
        return this.down ? 'down' : (this.up ? 'up' : '')
    }
    get sameDirection() {
        return (LinkDrawHelper.upOrDown(this.directionOut) && LinkDrawHelper.upOrDown(this.directionIn) ||
            LinkDrawHelper.leftOrRight(this.directionIn) && LinkDrawHelper.leftOrRight(this.directionOut))
    }
    static upOrDown(direction) {
        return (direction === 'up' || direction === 'down')
    }
    static leftOrRight(direction) {
        return (direction === 'left' || direction === 'right')
    }
    get directionOut() {
        const eeMap = linkEEMapHelper.eeMap[this.link1]
        const directionOut = Object.keys(eeMap).find(direction => !!eeMap[direction].out[this.link2])

        return directionOut
    }
    get directionIn() {
        const eeMap = linkEEMapHelper.eeMap[this.link2]
        const directionIn = Object.keys(eeMap).find(direction => !!eeMap[direction].in[this.link1])

        return LinkDrawHelper.oppositeDirection(directionIn)
    }
    get potentialDirections() {
        if (this.down)
            return [ 'down',  this['rightLeft'] ]
        
        else if (this.right)
            return [ 'right', this['upDown'] ]

        else if (this.left)
            return [ 'left', this['upDown'] ]
        
        else if (this.up)
            return [ 'up', this['rightLeft'] ]
    }

    drawPath(direction) {
        let svgLeft, svgTop, svgPath, difference_ee
        difference_ee = this.difference_ee_in_out(direction, 'out')

        if (direction === 'up') {
            svgLeft = this.horizontal_M + this.cell_center_size + difference_ee
            svgTop =  this.vertical_M + this.cellelement_center_size
            svgPath = `M${svgLeft} ${svgTop} v-${this.cellelement_center_size + (this.row1 === 1 ? -5 : 0)}`
        }
        else if (direction === 'down') {
            svgLeft = this.horizontal_M + this.cell_center_size + difference_ee
            svgTop =  this.vertical_M + (this.cell_size - this.cellelement_center_size)
            svgPath = `M${svgLeft} ${svgTop} v${this.cellelement_center_size}`
        }
        else if (direction === 'left') {
            svgLeft = this.horizontal_M + this.cellelement_center_size
            svgTop =  this.vertical_M + this.cell_center_size + difference_ee
            svgPath = `M${svgLeft} ${svgTop} h-${this.cellelement_center_size + (this.col1 === 1 ? -5 : 0)}`
        }
        else if (direction === 'right') {
            svgLeft = this.horizontal_M + (this.cell_size - this.cellelement_center_size)
            svgTop =  this.vertical_M + this.cell_center_size + difference_ee
            svgPath = `M${svgLeft} ${svgTop} h${this.cellelement_center_size}`
        }

        return { 
            isArrow: false,
            svgD: svgPath
        }
    }

    difference_ee_in_out(direction, type) {
        return linkDiffEEHelper.getDiff({
            link1: this.link1,
            link2: this.link2,
            direction, 
            type
        }) || 0
    }
    get horizontal_M() {
        return (this.col1 - 1) * this.cell_size
    }
    get vertical_M() {
        return (this.row1 - 1) * this.cell_size
    }
    get cell_size() { 
        return gc.gridCellWidth
    }
    get cell_center_size() {
        return gc.gridCellWidth / 2
    }
    get cellelement_center_size() {
        return (gc.gridCellWidth - gc.gridCellElementWidth) / 2
    }
    get arrow_width() { 
        return gc.arrowPointerWidth + 3
    }

    drawLine(direction = '', lineType = '') {
        let distance, cell1, cell2, adjust = 0
        if (direction === 'up') {
            cell1 = this.row1
            cell2 = this.row2
        }
        else if (direction === 'down') {
            cell1 = this.row2
            cell2 = this.row1
            adjust = (this.row1 === 1 ? -5 : 0)
        }
        else if (direction === 'right') {
            cell1 = this.col2
            cell2 = this.col1
            adjust = (this.col1 === 1 ? -5 : 0)
        }
        else if (direction === 'left') {
            cell1 = this.col1
            cell2 = this.col2
        }
 
        if (lineType === 'arrow')
            distance = this.cellelement_center_size - this.arrow_width + 3 + adjust
        
        else if (lineType === 'full') 
            distance = this.cell_size * (cell1 - cell2 - 1)

        const svgD = this.getSvgD(direction)
        return ` ${svgD}${distance}`
    }
    getSvgD(direction) {
        if (direction === 'up') return 'v-'
        else if (direction === 'down') return 'v'
        else if (direction === 'right') return 'h'
        else if (direction === 'left') return 'h-'
    }
    drawHalfOut(outDirection = '', inDirection = '') {
        const svgD = this.getSvgD(outDirection)

        let distance = this.cell_center_size
        distance += linkDiffEEHelper.getDrawHalfDiffOut.call(this, LinkDrawHelper.oppositeDirection(inDirection))

        return ` ${svgD}${distance}`
    }
    drawHalfIn(inDirection = '', outDirection = '') {
        const svgD = this.getSvgD(inDirection)

        let distance = this.cell_center_size
        distance += linkDiffEEHelper.getDrawHalfDiffIn.call(this, inDirection, outDirection)

        return ` ${svgD}${distance}`
    }
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
