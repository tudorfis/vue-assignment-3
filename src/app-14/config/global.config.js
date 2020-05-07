
import { DimensionsConfigEnum } from './dimensions/DimensionsConfigEnum'
import { squareDimensionsConfig } from './dimensions/squareDimensions.config'
import { rectangularDimensionsConfig } from './dimensions/rectangularDimensions.config'
import { colorConfig } from './colors/color.config'

const DIMENSION_TYPE_DEFAULT = DimensionsConfigEnum.SQUARE

const globalConfig = {
    dimensionType: localStorage.getItem('dimensionType') || DIMENSION_TYPE_DEFAULT,

    minGridCols: 0,
    minGridRows: 0,

    zoomLevel: 100,
    zoomDiff: 25,
    zoomMax: 150,
    zoomMin: 50,

    droppointDimension: 30,
    
    arrowLineWidth: 6,
    
    toolboxWidth: 200,
    topmenuHeight: 60,

    rowsFromTheEnd: 1,
    colsFromTheEnd: 1,
    
    positionSplitSymbol: '-',
    linkSeparatorSymbol: '__',

    arrowPointerWidth: 18,
    arrowPointerHeight: 14,

    ...colorConfig
}

switch (globalConfig.dimensionType) {
    case DimensionsConfigEnum.SQUARE:
        Object.assign(globalConfig, squareDimensionsConfig)
        break;

    case DimensionsConfigEnum.RECTANGULAR:
        Object.assign(globalConfig, rectangularDimensionsConfig)
        break;
}

globalThis.globalConfig = globalConfig
export { globalConfig }
