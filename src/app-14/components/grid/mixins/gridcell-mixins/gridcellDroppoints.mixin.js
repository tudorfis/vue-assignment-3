
export default {
    computed: {
        showDroppoints() {
            const droppointsKeys = Object.keys(this.droppointsDisplay)
            for (const key of droppointsKeys) {
                if (this.droppointsDisplay[key])
                    return true
            }

            return false
        }
    }
}