import Vue from 'vue'
import { globalConfig } from "../../../config/global.config"
import { gridModel } from "../grid.model"

/** @TODO: move into global config ... extend config */
const gsize = 240
const gadjust = 0.024

const arrowSizeW = 20
const arrowSizeH = 15

const linkSeparator = '__'

const northArrowPath = `h${arrowSizeH} l-${arrowSizeH} ${arrowSizeW} l-${arrowSizeH} -${arrowSizeW} Z`
const southArrowPath = `h${arrowSizeH} l-${arrowSizeH} -${arrowSizeW} l-${arrowSizeH} ${arrowSizeW} Z`
const westArrowPath = `v-${arrowSizeW} l${arrowSizeW} ${arrowSizeH} l-${arrowSizeW} ${arrowSizeH} Z`
const eastArrowPath = `v-${arrowSizeW} l-${arrowSizeW} ${arrowSizeH} l${arrowSizeW} ${arrowSizeH} Z`

export const gridLinksOperations = {
    generateLinks() {
        const vm = gridLinksOperations
        for (const linkKey of gridModel.model.links)
            vm.genLinkTwoCells.call(gridModel, linkKey)
    },
    // getLocations() {
    //     return Object.keys(Utils.objfilter(this.model.cells, cell => cell.is))
    // },
    getTop(row, withAdjust = false) {
        return ((row - 1) * gsize) + (globalConfig.arrowWidth / 2) + (withAdjust ? ((row - 1) * gadjust) : 0)
    },
    getLeft(col, withAdjust = false) {
        return ((col - 1) * gsize) + (globalConfig.arrowWidth / 2) + (withAdjust ? ((col - 1) * gadjust) : 0)
    },
    getLink1(linkKey) {
        return linkKey.split(linkSeparator)[0]
    },
    getLink2(linkKey) {
        return linkKey.split(linkSeparator)[1]
    },
    genLinkKey(link1, link2) {
        return `${link1}${linkSeparator}${link2}`
    },
    genLinkTwoCells(linkKey) {
        const vm = gridLinksOperations
        
        const link1 = vm.getLink1(linkKey)
        const link2 = vm.getLink2(linkKey)

        const row1 = this.getRow(link1)
        const col1 = this.getCol(link1)

        const row2 = this.getRow(link2)
        const col2 = this.getCol(link2)

        let path, arrowArr

        if (row1 === row2) {
            path = vm.genPath.call(this, link1, (col1 < col2) ? 'right' : 'left')

            const rightDirection = `${gsize * (col2 - col1 - 1)}`
            const leftDirection = `${gsize * (col1 - col2 - 1)}`

            path.d += ` h${ (col1 < col2) ? rightDirection : `-${leftDirection}` }`
            arrowArr = vm.genArrow.call(this, link2, (col1 < col2) ? 'west' : 'east')
        }

        Vue.set(gridModel.paths, linkKey, [])
        gridModel.paths[linkKey].push(...[path, ...arrowArr])
    },
    genPath(link, type = '', forArrow = false) {
        const vm = gridLinksOperations
        const row = this.getRow(link)
        const col = this.getCol(link)

        let left, top, path
        switch (type) {
            case 'up': {
                left = vm.getLeft(col) + 125
                top =  vm.getTop(row, 1) + 52 + (forArrow ? -15 : 0)
                path = `M${left} ${top} v-${(forArrow ? '35' : '50')}`
                break
            }
            case 'down': {
                left = vm.getLeft(col) + 125
                top =  vm.getTop(row, 1) + (gsize - 48) + (forArrow ? 15 : 0)
                path = `M${left} ${top} v${(forArrow ? '35' : '50')}`
                break
            }
            case 'left': {
                left = vm.getLeft(col, 1) + 52 + (forArrow ? -15 : 0)
                top =  vm.getTop(row) + 125
                path = `M${left} ${top} h-${(forArrow ? '35' : '50')}`
                break
            }
            case 'right': {
                left = vm.getLeft(col, 1) + (gsize - 48) + (forArrow ? 15 : 0)
                top =  vm.getTop(row) + 125
                path = `M${left} ${top} h${(forArrow ? '35' : '50')}`
                break
            }
        }

        return { a: 0, d: path }
    },
    genArrow(link, type = '') {
        const vm = gridLinksOperations
        const row = this.getRow(link)
        const col = this.getCol(link)

        let left, top, arrowPath, linePath
        switch (type) {
            case 'north': {
                left = vm.getLeft(col) + 125
                top = vm.getTop(row, 1) + 30
                
                arrowPath = {a: 1, d: `M${left} ${top} ${northArrowPath}`}
                linePath = vm.genPath.call(this, link, 'up', true)
                break
            }
            case 'south': {
                left = vm.getLeft(col) + 125
                top = vm.getTop(row, 1) + (gsize - 25)

                arrowPath = {a: 1, d: `M${left} ${top} ${southArrowPath}`}
                linePath = vm.genPath.call(this, link, 'down', true)
                break
            }
            case 'west': {
                left = vm.getLeft(col, 1) + 28
                top = vm.getTop(row) + 130

                arrowPath = {a: 1, d: `M${left} ${top} ${westArrowPath}`}
                linePath = vm.genPath.call(this, link, 'left', true)
                break
            }
            case 'east': {
                left = vm.getLeft(col, 1) + (gsize - 23)
                top = vm.getTop(row) + 130

                arrowPath = {a: 1, d: `M${left} ${top} ${eastArrowPath}`}
                linePath = vm.genPath.call(this, link, 'right', true)
                break
            }
        }

        return [ linePath, arrowPath ]
    }
}