
// import { Utils } from '../../../utils/utils'
// import { gridModel } from '../grid.model'

const linkPathMapHelper = {
    pathMap: {},
    resetPathMap() {
        this.pathMap = {}
    },
    // setCorner(link, linkKey) {
    //     this.setEmptyPathMap(link)
    //     this.pathMap[link]['corner'].push(linkKey)
    // },
    // setDirectionOut(lh, direction, linkKey) {
    //     this.iterateDirection(lh.row1, lh.col1, { 
    //         lh,
    //         direction,
    //         linkKey
    //     })
    // },
    // setDirectionIn(lh, direction, linkKey) {
    //     this.iterateDirection(lh.row2, lh.col2, {
    //         lh,
    //         direction,
    //         linkKey
    //     })
    // },

    // iterateDirection(row, col, query) {
    //     const { lh, direction, linkKey } = query
        
    //     if (direction === 'left') 
    //         this.iterateLeft(lh, row, linkKey)

    //     else if (direction === 'right')
    //         this.iterateRight(lh, row, linkKey)

    //     else if (direction === 'up')
    //         this.iterateUp(lh, col, linkKey)

    //     else if (direction === 'down')
    //         this.iterateDown(lh, col, linkKey)
    // },

    // iterateDown(lh, col, linkKey) {
    //     for (let row = lh.row1 + 1; row < lh.row2; row++)
    //         this.setPathMap(row, col, 'vertical', linkKey)
    // },
    // iterateUp(lh, col, linkKey) {
    //     for (let row = lh.row1 - 1; row > lh.row2; row--)
    //         this.setPathMap(row, col, 'vertical', linkKey)
    // },
    // iterateLeft(lh, row, linkKey) {
    //     for (let col = lh.col1 - 1; col > lh.col2; col--)
    //         this.setPathMap(row, col, 'horizontal', linkKey)
    // },
    // iterateRight(lh, row, linkKey) {
    //     for (let col = lh.col1 + 1; col < lh.col2; col++)
    //         this.setPathMap(row, col, 'horizontal', linkKey)
    // },

    // setPathMap(row, col, pathType, linkKey) {
    //     const position = gridModel.getPosition(row, col)
    //     this.setEmptyPathMap(position)

    //     this.pathMap[position][pathType].push(linkKey)
    // },
    // setEmptyPathMap(link) {
    //     if (!!this.pathMap[link]) return

    //     this.pathMap[link] = pathMapItemFactory.getNew()
    // },

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

// const pathMapItemFactory = {
//     blueprint: {
//         vertical: [],
//         horizontal: [],
//         corner: []
//     },
//     getNew() {
//         return Utils.deepclone(this.blueprint)
//     }
// }

globalThis.linkPathMapHelper = linkPathMapHelper
export { linkPathMapHelper }
