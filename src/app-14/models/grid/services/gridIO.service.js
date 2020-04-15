import { gridModel, gridBlueprint, cellBlueprint } from "../grid.model"
import { Utils } from "../../../utils/utils"
import { gridAdjustService } from "./gridAdjust.service"
import { gridSvgService } from "../../../components/grid/services/gridSvg.service"
import { gridLinksService } from "./gridLinks.service"
import { gridHistoryService } from "./gridHistory.service"

export const gridIOservice = {
    newGridModel(numRows, numCols, doAfterGridLoaded = false) {
        gridModel.model = {...gridBlueprint}

        gridModel.model.numRows = numRows || globalConfig.minGridRows
        gridModel.model.numCols = numCols || globalConfig.minGridColumns

        gridModel.model.cells = this.buildGridCells('new')

        if (doAfterGridLoaded)
            this.afterGridLoaded()
    },
    buildGridCells(type = '') {
      if (!gridModel.model) return {}

      const output = {}
      for (let row = 1; row <= gridModel.model.numRows; row++) 
        for (let col = 1; col <= gridModel.model.numCols; col++) {

          const position = gridModel.getPosition(row, col)
          output[position] = type === 'new' ? {...cellBlueprint} : gridModel.model.cells[position]
        }

      return output
    },
    saveGridModel() {
        const gm = gridModel.model
        const output = {
            numCols: gm.numCols,
            numRows: gm.numRows,
            totalSteps: gm.totalSteps,
            steps: Utils.objfilter(gm.cells, cell => cell.is),
            links: gm.links
        }
        
        return JSON.stringify(output)
    },
    loadGridModel(model) {
        const gridSize = gridAdjustService.reduceGridSize(model)
        this.newGridModel(gridSize.numRows, gridSize.numCols)

        for (const position in model.steps)
            this.setCell(position, {
                is: 1,
                type: model.steps[position].type,
                id: model.steps[position].id
            })
        
        gridModel.model.steps = model.steps
        gridModel.model.links = model.links

        this.afterGridLoaded()
    },
    afterGridLoaded() {
        gridSvgService.calculateSvg()
        document.querySelector('.loading-icon').style.visibility = 'hidden'
        gridLinksService.buildLinks()
    },
    setCell(position, properties) {
        const cell = gridModel.model.cells[position] = gridModel.model.cells[position] || { ...cellBlueprint }

        cell.is = properties.is
        cell.type = properties.type
        cell.id = properties.id || 0
        
        gridModel.model.totalSteps++
    },
    newModel() {
        this.newGridModel()

        gridLinksService.buildLinks()
        gridHistoryService.saveState()
    },
}