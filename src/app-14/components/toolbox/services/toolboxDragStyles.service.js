
import { globalConfig } from "../../../config/global.config"

export const toolboxDragStylesService = {
    tempDragStyles: {
        borderRadius: '',
        width: '',
        height: '',
        padding: '',
        iconFontSize: ''
    },
    setDragStylesToolbox(element) {
        const gc = globalConfig

        this.tempDragStyles = {
            borderRadius: element.style.borderRadius,
            width: element.style.width,
            height: element.style.height,
            padding: element.style.padding,
            iconFontSize: element.querySelector('i').style.fontSize
        }

        const padding = Math.floor(gc.gridCellElementWidth / 3.3)
        const fontSize = Math.floor(gc.gridCellElementWidth / 2.7)
        
        element.style.borderRadius = `0px`
        element.style.width = (gc.zoomLevel <= 75) ? `75px` : `${gc.gridCellElementWidth}px`
        element.style.height = (gc.zoomLevel <= 75) ? `75px` : `${gc.gridCellElementHeight}px`
        element.style.padding = (gc.zoomLevel <= 75) ? `20px` : `${padding}px`

        element.querySelector('i').style.fontSize = (gc.zoomLevel <= 75) ? `30px` : `${fontSize}px`
        element.querySelector('label').style.display = `none`
    },
    resetDragStylesToolbox(element) {
        element.style.borderRadius = this.tempDragStyles.borderRadius
        element.style.width = this.tempDragStyles.width
        element.style.height = this.tempDragStyles.height
        element.style.padding = this.tempDragStyles.padding
        
        element.querySelector('i').style.fontSize = this.tempDragStyles.iconFontSize
        element.querySelector('label').style.display = `block`
    }
}