import { LinkDrawHelper } from "../helpers/linkDraw.helper"
import linkEEhelper from "../helpers/linkEE.helper"

export const gridLinksDroppointService = {
    rearangeLinksByDirection(position, direction) {
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
        
        this.connectLinksDroppoint(prevPosition, nextPosition, position)
        this.connectLinksDroppoint(nextPosition, prevPosition, position)
    },
    rearangeLinksByPaths(position, droppointDot) {
        const eePathMap = linkEEhelper.eePathMap[position]
        if (!eePathMap) return false
       
        const moreThanOnePath = eePathMap.h > 1 || eePathMap.v > 1 || eePathMap.c > 1
        if (moreThanOnePath) return false

        let notValid = true
        notValid &= eePathMap.h === 1 && (eePathMap.v > 0 || eePathMap.c > 0)
        notValid &= eePathMap.v === 1 && (eePathMap.h > 0 || eePathMap.c > 0)
        notValid &= eePathMap.c === 1 && (eePathMap.h > 0 || eePathMap.v > 0)
        if (notValid) return false

        if (droppointDot && gridModel.model.cells[position].is) return false

        const rowControl = gridModel.getRow(position)
        const colControl = gridModel.getCol(position)

        const objH = getPrevNextPositionsHorizontal()
        const objV = getPrevNextPositionsVertical()

        function getPrevNextPositionsHorizontal() {
            let prevPosition, nextPosition
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

            return { prevPosition, nextPosition }
        }

        function getPrevNextPositionsVertical() {
            let prevPosition, nextPosition
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

            return { prevPosition, nextPosition }
        }

        if (eePathMap.h && (objH.prevPosition && objH.nextPosition)) {
            if (droppointDot) return true

            this.connectLinksDroppoint(objH.prevPosition, objH.nextPosition, position)
            this.connectLinksDroppoint(objH.nextPosition, objH.prevPosition, position)
        }
        else if (eePathMap.v && (objV.prevPosition && objV.nextPosition)) {
            if (droppointDot) return true
            
            this.connectLinksDroppoint(objV.prevPosition, objV.nextPosition, position)
            this.connectLinksDroppoint(objV.nextPosition, objV.prevPosition, position)
        }
        else if (eePathMap.c && eePathMap.linkKey) {
            const ldh = new LinkDrawHelper(eePathMap.linkKey)
            const prevPosition = ldh.link1
            const nextPosition = ldh.link2

            if (prevPosition && nextPosition) {
                if (droppointDot) return true

                this.connectLinksDroppoint(prevPosition, nextPosition, position)
            }
        }

        if (droppointDot) return false
    },
    connectLinksDroppoint(position1, position2, position) {
        const key = gridModel.model.links.indexOf(
            LinkDrawHelper.genLinkKey(position1, position2))
        
        if (key !== -1) {
            const newLinkKey1 = LinkDrawHelper.genLinkKey(position1, position)
            const newLinkKey2 = LinkDrawHelper.genLinkKey(position, position2)

            gridModel.model.links[key] = newLinkKey1
            gridModel.model.links.push(newLinkKey2)
        } 
    },
    getEmptyPosition(newPosition, oldPosition) {
        if (!newPosition || !oldPosition) return
        
        const rowNew = gridModel.getRow(newPosition)
        const colNew = gridModel.getCol(newPosition)

        const rowOld = gridModel.getRow(oldPosition)
        const colOld = gridModel.getCol(oldPosition)

        if (rowNew === rowOld && colNew < colOld)
            return gridModel.getPositionDiff(oldPosition, 0, 1)

        else if (colNew === colOld &&  rowNew < rowOld)
            return gridModel.getPositionDiff(oldPosition, 1, 0)
    
        return oldPosition
    },
    hasMiddleDroppoint(position) {
        return this.rearangeLinksByPaths(position, true)
    }
}