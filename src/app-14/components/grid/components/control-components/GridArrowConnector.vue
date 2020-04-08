<template>
  <div 
    id="arrow-connector"
    draggable="true"
    @dragstart.prevent="onDragstart"
  >
    <i class="fas fa-arrow-alt-circle-right"></i>
  </div>
</template>

<script>
import { gridArrowService } from '../../services/gridArrow.service'
export default {
  methods: {
    onDragstart(event) {
      gridArrowService.startDrag()
    }
  }
}
</script>

<style>
    #arrow-connector {
        position: fixed;
        display: none;
        color: black;
        z-index: 4;
        cursor: pointer;
    }
</style>