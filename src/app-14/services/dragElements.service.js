
export const dragElementsEnum = {
    SEND_EMAIL: 'SEND_EMAIL',
    SEND_SMS: 'SEND_SMS',
    ADD_REMOVE_TAG: 'ADD_REMOVE_TAG'
}

export const dragElementsService = {
    activeDragElement: null,
    activeDragElementType: '',

    previousDragElement: null,
    previousDragElementType: '',

    get insideCell() {
        if (!this.activeDragElement) return false

        if (this.activeDragElement.__vue__)
            return this.activeDragElement.__vue__.$options.propsData.isInsideCell
        
        return false
    },

    isSameElement(gridEl) {
        if (gridEl && this.insideCell && gridEl === this.activeDragElement)
            return true

        return false
    },

    setActiveDragElement(element, type) {
        dragElementsService.activeDragElement = element
        dragElementsService.activeDragElementType = type
    },

    setPreviousDragElement(element, type) {
        this.previousDragElement = element
        this.previousDragElementType = type
    }
}