import { gridReduceService } from "../models/grid/services/gridReduce.service"
import { gridSvgService } from "../components/grid/services/gridSvg.service"

const resizeService = {
    resize() {
        gridReduceService.calculateGridSize()
        gridReduceService.increaseGrid()
        gridReduceService.reduceGrid()
        gridSvgService.calculateSvg()
    }
}

globalThis.resizeService = resizeService
export { resizeService }
