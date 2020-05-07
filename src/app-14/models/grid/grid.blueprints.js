
const gridModelBlueprint = {
    numRows: 0,
    numCols: 0,
    totalSteps: 0,
    steps: {},          /** { position: gridcellBlueprint } | position = 2-3 | row = 2 | col = 3 */
    cells: {},          /** { position: gridcellBlueprint } */
    links: [],          /** [ linkKey ] | linkKey = 2-3__4-5 */
    linkAttributes: {}  /** { linkKey: linkAttributeBlueprint } */
}

const gridcellBlueprint = {
    is: 0,              /** 1, 0 */
    type: '',           /** toolboxElements.enum */
    id: 0               /** Number */
}

const linkAttributeBlueprint = {
    name: "",
    color: "",          /** #hascodes kartra */
    width: "",          /** -2, 0, 3 */
    style: "",          /** dotted, dashed */
    hideHead: false,    /** true, false */ 
    outDirection: "",   /** down, right, up, left */
    inDirection: "",    /** down, right, up, left */
}

export {
    gridModelBlueprint,
    gridcellBlueprint,
    linkAttributeBlueprint
}
