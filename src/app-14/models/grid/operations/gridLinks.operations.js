import Vue from 'vue'
import { gridModel } from "../grid.model"
import { LinkDrawHelper } from '../helpers/linkDraw.helper'
import linkEEhelper from '../helpers/linkEE.helper'
import { globalConfig } from '../../../config/global.config'

export const gridLinksOperations = {
    colors: [],
    colorIds: [],
    buildLinks() {
        linkEEhelper.generateEEpath()
        linkEEhelper.generateEEmap()
        gridModel.paths = {}

        if (gridModel.model.links && gridModel.model.links.length)
            for (const linkKey of gridModel.model.links)
                gridLinksOperations.genPathTwoCells(linkKey)
        
    },
    genPathTwoCells(linkKey, isDrag) {
        const vm = gridLinksOperations

        if (vm.colors.length === 0)
            vm.colors = [...globalConfig.colorArray]

        Vue.set(gridModel.paths, linkKey, [])

        const l = new LinkDrawHelper(linkKey, gridModel)
        let path, arrow, direction1, direction2, sameColRow

        if (l.right || l.left) {
            direction1 = 'rightLeft'
            direction2 = 'upDown'
            sameColRow = 'sameRow'
        }
        else if (l.up || l.down) {
            direction1 = 'upDown'
            direction2 = 'rightLeft'
            sameColRow = 'sameCol'
        }

        path = l.drawPath(l[direction1])
        path.d += l.drawLine(l[direction1], 'full')
        
        if (l[sameColRow]) {
            path.d += l.drawLine(l[direction1], 'arrow')
            arrow = l.drawArrow(l[direction1], true)
        }
        else {
            
            const position = gridModel.getPosition(l.row1, l.col2)
            const goAroundCell = gridModel.model.cells[position].is
            // const goAroundCell = Math.round(Math.random())
            
            if (goAroundCell) {
                path.d += l.drawHalf(l[direction2], l[direction1], false)
                path.d += l.drawHalf(l[direction1], l[direction2], true)
            
            } else {
                path.d += l.drawHalf(l[direction1], l[direction2], true)
                path.d += l.drawHalf(l[direction2], l[direction1], false)
            }

            path.d += l.drawLine(l[direction2], 'full')
            path.d += l.drawLine(l[direction2], 'arrow')
            arrow = l.drawArrow(l[direction2])
        }

        /** @TODO: add the ids for cells so the colors don't scramble */
        if (l.idLink && !vm.colorIds[l.idLink] && !isDrag)
            vm.colorIds[l.idLink] = vm.colors.pop()

        const color = isDrag ? '#e9e9e9' : vm.colorIds[l.idLink]

        path.color = color
        path.linkKey = linkKey

        arrow.color = color
        arrow.linkKey = linkKey

        gridModel.paths[linkKey].push(path)
        gridModel.paths[linkKey].push(arrow)

    },
    rearangeLinks(oldPosition, newPosition) {
        for (const i in gridModel.model.links) {
            const linkKey = gridModel.model.links[i]

            const link1 = LinkDrawHelper.getLink1(linkKey)
            const link2 = LinkDrawHelper.getLink2(linkKey)

            if (link1 === oldPosition)
                gridModel.model.links[i] = LinkDrawHelper.genLinkKey(newPosition, link2)

            else if (link2 === oldPosition)
                gridModel.model.links[i] = LinkDrawHelper.genLinkKey(link1, newPosition)
        }
    },
    rearangeLinksAfterDroppoint(position, direction) {
        let coordinates = [[],[]]

        if (['right', 'left'].indexOf(direction) !== -1) {
            coordinates[0] = [0, -1]
            coordinates[1] = [0, 1]
        }
        else if (['up', 'down'].indexOf(direction) !== -1) {
            coordinates[0] = [-1, 0]
            coordinates[1] = [1, 0]
        }

        const prevPosition = gridModel.getPositionDiff(position, ...coordinates[0])
        const nextPosition = gridModel.getPositionDiff(position, ...coordinates[1])
        
        this.connectLinks(prevPosition, nextPosition, position)
        this.connectLinks(nextPosition, prevPosition, position)
    },
    connectLinks(position1, position2, position) {
        const key = gridModel.model.links.indexOf(
            LinkDrawHelper.genLinkKey(position1, position2))
        
        if (key !== -1) {
            const newLinkKey1 = LinkDrawHelper.genLinkKey(position1, position)
            const newLinkKey2 = LinkDrawHelper.genLinkKey(position, position2)

            gridModel.model.links[key] = newLinkKey1
            gridModel.model.links.push(newLinkKey2)
        } 
    },
    hasNoLinks(position) {
        if (gridModel.model.links && gridModel.model.links.length)
            for (const linkKey of gridModel.model.links)
                if (linkKey.indexOf(position) !== -1) return false

        return true
    },
    rearangeLinksOnSinglePath(position) {
        const eePathMap = linkEEhelper.eePathMap[position]
        if (!eePathMap) return
       
        const moreThanOnePath = eePathMap.h > 1 || eePathMap.v > 1
        if (moreThanOnePath) return

        const notStraightLine = (eePathMap.h === 1 && eePathMap.v > 0) || (eePathMap.v === 1 && eePathMap.h > 0)
        if (notStraightLine) return

        const rowControl = gridModel.getRow(position)
        const colControl = gridModel.getCol(position)

        let prevPosition, nextPosition
        if (eePathMap.h) {
            getPrevNextPositionsHorizontal()

            if (prevPosition && nextPosition) {
                this.connectLinks(prevPosition, nextPosition, position)
                this.connectLinks(nextPosition, prevPosition, position)
            } 
        }
        else if (eePathMap.v) {
            getPrevNextPositionsVertical()

            if (prevPosition && nextPosition) {
                this.connectLinks(prevPosition, nextPosition, position)
                this.connectLinks(nextPosition, prevPosition, position)
            } 
        }

        function getPrevNextPositionsHorizontal() {
            for (let col = colControl - 1; col >= 1; col--) {
                const position = gridModel.getPosition(rowControl, col)
                if (gridModel.model.cells[position].is) {
                    prevPosition = position
                    break;
                }
            }
            for (let col = colControl + 1; col <= gridModel.model.numCols; col++) {
                const position = gridModel.getPosition(rowControl, col)
                if (gridModel.model.cells[position].is) {
                    nextPosition = position
                    break;
                }
            }
        }

        function getPrevNextPositionsVertical() {
            for (let row = rowControl - 1; row >= 1; row--) {
                const position = gridModel.getPosition(row, colControl)
                if (gridModel.model.cells[position].is) {
                    prevPosition = position
                    break;
                }
            }
            for (let row = rowControl + 1; row <= gridModel.model.numRows; row++) {
                const position = gridModel.getPosition(row, colControl)
                if (gridModel.model.cells[position].is) {
                    nextPosition = position
                    break;
                }
            }
        }
    },
    deleteAllLinks(position) {
        const output = []
        if (this.model.links && this.model.links.length)
            for (const linkKey of this.model.links)
                if (linkKey.indexOf(position) === -1) output.push(linkKey)

        this.model.links = output
    }
}