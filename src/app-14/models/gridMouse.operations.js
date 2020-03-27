import { globalConfig } from "../config/global.config"

export const gridMouseOperations = {
    hasElementAbove(position) {
        const letterIndex = this.getLetterIndexByP(position)

        if (letterIndex === 0)
            return false
        
        const number = this.getNumberByP(position)
        
        const aboveLetter = globalConfig.alphabet[letterIndex - 1]
        if (!aboveLetter) return false

        const abovePosition = `${aboveLetter}${number}`
        const hasElementAbove = this.model.cells[abovePosition].hasElement
        
        const belloweLetter = globalConfig.alphabet[letterIndex - 2]
        if (!belloweLetter) return false

        const bellowPosition = `${belloweLetter}${number}`
        const hasElementBellow = this.model.cells[bellowPosition].hasElement

        /**
        console.log(`
            abovePosition=${abovePosition}
            hasElementAbove=${hasElementAbove}
            
            bellowPosition=${bellowPosition}
            hasElementBellow=${hasElementBellow}
        `)
         */

        return hasElementAbove && hasElementBellow
    },
    isMouseOnTopOutside(event, gridCell) {
        // const mouseX = event.pageX - gridCell.offsetLeft;
        const mouseY = event.pageY - gridCell.offsetTop;
    
        const gc = globalConfig
        const halfCellHeight = Math.round(gc.gridCellHeight / 2)
    
        const isAbovePoint = (mouseY >= (halfCellHeight - gc.droppointDimension))
        const isBellowPoint = (mouseY <= (halfCellHeight + gc.droppointDimension))

        return  isAbovePoint && isBellowPoint
    }
}