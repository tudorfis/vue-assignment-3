import Vue from 'vue'
import { gridModel } from "../grid.model"
import { LinkDrawHelper } from '../helpers/linkDraw.helper'
import linkMapHelper from '../helpers/linkMap.helper'
import { globalConfig } from '../../../config/global.config'
import { LinkKeyIterator } from '../iterators/LinkKeyIterator'
import { GridLinksIterator } from '../iterators/GridLinksIterator'

export const gridLinksService = {
    paths: {},
    colors: [],
    colorIds: [],

    buildLinks() {
        this.paths = {}
        this.colors = []
        this.colorIds = []

        linkMapHelper.generateEEmap()
        linkMapHelper.eePathMap = {}

        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while(lki.continue)
            this.genPathTwoCells(lki.linkKey)
    },

    genPathTwoCells(linkKey = '', isDrag = false) {
        Vue.set(this.paths, linkKey, [])
        
        let path = {}, arrow = {}
        const ldh = new LinkDrawHelper(linkKey)

        linkMapHelper.restoreEEforGenPath()
        linkMapHelper.generateEEforGenPath(ldh, isDrag)
        
        const leftOrRight = LinkDrawHelper.leftOrRight(ldh.directionOut)
        const potentialDirection = ldh.potentialDirections[leftOrRight ? 0 : 1]

        const hasCellsOut = GridLinksIterator.hasCellsOut(ldh, ldh.directionOut)
        // const hasCellsOut = false
        const hasCellsOutCorner = GridLinksIterator.hasCellsOutCorner(ldh, ldh.directionOut)
        // const hasCellsOutCorner = false
        const hasCellsIn = GridLinksIterator.hasCellsIn(ldh, potentialDirection)
        // const hasCellsIn = false

        // if (linkKey === '3-4__4-1')
        //     console.log(`
        //         linkKey=${linkKey}
        //         ldh.directionOut=${ldh.directionOut}
        //         ldh.directionIn=${ldh.directionIn}

        //         hasCellsOut=${hasCellsOut}
        //         hasCellsIn=${hasCellsIn}

        //         hasCellsOutCorner=${hasCellsOutCorner}
        //         ldh.sameDirection=${ldh.sameDirection}

        //         ldh.potentialDirections[0]=${ldh.potentialDirections[0]}
        //         ldh.potentialDirections[1]=${ldh.potentialDirections[1]}

        //         LinkDrawHelper.upOrDown(ldh.directionOut)=${LinkDrawHelper.upOrDown(ldh.directionOut)}
        //         LinkDrawHelper.leftOrRight(ldh.directionOut)=${LinkDrawHelper.leftOrRight(ldh.directionOut)}

        //         potentialDirection=${potentialDirection}
        //     `)
        
        /** @TODO: make a way to go down/up | left/right around function in case of elements in the way */
        
        if (ldh.sameRowCol) {
            if (ldh.sameRow && LinkDrawHelper.upOrDown(ldh.directionOut)) {
                const row1 =  ldh.row1 + (ldh.directionOut === 'down' ? 1 : -1)
                const row2 =  ldh.row2 + (ldh.directionOut === 'down' ? 1 : -1)
                
                let hasCellsOutSameRow
                if (row1 === 0 || row2 === 0)
                    hasCellsOutSameRow = true
                
                else {
                    const hasCellsLinkKey = LinkDrawHelper.genLinkKey(
                        gridModel.getPosition(row1, ldh.col1), 
                        gridModel.getPosition(row2, ldh.col2))
                        
                    const hasCellsLdh = new LinkDrawHelper(hasCellsLinkKey)
    
                    hasCellsOutSameRow = GridLinksIterator.hasCellsOut(hasCellsLdh, ldh.rightLeft)
                    hasCellsOutSameRow |= gridModel.model.cells[gridModel.getPosition(row1, ldh.col1)].is
                    hasCellsOutSameRow |= gridModel.model.cells[gridModel.getPosition(row2, ldh.col2)].is
                }
                
                path = ldh.drawPath(ldh.directionOut)
                
                if (!hasCellsOutSameRow)
                    path.d += ldh.drawHalf(ldh.directionOut, ldh.leftRight, true)
                
                path.d += ldh.drawHalf(ldh.rightLeft, ldh.directionOut, false)
                path.d += ldh.drawLine(ldh.rightLeft, 'full')
                path.d += ldh.drawHalf(ldh.rightLeft, ldh.directionIn, false)
                
                if (!hasCellsOutSameRow)
                    path.d += ldh.drawHalf(ldh.directionIn, ldh.rightLeft, true)
                
                path.d += ldh.drawLine(ldh.directionIn, 'arrow')
                arrow = ldh.drawArrow(path.d, ldh.directionIn)
            }
            else if (ldh.sameCol && LinkDrawHelper.leftOrRight(ldh.directionOut)) {
                const col1 =  ldh.col1 + (ldh.directionOut === 'right' ? 1 : -1)
                const col2 =  ldh.col2 + (ldh.directionOut === 'right' ? 1 : -1)
                
                let hasCellsOutSameCol
                if (col1 === 0 || col2 === 0)
                    hasCellsOutSameCol = true
                
                else {
                    const hasCellsLinkKey = LinkDrawHelper.genLinkKey(
                        gridModel.getPosition(ldh.row1, col1), 
                        gridModel.getPosition(ldh.row2, col2))
                        
                    const hasCellsLdh = new LinkDrawHelper(hasCellsLinkKey)

                    hasCellsOutSameCol = GridLinksIterator.hasCellsOut(hasCellsLdh, ldh.upDown)
                    hasCellsOutSameCol |= gridModel.model.cells[gridModel.getPosition(ldh.row1, col1)].is
                    hasCellsOutSameCol |= gridModel.model.cells[gridModel.getPosition(ldh.row2, col2)].is
                }

                path = ldh.drawPath(ldh.directionOut)
                
                if (!hasCellsOutSameCol)
                    path.d += ldh.drawHalf(ldh.directionOut, ldh.upDown, true)
                
                path.d += ldh.drawHalf(ldh.upDown, ldh.directionOut, false)
                path.d += ldh.drawLine(ldh.upDown, 'full')
                path.d += ldh.drawHalf(ldh.upDown, ldh.directionIn, false)
                
                if (!hasCellsOutSameCol)
                    path.d += ldh.drawHalf(ldh.directionIn, ldh.upDown, true)
                
                path.d += ldh.drawLine(ldh.directionIn, 'arrow')
                arrow = ldh.drawArrow(path.d, ldh.directionIn)
            }
            else {
                path = ldh.drawPath(ldh.directionIn)
                path.d += ldh.drawLine(ldh.directionIn, 'full')
                path.d += ldh.drawLine(ldh.directionIn, 'arrow')
                arrow = ldh.drawArrow(path.d, ldh.directionIn)
            }
        }

        else if (hasCellsOut || hasCellsOutCorner) {
            path = ldh.drawPath(ldh.directionOut)

            if (hasCellsOut) {
                path.d += ldh.drawHalf(potentialDirection, ldh.directionOut, false)
                path.d += ldh.drawLine(ldh.directionOut, 'full')
            }
            else if (hasCellsOutCorner) {
                path.d += ldh.drawLine(ldh.directionOut, 'full')
                path.d += ldh.drawHalf(potentialDirection, ldh.directionOut, false)
            }

            if (hasCellsIn || ldh.sameDirection) {
                path.d += ldh.drawLine(potentialDirection, 'full')
                path.d += ldh.drawHalf(potentialDirection, ldh.directionOut, false)
                path.d += ldh.drawLine(ldh.directionOut, 'arrow')
                arrow = ldh.drawArrow(path.d, ldh.directionOut)
            }
            else {
                path.d += ldh.drawHalf(ldh.directionOut, ldh.directionIn, true)
                path.d += ldh.drawLine(ldh.directionIn, 'full')
                path.d += ldh.drawLine(ldh.directionIn, 'arrow')
                arrow = ldh.drawArrow(path.d, ldh.directionIn)
            }
        }
        
        else if (hasCellsIn || ldh.sameDirection) {
            path = ldh.drawPath(ldh.directionOut)

            path.d += ldh.drawLine(ldh.directionOut, 'full')
            path.d += ldh.drawHalf(potentialDirection, ldh.directionOut, false)
            path.d += ldh.drawLine(potentialDirection, 'full')

            if (ldh.sameDirection) {
                path.d += ldh.drawHalf(potentialDirection, ldh.directionOut, false)
                path.d += ldh.drawLine(ldh.directionOut, 'arrow')
                arrow = ldh.drawArrow(path.d, ldh.directionOut)
            }
            else {
                path.d += ldh.drawHalf(ldh.directionOut, ldh.directionIn, true)
                path.d += ldh.drawLine(ldh.directionIn, 'arrow')
                arrow = ldh.drawArrow(path.d, ldh.directionIn)
            }
        }

        else {
            path = ldh.drawPath(ldh.directionOut)
            path.d += ldh.drawLine(ldh.directionOut, 'full')
            path.d += ldh.drawHalf(ldh.directionOut, ldh.directionIn, true)
            path.d += ldh.drawHalf(ldh.directionIn, ldh.directionOut, false)
            path.d += ldh.drawLine(ldh.directionIn, 'full')
            path.d += ldh.drawLine(ldh.directionIn, 'arrow')
            arrow = ldh.drawArrow(path.d, ldh.directionIn)
        }
                
        /*
        path = ldh.drawPath(ldh.directionOut)
        path.d += ldh.drawLine(ldh.directionOut, 'full')
        linkMapHelper.setPathMap(ldh, ldh.directionOut, false)

        if (ldh.sameRowCol) {
            path.d += ldh.drawLine(ldh.directionOut, 'arrow')
            arrow = ldh.drawArrow(path.d, ldh.directionOut)
        }
        else {
            path.d += ldh.drawHalf(ldh.directionOut, ldh.directionIn, true)
            path.d += ldh.drawHalf(ldh.directionIn, ldh.directionOut, false)
            linkMapHelper.setPathMapCorner(ldh)

            path.d += ldh.drawLine(ldh.directionIn, 'full')
            linkMapHelper.setPathMap(ldh, ldh.directionIn, true)

            path.d += ldh.drawLine(ldh.directionIn, 'arrow')
            arrow = ldh.drawArrow(path.d, ldh.directionIn)
        }
        */
        
        const color = this.getPathColor(ldh, isDrag)
        this.setPaths(path, arrow, linkKey, color)
    },
    setPaths(path, arrow, linkKey, color) {
        path.color = color
        path.linkKey = linkKey

        arrow.color = color
        arrow.linkKey = linkKey

        this.paths[linkKey].push(path)
        this.paths[linkKey].push(arrow)
    },
    getPathColor(ldh, isDrag) {
        if (this.colors.length === 0)
            this.colors = [...globalConfig.colorArray]
        
        if (ldh.idLink && !this.colorIds[ldh.idLink] && !isDrag)
            this.colorIds[ldh.idLink] = this.colors.pop()

        return isDrag ? '#e9e9e9' : this.colorIds[ldh.idLink]
    },
    rearangeLinks(oldPosition, newPosition) {
        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            const link1 = LinkDrawHelper.getLink1(lki.linkKey)
            const link2 = LinkDrawHelper.getLink2(lki.linkKey)

            if (link1 === oldPosition)
                gridModel.model.links[lki.i - 1] = LinkDrawHelper.genLinkKey(newPosition, link2)

            else if (link2 === oldPosition)
                gridModel.model.links[lki.i - 1] = LinkDrawHelper.genLinkKey(link1, newPosition)
        }
    },
    hasNoLinks(position) {
        if (!position) return true

        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            if (lki.linkKey.includes(position))
                return false
        }

        return true
    },
    deleteAllLinks(position) {
        if (!position) return
        
        const links = gridModel.model.links
        const lki = new LinkKeyIterator(links)

        while (lki.continue) {
            if (lki.linkKey.includes(position)) {
                const index = gridModel.model.links.indexOf(lki.linkKey)
                delete gridModel.model.links[index]
            }
        }
    }
}