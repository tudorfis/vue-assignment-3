import { gridModel, gridBlueprint, cellBlueprint } from "../grid.model"
import { Utils } from "../../../utils/utils"
import { gridSvgService } from "../../../components/grid/services/gridSvg.service"
import { gridLinksService } from "./gridLinks.service"
import { gridHistoryService } from "./gridHistory.service"
import { GridPositionIterator } from "../iterators/GridPositionIterator"
import { globalConfig } from "../../../config/global.config"
import { gridReduceService } from "./gridReduce.service"

globalThis.gridModel = gridModel

export const gridIOservice = {
    newGridModel(numRows, numCols, doAfterGridLoaded = true) {
        gridModel.model = {...gridBlueprint}

        gridModel.model.numRows = numRows || globalConfig.minGridRows
        gridModel.model.numCols = numCols || globalConfig.minGridCols

        gridModel.model.cells = this.buildGridCells()

        if (doAfterGridLoaded)
            this.afterGridLoaded()
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
        this.newGridModel(model.numRows, model.numCols, false)

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
        gridSvgService.calculateSvg()
        
        document.querySelector('.loading-icon').style.visibility = 'hidden'
        gridLinksService.buildLinks()
        
        gridReduceService.increaseGrid()
        gridReduceService.reduceGrid()
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
        
        gridModel.model.links = []
        gridSvgService.calculateSvg()

        gridLinksService.buildLinks()
        gridHistoryService.saveState()
    },
}