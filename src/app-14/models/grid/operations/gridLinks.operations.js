import { Utils } from "../../../utils/utils"
import { globalConfig } from "../../../config/global.config"

/** @TODO: move into global config ... extend config */
const arrowSizeW = 20
const arrowSizeH = 15

const northArrowPath = `h${arrowSizeH} l-${arrowSizeH} ${arrowSizeW} l-${arrowSizeH} -${arrowSizeW} Z`
const southArrowPath = `h${arrowSizeH} l-${arrowSizeH} -${arrowSizeW} l-${arrowSizeH} ${arrowSizeW} Z`
const westArrowPath = `v-${arrowSizeW} l${arrowSizeW} ${arrowSizeH} l-${arrowSizeW} ${arrowSizeH} Z`
const eastArrowPath = `v-${arrowSizeW} l-${arrowSizeW} ${arrowSizeH} l${arrowSizeW} ${arrowSizeH} Z`

export const gridLinksOperations = {
    generateLinks() {
        const locations = gridLinksOperations.getLocations.call(this)

        for (let i = 0; i < locations.length; i++) {
            this.arrows.push(gridLinksOperations.generateArrow.call(this, locations[i], 'north'))
            this.arrows.push(gridLinksOperations.generateArrow.call(this, locations[i], 'south'))
            this.arrows.push(gridLinksOperations.generateArrow.call(this, locations[i], 'west'))
            this.arrows.push(gridLinksOperations.generateArrow.call(this, locations[i], 'east'))
        }
    },
    getLocations() {
        return Object.keys(Utils.objfilter(this.model.cells, cell => cell.is))
    },
    generateArrow(link, type = '') {
        const gc = globalConfig
        const row = this.getRow(link)
        const col = this.getCol(link)

        const gsize = 240
        const gadjust = 0.024
        const topC = ((row - 1) * gsize) + (gc.arrowWidth / 2)
        const leftC = ((col - 1) * gsize) + (gc.arrowWidth / 2)
        
        let top, left, path
        switch (type) {
            case 'north': {
                path = northArrowPath; 
                top =  topC + ((row - 1) * gadjust) + 30
                left = leftC + 125
                break;
            }
            case 'south': {
                path = southArrowPath; 
                top = topC + ((row - 1) * gadjust) + gsize - 25
                left = leftC + 125
                break;
            }
            case 'west': {
                path = westArrowPath;
                top = topC + 125
                left = leftC + ((col - 1) * gadjust) + 29
                break;
            }
            case 'east': {
                path = eastArrowPath;
                top = topC + 125
                left = leftC + ((col - 1) * gadjust) + gsize - 24
                break;
            }
        }

        return `M${left} ${top} ${path}`
    }
}