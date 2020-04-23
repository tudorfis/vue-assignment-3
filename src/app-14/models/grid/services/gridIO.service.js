import { gridSvgService } from "../../../components/grid/services/gridSvg.service"
import { globalConfig as gc } from "../../../config/global.config"
import { Utils } from "../../../utils/utils"
import { cellBlueprint, gridBlueprint, gridModel } from "../grid.model"
import { GridPositionIterator } from "../iterators/GridPositionIterator"
import { gridHistoryService } from "./gridHistory.service"
import { gridLinksService } from "./gridLinks.service"
import { gridReduceService } from "./gridReduce.service"

export const gridIOservice = {
    newGridModel(numRows, numCols) {
        gridModel.model = {...gridBlueprint}

        gridModel.model.numRows = numRows || gc.minGridRows
        gridModel.model.numCols = numCols || gc.minGridCols

        gridModel.model.cells = this.buildGridCells()
    },
    buildGridCells() {
      if (!gridModel.model) return {}

      const output = {}
      GridPositionIterator.getPositionsMatrix(position => {
        output[position] = {...cellBlueprint}
      })
      
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
        this.newGridModel(model.numRows, model.numCols)

        for (const position in model.steps)
            this.setCell(position, {
                is: 1,
                type: model.steps[position].type,
                id: model.steps[position].id
            })
        
        gridModel.model.steps = model.steps
        gridModel.model.links = model.links

        this.afterGridLoaded(false)
    },
    afterGridLoaded() {
        document.querySelector('.loading-icon').style.visibility = 'hidden'
        gridLinksService.buildLinks()
        
        gridReduceService.increaseGrid()
        gridReduceService.reduceGrid()

        gridSvgService.calculateSvg()
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
        this.afterGridLoaded()
        gridHistoryService.saveState()
    },
}