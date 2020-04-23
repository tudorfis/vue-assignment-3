<template>
  <div 
    id="grid-arrow-connector"
    draggable="true"
    @dragstart.prevent="onDragstart"
  >
    <i class="fas fa-arrow-alt-circle-right"></i>
  </div>
</template>

<script>
import { gridArrowConnectorService } from '../../services/gridArrowConnector.service'
export default {
  methods: {
    onDragstart(event) {
      gridArrowConnectorService.startDrag()
    }
  },
  mounted() {
    gridArrowConnectorService.selectorId = 'grid-arrow-connector'
  }
}
</script>

<style>
    #grid-arrow-connector {
        position: fixed;
        display: none;
        color: black;
        z-index: 4;
        cursor: pointer;
    }
</style>