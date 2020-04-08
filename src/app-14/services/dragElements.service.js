
export const dragElementsEnum = {
    SEND_EMAIL: 'SEND_EMAIL',
    SEND_SMS: 'SEND_SMS',
    ADD_REMOVE_TAG: 'ADD_REMOVE_TAG',
    SUBSCRIBE_LIST: 'SUBSCRIBE_LIST',
    SUBSCRIBE_SEQUENCE: 'SUBSCRIBE_SEQUENCE',
    AUTOMATION: 'AUTOMATION',
    SPLIT: 'SPLIT',
    GO_TO: 'GO_TO',
    WAIT: 'WAIT',
    COMPLETE: 'COMPLETE'
}

export const dragElementsService = {
    activeDragElement: null,
    activeDragElementType: '',
    previousDragElement: null,

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
    }
}