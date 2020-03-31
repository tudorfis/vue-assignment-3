import { Utils } from "../../../utils/utils"
import { globalConfig } from "../../../config/global.config"

/** @TODO: move into global config ... extend config */
const gsize = 240
const gadjust = 0.024

const arrowSizeW = 20
const arrowSizeH = 15

const northArrowPath = `h${arrowSizeH} l-${arrowSizeH} ${arrowSizeW} l-${arrowSizeH} -${arrowSizeW} Z`
const southArrowPath = `h${arrowSizeH} l-${arrowSizeH} -${arrowSizeW} l-${arrowSizeH} ${arrowSizeW} Z`
const westArrowPath = `v-${arrowSizeW} l${arrowSizeW} ${arrowSizeH} l-${arrowSizeW} ${arrowSizeH} Z`
const eastArrowPath = `v-${arrowSizeW} l-${arrowSizeW} ${arrowSizeH} l${arrowSizeW} ${arrowSizeH} Z`

export const gridLinksOperations = {
    generateLinks() {
        const time = new Date().getTime()

        const locations = gridLinksOperations.getLocations.call(this)

        /** @TEST: grid paths */
        for (let i = 0; i < locations.length; i++)
            this.paths.push([
                gridLinksOperations.generatePath.call(this, locations[i], 'top'),
                gridLinksOperations.generatePath.call(this, locations[i], 'bottom'),
                gridLinksOperations.generatePath.call(this, locations[i], 'left'),
                gridLinksOperations.generatePath.call(this, locations[i], 'right')
            ])
        

        /** @TEST: grid arrows */
        for (let i = 0; i < locations.length; i++)
            this.paths.push([
                gridLinksOperations.generateArrow.call(this, locations[i], 'north'),
                gridLinksOperations.generateArrow.call(this, locations[i], 'south'),
                gridLinksOperations.generateArrow.call(this, locations[i], 'west'),
                gridLinksOperations.generateArrow.call(this, locations[i], 'east')
            ])

        console.log(`gridModel.generateLinks() took ${(new Date().getTime() - time) / 1000} seconds`)
    },
    getLocations() {
        return Object.keys(Utils.objfilter(this.model.cells, cell => cell.is))
    },
    generatePath(link, type = '') {
        const vm = gridLinksOperations
        const row = this.getRow(link)
        const col = this.getCol(link)

        let left, top, path
        switch (type) {
            case 'top': {
                left = vm.getLeft(col) + 125
                top =  vm.getTop(row, 1) + 52
                path = `M${left} ${top} v-50`
                break
            }
            case 'bottom': {
                left = vm.getLeft(col) + 125
                top =  vm.getTop(row, 1) + (gsize - 48)
                path = `M${left} ${top} v50`
                break
            }
            case 'left': {
                left = vm.getLeft(col, 1) + 52
                top =  vm.getTop(row) + 125
                path = `M${left} ${top} h-50`
                break
            }
            case 'right': {
                left = vm.getLeft(col, 1) + (gsize - 48)
                top =  vm.getTop(row) + 125
                path = `M${left} ${top} h50`
                break
            }
        }

        return { a: 0, d: path }
    },
    generateArrow(link, type = '') {
        const vm = gridLinksOperations
        const row = this.getRow(link)
        const col = this.getCol(link)

        let left, top, path
        switch (type) {
            case 'north': {
                left = vm.getLeft(col) + 125
                top = vm.getTop(row, 1) + 30
                path = northArrowPath; 
                break;
            }
            case 'south': {
                left = vm.getLeft(col) + 125
                top = vm.getTop(row, 1) + (gsize - 25)
                path = southArrowPath; 
                break;
            }
            case 'west': {
                left = vm.getLeft(col, 1) + 28
                top = vm.getTop(row) + 130
                path = westArrowPath;
                break;
            }
            case 'east': {
                left = vm.getLeft(col, 1) + (gsize - 23)
                top = vm.getTop(row) + 130
                path = eastArrowPath;
                break;
            }
        }

        return { a: 1, d: `M${left} ${top} ${path}` }
    },
    getTop(row, withAdjust = false) {
        return ((row - 1) * gsize) + (globalConfig.arrowWidth / 2) + (withAdjust ? ((row - 1) * gadjust) : 0)
    },
    getLeft(col, withAdjust = false) {
        return ((col - 1) * gsize) + (globalConfig.arrowWidth / 2) + (withAdjust ? ((col - 1) * gadjust) : 0)
    }


}