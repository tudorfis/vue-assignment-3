
import { globalConfig as gc } from "../../../config/global.config"

export const toolboxDragStylesService = {
    tempDragStyles: {
        borderRadius: '',
        width: '',
        height: '',
        padding: '',
        iconFontSize: ''
    },
    setDragStylesToolbox(element) {
        this.setTemporaryStyles(element)
        this.setNewStyles(element)
    },
    setTemporaryStyles(element) {
        const style = element.style

        this.tempDragStyles = {
            borderRadius: style.borderRadius,
            width: style.width,
            height: style.height,
            padding: style.padding,
            iconFontSize: element.querySelector('i').style.fontSize
        }
    },
    setNewStyles(element) {
        const padding = Math.floor(gc.gridCellElementWidth / 3.3)
        const fontSize = Math.floor(gc.gridCellElementWidth / 2.7)
        
        Object.assign(element.style, {
            borderRadius: `0px`,
            width: (gc.zoomLevel <= 75) ? `75px` : `${gc.gridCellElementWidth}px`,
            height: (gc.zoomLevel <= 75) ? `75px` : `${gc.gridCellElementHeight}px`,
            padding: (gc.zoomLevel <= 75) ? `20px` : `${padding}px`
        })

        element.querySelector('i').style.fontSize = (gc.zoomLevel <= 75) ? `30px` : `${fontSize}px`
        element.querySelector('label').style.display = `none`
    },
    resetDragStylesToolbox(element) {
        Object.assign(element.style, {
            borderRadius: this.tempDragStyles.borderRadius,
            width: this.tempDragStyles.width,
            height: this.tempDragStyles.height,
            padding: this.tempDragStyles.padding
        })
        
        element.querySelector('i').style.fontSize = this.tempDragStyles.iconFontSize
        element.querySelector('label').style.display = `block`
    }
}
