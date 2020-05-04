import { globalConfig as gc } from '../../../../config/global.config'
import linkEEMapHelper from './linkEEMap.helper'

const linkEntryExitPointsDifferenceHelper = {
    get eeMap() {
        return linkEEMapHelper.eeMap
    },
    // getDrawHalfDiffOut(lh, oppositeDirection) {
    //     const diff_ee = this.getDiff({
    //         link1: lh.link1,
    //         link2: lh.link2,
    //         direction: oppositeDirection,
    //         type: 'in'
    //     })

    //     if (['left', 'up'].includes(oppositeDirection)) return +diff_ee
    //     else if (['right', 'down'].includes(oppositeDirection)) return -diff_ee

    //     return 0
    // },
    // getDrawHalfDiffIn(lh, inDirection, outDirection) {
    //     const diff_ee = this.getDiff({
    //         link1: lh.link1,
    //         link2: lh.link2,
    //         direction: outDirection,
    //         type: 'out'
    //     })

    //     const abs_diff_ee = Math.abs(diff_ee)
    //     const eeDirDownUp = ['down','up'].includes(outDirection)
    //     const eeDirRightLeft = ['right','left'].includes(outDirection)

    //     if (diff_ee < 0) {
    //         if (inDirection === 'left' && eeDirDownUp) return -abs_diff_ee
    //         else if (inDirection === 'right' && eeDirDownUp) return +abs_diff_ee
    //         else if (inDirection === 'up' && eeDirRightLeft) return -abs_diff_ee
    //         else if (inDirection === 'down' && eeDirRightLeft) return +abs_diff_ee
    //     }

    //     if (inDirection === 'left' && eeDirDownUp) return +abs_diff_ee
    //     else if (inDirection === 'right' && eeDirDownUp) return -abs_diff_ee
    //     else if (inDirection === 'up' && eeDirRightLeft) return +abs_diff_ee
    //     else if (inDirection === 'down' && eeDirRightLeft) return -abs_diff_ee

    //     return 0
    // },
    getDiffByPoint(pointNr) {
        if (pointNr > 9) return 0

        const diff = gc.arrowPointerHeight * Math.floor(pointNr / 2)

        return (pointNr % 2) ? -diff : diff
    },
    // getDiff(query) {
    //     const { link1, link2, direction, type } = query
    //     const eeMap1 = this.eeMap[link1]
    //     const eeMap2 = this.eeMap[link2]
        
    //     if (!eeMap1 || !eeMap1[direction]) return 0
    //     if (!eeMap2 || !eeMap2[direction]) return 0
        
    //     if (type === 'out')
    //         return this.getDiffByPoint(eeMap1[direction].out[link2]) || 0

    //     else if (type === 'in') 
    //         return this.getDiffByPoint(eeMap2[direction].in[link1]) || 0

    //     return 0
    // }
}

const linkEEDiffHelper = linkEntryExitPointsDifferenceHelper
globalThis.linkEEDiffHelper = linkEEDiffHelper

export { linkEEDiffHelper }

