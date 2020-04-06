<template>
  <div 
    id="arrow-connector"
    draggable="true"
    @dragstart.prevent="onDragstart"
  >
    <i class="fas fa-sign-in-alt drag-arrow-icon"></i>
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
        font-size: 30px;
        position: fixed;
        display: none;
        color: #4D80CC;
        z-index: 4;
        cursor: pointer;
    }
</style>