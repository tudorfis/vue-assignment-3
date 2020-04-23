
import { Utils } from '../../../utils/utils'
import { gridModel } from '../grid.model'

const linkPathMapHelper = {
    pathMap: {},
    resetPathMap() {
        this.pathMap = {}
    },
    setCorner(link, linkKey) {
        this.setEmptyPathMap(link)
        this.pathMap[link]['corner'].push(linkKey)
    },
    setDirectionOut(ldh, direction, linkKey) {
        this.iterateDirection(ldh.row1, ldh.col1, { 
            ldh,
            direction,
            linkKey
        })
    },
    setDirectionIn(ldh, direction, linkKey) {
        this.iterateDirection(ldh.row2, ldh.col2, {
            ldh,
            direction,
            linkKey
        })
    },

    iterateDirection(row, col, query) {
        if (query.direction === 'left') 
            this.iterateLeft(query.ldh, row, query.linkKey)

        else if (query.direction === 'right')
            this.iterateRight(query.ldh, row, query.linkKey)

        else if (query.direction === 'up')
            this.iterateUp(query.ldh, col, query.linkKey)

        else if (query.direction === 'down')
            this.iterateDown(query.ldh, col, query.linkKey)
    },

    iterateDown(ldh, col, linkKey) {
        for (let row = ldh.row1 + 1; row < ldh.row2; row++)
            this.setPathMap(row, col, 'vertical', linkKey)
    },
    iterateUp(ldh, col, linkKey) {
        for (let row = ldh.row1 - 1; row > ldh.row2; row--)
            this.setPathMap(row, col, 'vertical', linkKey)
    },
    iterateLeft(ldh, row, linkKey) {
        for (let col = ldh.col1 - 1; col > ldh.col2; col--)
            this.setPathMap(row, col, 'horizontal', linkKey)
    },
    iterateRight(ldh, row, linkKey) {
        for (let col = ldh.col1 + 1; col < ldh.col2; col++)
            this.setPathMap(row, col, 'horizontal', linkKey)
    },

    setPathMap(row, col, pathType, linkKey) {
        const position = gridModel.getPosition(row, col)
        this.setEmptyPathMap(position)

        this.pathMap[position][pathType].push(linkKey)
    },
    setEmptyPathMap(link) {
        if (!!this.pathMap[link]) return

        this.pathMap[link] = pathMapItemFactory.getNew()
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

const pathMapItemFactory = {
    blueprint: {
        vertical: [],
        horizontal: [],
        corner: []
    },
    getNew() {
        return Utils.deepclone(this.blueprint)
    }
}

globalThis.linkPathMapHelper = linkPathMapHelper
export { linkPathMapHelper }

