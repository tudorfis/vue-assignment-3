import linkEEMapHelper from './linkEEMap.helper'

const linkEEAdjuster = {
    traverseEEMap() {
        const eeMapKeys = Object.keys(linkEEMapHelper.eeMap)
        const itemsThatNeedRepair = {}

        for (const position of eeMapKeys) {
            const eeMapItem = linkEEMapHelper.eeMap[position]
            const eeMapDirections = Object.keys(eeMapItem)

            for (const direction of eeMapDirections) {
                if (linkEEMapHelper.eeMap[position][direction].total > 1) {
                    
                    /** should build the necessary query here
                      * traversePaths(query)  */
                }
            }
        }

        console.log('itemsThatNeedRepair:', itemsThatNeedRepair)
    },

    traversePaths(query) {
        /** These should be changed 
         * according to traverseEEMap */

        const link1 = '3-6'
        const direction = 'down'
        const inOut = 'out'
        const linkList = ['3-2', '4-8']

        for (let i = 0; i < linkList.length - 1; i++) {
            for (let j = i + 1; j <= linkList.length - 1; j++) {
                const linkKey1 = LinkHelper.getLinkKey(link1, linkList[i])
                const linkKey2 = LinkHelper.getLinkKey(link1, linkList[j])

                const eeMap1 = this.eeMap[link1][direction][inOut][linkList[i]]
                const eeMap2 = this.eeMap[link1][direction][inOut][linkList[j]]

                this.repairPaths({ linkKey1, linkKey2, eeMap1, eeMap2, direction })
            }
        }
    },

    /**
     * This handles overlapping path exit
     * when they go over each other on different directions
     */
    repairPaths(query) {
        const { linkKey1, linkKey2, eeMap1, eeMap2, direction } = query

        const eeMapTotal1 = this.getDiffByPoint(eeMap1)
        const eeMapTotal2 = this.getDiffByPoint(eeMap2)

        const svgPath1 = gridLinksBuilderService.svgPaths[linkKey1][0]
        const svgPath2 = gridLinksBuilderService.svgPaths[linkKey2][0]

        const svgPathMap1 = Utils.deepclone(SvgPathUtils.getPathMap(svgPath1.svgD)).slice(0, 4)
        const svgPathMap2 = Utils.deepclone(SvgPathUtils.getPathMap(svgPath2.svgD)).slice(0, 4)

        const compareDiffPoint = this.getDiffByPoint(2)

        svgPathMap1[3].distance = Math.sign(svgPathMap1[3].distance) === -1 ? -compareDiffPoint : compareDiffPoint
        svgPathMap2[3].distance = Math.sign(svgPathMap2[3].distance) === -1 ? -compareDiffPoint : compareDiffPoint

        const svgM1 = SvgPathUtils.getM(SvgPathUtils.generateSvgD(svgPathMap1))
        const svgM2 = SvgPathUtils.getM(SvgPathUtils.generateSvgD(svgPathMap2))

        const isUpOrDown = LinkHelper.isUpOrDown(direction)
        const hasUpDownCondition = Math.sign(eeMapTotal1 - eeMapTotal2) === Math.sign(svgM1.svgLeft - svgM2.svgLeft)

        const isLeftOrRight = LinkHelper.isLeftOrRight(direction)
        const hasLeftRigthCondition = Math.sign(eeMapTotal1 - eeMapTotal2) === Math.sign(svgM1.svgTop - svgM2.svgTop)
        
        if (isUpOrDown && hasUpDownCondition)
            handlePathSwitch('h', 0, -1)

        else if (isLeftOrRight && hasLeftRigthCondition)
            handlePathSwitch('v', 1, -1)

        function handlePathSwitch(hv, dirIndex, compareInteger) {
            const svgPathMap1 = SvgPathUtils.getPathMap(svgPath1.svgD)
            const svgPathMap2 = SvgPathUtils.getPathMap(svgPath2.svgD)

            let temp = svgPathMap1[0]
            svgPathMap1[0] = svgPathMap2[0]
            svgPathMap2[0] = temp

            temp = svgPathMap1[1]
            svgPathMap1[1] = svgPathMap2[1]
            svgPathMap2[1] = temp

            const diff = Math.abs(svgPathMap1[dirIndex] - svgPathMap2[dirIndex])
            const svgItem1 = svgPathMap1.find(item => !!item.direction && item.direction === hv)
            const svgItem2 = svgPathMap2.find(item => !!item.direction && item.direction === hv)
            
            if (Math.sign(svgPathMap1[dirIndex] - svgPathMap2[dirIndex]) === compareInteger)
                svgItem1.distance += diff
            else svgItem1.distance -= diff

            if (Math.sign(svgPathMap2[dirIndex] - svgPathMap1[dirIndex]) === compareInteger)
                svgItem2.distance += diff
            else svgItem2.distance -= diff

            svgPath1.svgD = SvgPathUtils.generateSvgD(svgPathMap1)
            svgPath2.svgD = SvgPathUtils.generateSvgD(svgPathMap2)
        }
    }
}

globalThis.linkEEAdjuster = linkEEAdjuster
export { linkEEAdjuster }
