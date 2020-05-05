
class ToolboxDragStylesSquare {
    setNewStyles(element, config) {
        this.config = config

        const padding = Math.floor(this.mathMedium / 3.3)
        const fontSize = Math.floor(this.mathMedium / 2.7)

        Object.assign(element.style, {
            borderRadius: `0px`,
            width: (config.zoomLevel <= 75) ? `75px` : `${config.gridCellElementWidth}px`,
            height: (config.zoomLevel <= 75) ? `75px` : `${config.gridCellElementHeight}px`,
            padding: (config.zoomLevel <= 75) ? `20px` : `${padding}px`
        })

        element.querySelector('i').style.fontSize = (config.zoomLevel <= 75) ? `30px` : `${fontSize}px`
        element.querySelector('label').style.display = `none`
    }
    get mathMedium() {
        return (this.config.gridCellElementWidth + this.config.gridCellElementHeight) / 2
    }
}

export { ToolboxDragStylesSquare }