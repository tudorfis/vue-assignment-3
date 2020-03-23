export default {
    data() {
        return {
            startMovingPosition: false,
            positionCoordinates: null
        }
    },
    methods: {
        onStartMoving(event) {
            if (event.target.constructor.name !== 'SVGSVGElement') return

            const currentTranslate = event.toElement.currentTranslate
            const x = event.clientX - (currentTranslate ? currentTranslate.x : 0)
            const y = event.clientY - (currentTranslate ? currentTranslate.y : 0)

            this.positionCoordinates = { x, y }
            this.startMovingPosition = true
            this.$el.style.cursor = 'grab'
        },
        onStopMoving() {
            this.startMovingPosition = false
            this.positionCoordinates = null
            this.$el.style.cursor = ''
        },
        movePosition(event) {
            if (this.startMovingPosition && event.toElement.currentTranslate) {
                event.toElement.currentTranslate.x = event.clientX - this.positionCoordinates.x
                event.toElement.currentTranslate.y = event.clientY - this.positionCoordinates.y
            }
        }
    }
}