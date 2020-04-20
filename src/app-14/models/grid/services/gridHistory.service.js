import { gridIOservice } from "./gridIO.service"

const gridHistoryService = {
    modelHistory: [],
    modelVersion: -1,

    saveState() {
        this.modelHistory.push(gridIOservice.saveGridModel())
        this.modelVersion++
    },
    undoModelState() {
        this.undoRedoHelper(true, false)
        
    },
    redoModelState() {
        this.undoRedoHelper(false, true)
    },
    undoRedoHelper(isUndo = false, isRedo = false) {
        const diff = isUndo ? -1 : isRedo ? 1 : 0
        if (diff === 0) return 

        if (this.modelHistory[this.modelVersion + diff]) {
            this.modelVersion += diff
            
            const model = JSON.parse(this.modelHistory[this.modelVersion])
            gridIOservice.loadGridModel(model)
        }
    },
    log() {
        console.log(this.modelHistory[this.modelVersion])
    }
}

globalThis.gridHistoryService = gridHistoryService
export { gridHistoryService }
