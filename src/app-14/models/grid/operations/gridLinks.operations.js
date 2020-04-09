import Vue from 'vue'
import { gridModel } from "../grid.model"
import { LinkDrawHelper } from '../helpers/linkDraw.helper'
import linkEEhelper from '../helpers/linkEE.helper'
import { globalConfig } from '../../../config/global.config'

export const gridLinksOperations = {
    colors: [],
    colorIds: [],
    oldLinks: [],
    buildLinks() {
        linkEEhelper.generateEEpath()
        linkEEhelper.generateEEmap()
        gridModel.paths = {}

        if (gridModel.model.links && gridModel.model.links.length)
            for (const linkKey of gridModel.model.links) {
                if (!linkKey) continue
                gridLinksOperations.genPathTwoCells(linkKey)
            }
        
    },
    genPathTwoCells(linkKey, isDrag) {
        const vm = gridLinksOperations

        if (vm.colors.length === 0)
            vm.colors = [...globalConfig.colorArray]

        Vue.set(gridModel.paths, linkKey, [])

        const ldh = new LinkDrawHelper(linkKey, gridModel)
        if (ldh.badLinkKey) return

        let path, arrow, direction1, direction2, sameColRow
        if (ldh.right || ldh.left) {
            direction1 = 'rightLeft'
            direction2 = 'upDown'
            sameColRow = 'sameRow'
        }
        else if (ldh.up || ldh.down) {
            direction1 = 'upDown'
            direction2 = 'rightLeft'
            sameColRow = 'sameCol'
        }

        path = ldh.drawPath(ldh[direction1])
        path.d += ldh.drawLine(ldh[direction1], 'full')
        
        if (ldh[sameColRow]) {
            path.d += ldh.drawLine(ldh[direction1], 'arrow')
            arrow = ldh.drawArrow(ldh[direction1], true)
        }
        else {
            
            const position = gridModel.getPosition(ldh.row1, ldh.col2)
            const goAroundCell = gridModel.model.cells[position].is
            // const goAroundCell = Math.round(Math.random())
            
            if (goAroundCell) {
                path.d += ldh.drawHalf(ldh[direction2], ldh[direction1], false)
                path.d += ldh.drawHalf(ldh[direction1], ldh[direction2], true)
            
            } else {
                path.d += ldh.drawHalf(ldh[direction1], ldh[direction2], true)
                path.d += ldh.drawHalf(ldh[direction2], ldh[direction1], false)
            }

            path.d += ldh.drawLine(ldh[direction2], 'full')
            path.d += ldh.drawLine(ldh[direction2], 'arrow')
            arrow = ldh.drawArrow(ldh[direction2])
        }

        /** @TODO: add the ids for cells so the colors don't scramble */
        if (ldh.idLink && !vm.colorIds[ldh.idLink] && !isDrag)
            vm.colorIds[ldh.idLink] = vm.colors.pop()

        const color = isDrag ? '#e9e9e9' : vm.colorIds[ldh.idLink]

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

            if (!linkKey) continue

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
    getEmptyPositionForDroppoint(newPosition, oldPosition) {
        if (!newPosition || !oldPosition) return
        
        const rowNew = this.getRow(newPosition)
        const colNew = this.getCol(newPosition)

        const rowOld = this.getRow(oldPosition)
        const colOld = this.getCol(oldPosition)

        if (rowNew === rowOld && colNew < colOld)
            return this.getPositionDiff(oldPosition, 0, 1)

        else if (colNew === colOld &&  rowNew < rowOld)
            return this.getPositionDiff(oldPosition, 1, 0)
    
        return oldPosition
    },
    hasNoLinks(position) {
        if (gridModel.model.links && gridModel.model.links.length)
            for (const linkKey of gridModel.model.links)
                if (linkKey && linkKey.indexOf(position) !== -1) return false

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
        for (const linkKey of this.model.links)
            if (linkKey && linkKey.includes(position)) {

                const index = this.model.links.indexOf(linkKey)
                delete this.model.links[index]
            }
    }
}