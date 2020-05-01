// import { LinkCellOutVerifier } from './cell-verifiers/LinkCellOutVerifier'
// import { LinkHelper } from '../link.helper'

// class LinkDirectionsGenerator {
//     constructor(lh, controlDirection) {
//         this.lh = lh
//         this.controlDirection = controlDirection
//     }
//     generateDirectionsWhenSameRowCol() {
//         const pdir1 = this.lh.potentialDirections
//         const firstChoiceDirection = pdir1[0]

//         /** this is used when it's a straight line */
//         if (!LinkCellOutVerifier.hasCellsOut(this.lh, firstChoiceDirection))
//             return {
//                 link1Direction: firstChoiceDirection,
//                 link2Direction: LinkHelper.getOpositeDirection(firstChoiceDirection) 
//             }

//         // const direction = this.generateDirectionWhenSameRowOrCol(firstChoiceDirection)
        
//         let direction
//         if (LinkHelper.isUpOrDown(firstChoiceDirection)) direction = 'right'
//         else if (LinkHelper.isLeftOrRight(firstChoiceDirection)) direction = 'down'
        
//         return {
//             link1Direction: direction,
//             link2Direction: direction
//         }
//     }
//     /**
//      *  these directions are used
//      *  when an element is on the paths way
//      * */
//     // generateDirectionWhenSameRowOrCol(controlDirection) {
//         // let direction = ''

//         // const eeMap1 = linkEEMapHelper.eeMap[this.lh.link1]
//         // const eeMap2 = linkEEMapHelper.eeMap[this.lh.link2]

//         // const left1 = eeMap1.left.total
//         // const right1 = eeMap1.right.total
//         // const up1 = eeMap1.up.total
//         // const down1 = eeMap1.down.total

//         // const left2 = eeMap2.left.total
//         // const right2 = eeMap2.right.total
//         // const up2 = eeMap2.up.total
//         // const down2 = eeMap2.down.total

//         // if (LinkHelper.isUpOrDown(controlDirection)) {
//             // if (left1 === right1) {

//             //     if (left2 === right2) direction = 'right'
//             //     else if (left2 > right2) direction = 'right'
//             //     else if (left2 < right2) direction = 'left'
//             // }
//             // else if (left1 > right1) direction = 'right'
//             // else if (left1 < right1) direction = 'left'

//             // const { hasCellsOutSameCol } = LinkDirectionsGenerator.generateLhObjWhenSameCol(this.lh, direction)
//             // if (hasCellsOutSameCol) direction = (direction === 'right') ? 'left' : 'right'
//         // }
//         // else if (LinkHelper.isLeftOrRight(controlDirection)) {
//             // if (up1 === down1) {

//             //     if (up2 === down2) direction = 'down'
//             //     else if (up2 > down2) direction = 'down'
//             //     else if (up2 < down2) direction = 'up'
//             // }
//             // else if (up1 > down1) direction = 'down'
//             // else if (up1 < down1) direction = 'up'

//             // const { hasCellsOutSameRow } = LinkDirectionsGenerator.generateLhObjWhenSameRow(this.lh, direction)
//             // if (hasCellsOutSameRow) direction = (direction === 'down') ? 'up' : 'down'
//     //     }

//     //     return direction
//     // }
//     // static generateLhObjWhenSameCol(lh, controlDirection) {
//     //     const col1 =  lh.col1 + (controlDirection === 'right' ? 1 : -1)
//     //     const col2 =  lh.col2 + (controlDirection === 'right' ? 1 : -1)
        
//     //     let hasCellsOutSameCol, hasCellsLh
//     //     if (col1 === 0 || col2 === 0)
//     //         hasCellsOutSameCol = true
        
//     //     else {
//     //         const hasCellsLinkKey = LinkHelper.getLinkKey(
//     //             gridModel.getPosition(lh.row1, col1), 
//     //             gridModel.getPosition(lh.row2, col2))
                
//     //         hasCellsLh = new LinkHelper(hasCellsLinkKey)

//     //         hasCellsOutSameCol = LinkCellOutVerifier.hasCellsOut(hasCellsLh, lh.getDownUp)
//     //         hasCellsOutSameCol |= gridModel.model.cells[gridModel.getPosition(lh.row1, col1)].is
//     //         hasCellsOutSameCol |= gridModel.model.cells[gridModel.getPosition(lh.row2, col2)].is
//     //     }

//     //     return { hasCellsOutSameCol, hasCellsLh }
//     // }
//     // static generateLhObjWhenSameRow(lh, controlDirection) {
//     //     const row1 =  lh.row1 + (controlDirection === 'down' ? 1 : -1)
//     //     const row2 =  lh.row2 + (controlDirection === 'down' ? 1 : -1)
        
//     //     let hasCellsOutSameRow, hasCellsLh
//     //     if (row1 === 0 || row2 === 0)
//     //         hasCellsOutSameRow = true
        
//     //     else {
//     //         const hasCellsLinkKey = LinkHelper.getLinkKey(
//     //             gridModel.getPosition(row1, lh.col1), 
//     //             gridModel.getPosition(row2, lh.col2))
                
//     //         hasCellsLh = new LinkHelper(hasCellsLinkKey)

//     //         hasCellsOutSameRow = LinkCellOutVerifier.hasCellsOut(hasCellsLh, lh.getRightLeft)
//     //         hasCellsOutSameRow |= gridModel.model.cells[gridModel.getPosition(row1, lh.col1)].is
//     //         hasCellsOutSameRow |= gridModel.model.cells[gridModel.getPosition(row2, lh.col2)].is
//     //     }

//     //     return { hasCellsOutSameRow, hasCellsLh }
//     // }
// }

// export { LinkDirectionsGenerator }
