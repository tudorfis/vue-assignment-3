
class ZoomDimensionAdjustSquare {
    zoomIn(config) {
        config.gridCellWidth += 60
        config.gridCellHeight += 60

        config.gridCellElementWidth += 35
        config.gridCellElementHeight += 35
    }
    zoomOut(config) {
        config.gridCellWidth -= 60
        config.gridCellHeight -= 60

        config.gridCellElementWidth -= 35
        config.gridCellElementHeight -= 35
    }
}

export { ZoomDimensionAdjustSquare }