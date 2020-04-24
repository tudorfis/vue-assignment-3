
const globalConfig = {
    minGridCols: 0,
    minGridRows: 0,

    zoomLevel: 100,
    zoomDiff: 25,
    zoomMax: 150,
    zoomMin: 50,

    gridCellWidth: 180,
    gridCellHeight: 180,

    gridCellElementWidth: 105,
    gridCellElementHeight: 105,

    droppointDimension: 30,
    
    arrowLineWidth: 6,
    arrowLineColor: '#ccc',
    
    toolboxWidth: 200,
    topmenuHeight: 60,

    rowsFromTheEnd: 1,
    colsFromTheEnd: 1,
    
    positionSplitSymbol: '-',
    linkSeparatorSymbol: '__',

    arrowPointerWidth: 18,
    arrowPointerHeight: 14,

    colorArray: [
        '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
    ]
}

globalThis.globalConfig = globalConfig
export { globalConfig }
