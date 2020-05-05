
import { globalConfig as gc } from "../../../config/global.config"
import { ToolboxDragStyles } from "./toolbox-drag-styles/ToolboxDragStyles"

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
        this.toolboxDragStylesHandler.setNewStyles(element, gc)
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
    resetDragStylesToolbox(element) {
        Object.assign(element.style, {
            borderRadius: this.tempDragStyles.borderRadius,
            width: this.tempDragStyles.width,
            height: this.tempDragStyles.height,
            padding: this.tempDragStyles.padding
        })
        
        element.querySelector('i').style.fontSize = this.tempDragStyles.iconFontSize
        element.querySelector('label').style.display = `block`
    },
    get toolboxDragStylesHandler() {
        if (!this.toolboxDragStyles) 
            this.toolboxDragStyles = new ToolboxDragStyles(gc.dimensionType)

        return this.toolboxDragStyles
    }
}
