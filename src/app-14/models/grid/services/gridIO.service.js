import Vue from "vue"
import { gridSvgService } from "../../../components/grid/services/gridSvg.service"
import { globalConfig as gc } from "../../../config/global.config"
import { Utils } from "../../../utils/utils"
import { gridModel } from "../grid.model"
import { gridcellBlueprint, gridModelBlueprint, linkAttributeBlueprint } from "../grid.blueprints"
import { GridPositionIterator } from "../iterators/GridPositionIterator"
import { gridHistoryService } from "./gridHistory.service"
import { gridLinksBuilderService } from "./grid-links/gridLinksBuilder.service"
import { gridReduceService } from "./gridReduce.service"
import { linkNameHelper } from "../helpers/link-attributes/linkName.helper"

export const gridIOservice = {
    newGridModel(numRows, numCols) {
        gridModel.model = Utils.deepclone(gridModelBlueprint)

        gridReduceService.calculateGridSize()

        if (!numRows && !numCols) {
            gridReduceService.increaseGrid()
            gridReduceService.reduceGrid()
        }

        gridModel.model.numRows = numRows || gc.minGridRows
        gridModel.model.numCols = numCols || gc.minGridCols

        gridSvgService.calculateSvg()

        gridModel.model.cells = this.buildGridCells()  
    },
    buildGridCells() {
      if (!gridModel.model) return {}

      const output = {}
      GridPositionIterator.getPositionsMatrix(position => {
        output[position] = Utils.deepclone(gridcellBlueprint)
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
            links: gm.links,
            linkAttributes: gm.linkAttributes
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
        gridModel.model.linkAttributes = model.linkAttributes

        linkNameHelper.generateGridLinkNameElements().then(_ => {
            linkNameHelper.rearangeGridLinkNamesElements()
        })

        gridReduceService.increaseGrid()
        gridReduceService.reduceGrid()
    },
    setCell(position, properties) {
        const cell = gridModel.model.cells[position] = gridModel.model.cells[position] || Utils.deepclone(gridcellBlueprint)

        cell.is = properties.is
        cell.type = properties.type
        cell.id = properties.id || 0
        
        gridModel.model.totalSteps++
    },
    newModel() {
        this.newGridModel()
        gridLinksBuilderService.buildLinks()
        gridHistoryService.saveState()
        linkNameHelper.removeAllGridLinkNameElements()
    },
    setNewLinkAttribute(linkKey) {
        const newLinkAttributes = Utils.deepclone(linkAttributeBlueprint)
        Vue.set(gridModel.model.linkAttributes, linkKey, newLinkAttributes)
    }
}