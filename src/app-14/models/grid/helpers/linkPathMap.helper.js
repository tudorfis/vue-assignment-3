import Vue from "vue"

const linkPathMapHelper = {
    pathMap: {},
    resetPathMap() {
        this.pathMap = {}
    },
    setCorner(link, linkKey) {
        if (!this.pathMap[link])
            Vue.set(this.pathMap, link, {v: [], h: [], c: []})

        this.pathMap[link].c.push(linkKey)
    },
    setStraight(ldh, direction, next = false, linkKey) {
        if (direction === 'down')
            for (let row = ldh.row1 + 1; row < ldh.row2; row++)
                setPathMap.call(this, row, !next ? ldh.col1 : ldh.col2, 'v', linkKey)

        else if (direction === 'up')
            for (let row = ldh.row1 - 1; row > ldh.row2; row--)
                setPathMap.call(this, row, !next ? ldh.col1 : ldh.col2, 'v', linkKey)
        
        else if (direction === 'left')
            for (let col = ldh.col1 - 1; col > ldh.col2; col--)
                setPathMap.call(this, !next ? ldh.row1 : ldh.row2, col, 'h', linkKey)
            
        else if (direction === 'right')
            for (let col = ldh.col1 + 1; col < ldh.col2; col++)
                setPathMap.call(this, !next ? ldh.row1 : ldh.row2, col, 'h', linkKey)

        function setPathMap(row, col, hvc, linkKey) {
            const position = gridModel.getPosition(row, col)
            
            if (!this.pathMap[position])
                this.pathMap[position] = {v: [], h: [], c: []}

            this.pathMap[position][hvc].push(linkKey)
        }
    }
}

globalThis.linkPathMapHelper = linkPathMapHelper
export { linkPathMapHelper }
