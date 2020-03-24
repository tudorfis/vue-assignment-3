export class GridContructUtil {
    /** @TODO: not used anymore */
    static buildGridByDimensions(element, gridCellHeight, gridCellWidth) {
        const width = (window.innerWidth - 200)
        const height = (window.innerHeight - 50)

        nrGridCells = 
              Math.floor(width / gridCellHeight) *
              Math.floor(height / gridCellWidth)
        
      const gridlayout = element

      gridlayout.style.width = `${width - (width % gridCellWidth) + 1}px`
      gridlayout.style.height = `${height - (height % gridCellHeight) + 1}px`
    }
}