import { globalConfig as gc } from '../../../config/global.config'
import linkEEMapHelper from './linkEEMap.helper'

const linkDifferenceEntryExitPointsHelper = {
    get eeMap() {
        return linkEEMapHelper.eeMap
    },
    getDiff(query) {
        const eeMap1 = this.eeMap[query.link1]
        const eeMap2 = this.eeMap[query.link2]
        
        if (!eeMap1 || !eeMap1[query.direction]) return 0
        if (!eeMap2 || !eeMap2[query.direction]) return 0
        
        if (query.type === 'out')
            return this.getDiffByPoint(eeMap1[query.direction].out[query.link2])

        else if (query.type === 'in') 
            return this.getDiffByPoint(eeMap2[query.direction].in[query.link1])

        return 0
    },
    getDiffByPoint(pointNr) {
        if (pointNr > 9) return 0

        const diff = gc.arrowPointerHeight * Math.floor(pointNr / 2)

        return (pointNr % 2) ? -diff : diff
    },
    isRightDown(diff) {
        return this.isLeftUp(diff)
    },
    isLeftUp(diff) {
        return (Math.sign(diff) === -1)
    },
    getDrawHalfDiffOut(oppositeDirection) {
        const diff_ee = this.difference_ee_in_out(oppositeDirection, 'in')

        if (['left', 'up'].includes(oppositeDirection)) return +diff_ee
        else if (['right', 'down'].includes(oppositeDirection)) return -diff_ee

        return 0
    },
    getDrawHalfDiffIn(inDirection, outDirection) {
        const diff_ee = this.difference_ee_in_out(outDirection, 'out')

        const abs_diff_ee = Math.abs(diff_ee)
        const eeDirUpDown = ['up','down'].includes(outDirection)
        const eeDirRightLeft = ['right','left'].includes(outDirection)

        if (diff_ee < 0) {
            if (inDirection === 'left' && eeDirUpDown) return -abs_diff_ee
            else if (inDirection === 'right' && eeDirUpDown) return +abs_diff_ee
            else if (inDirection === 'up' && eeDirRightLeft) return -abs_diff_ee
            else if (inDirection === 'down' && eeDirRightLeft) return +abs_diff_ee
        }

        if (inDirection === 'left' && eeDirUpDown) return +abs_diff_ee
        else if (inDirection === 'right' && eeDirUpDown) return -abs_diff_ee
        else if (inDirection === 'up' && eeDirRightLeft) return +abs_diff_ee
        else if (inDirection === 'down' && eeDirRightLeft) return -abs_diff_ee

        return 0
    }
    
}

const linkDiffEEHelper = linkDifferenceEntryExitPointsHelper
globalThis.linkDiffEEHelper = linkDiffEEHelper

export { linkDiffEEHelper }

