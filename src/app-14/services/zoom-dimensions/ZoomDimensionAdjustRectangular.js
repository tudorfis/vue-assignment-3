
class ZoomDimensionAdjustRectangular {
    zoomIn(config) {
        config.gridCellWidth += 90
        config.gridCellHeight += 50

        config.gridCellElementWidth += 70
        config.gridCellElementHeight += 30
    }
    zoomOut(config) {
        config.gridCellWidth -= 90
        config.gridCellHeight -= 50

        config.gridCellElementWidth -= 70
        config.gridCellElementHeight -= 30
    }
}

export { ZoomDimensionAdjustRectangular }