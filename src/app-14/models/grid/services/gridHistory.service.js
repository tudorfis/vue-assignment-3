import { gridIOservice } from "./gridIO.service"
import { gridLinksBuilderService } from "./grid-links/gridLinksBuilder.service"
import { Utils } from "../../../utils/utils"

const gridHistoryService = {
    modelHistory: [],
    modelVersion: -1,

    saveState() {
        this.modelHistory.push(gridIOservice.saveGridModel())
        this.modelVersion++
    },
    undoModelState() {
        this.undoRedoState(true, false)
    },
    redoModelState() {
        this.undoRedoState(false, true)
    },
    undoRedoState(isUndo = false, isRedo = false) {
        const diff = isUndo ? -1 : isRedo ? 1 : 0
        if (diff === 0) return 

        if (this.modelHistory[this.modelVersion + diff]) {
            this.modelVersion += diff
            const model = JSON.parse(this.modelHistory[this.modelVersion])
            
            gridIOservice.loadGridModel(model)
            gridLinksBuilderService.buildLinks()
        }
    },
    log() {
        console.log(this.modelHistory[this.modelVersion])
    },
    getLatestState() {
        return Utils.deepclone(this.modelHistory[this.modelVersion])
    }
}

globalThis.gridHistoryService = gridHistoryService
export { gridHistoryService }
