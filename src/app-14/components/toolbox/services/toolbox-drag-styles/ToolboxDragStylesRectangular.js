
class ToolboxDragStylesRectangular {
    setNewStyles(element, config) {
        this.config = config

        const padding = Math.floor(this.mathMedium / 5)
        const fontSize = Math.floor(this.mathMedium / 5)

        Object.assign(element.style, {
            borderRadius: `0px`,
            width: (config.zoomLevel <= 75) ? `160px` : `${config.gridCellElementWidth}px`,
            height: (config.zoomLevel <= 75) ? `70px` : `${config.gridCellElementHeight}px`,
            padding: (config.zoomLevel <= 75) ? `25px` : `${padding}px`
        })

        element.querySelector('i').style.fontSize = (config.zoomLevel <= 75) ? `25px` : `${fontSize}px`
        element.querySelector('label').style.display = `none`
    }
    get mathMedium() {
        return (this.config.gridCellElementWidth + this.config.gridCellElementHeight) / 2
    }
}

export { ToolboxDragStylesRectangular }