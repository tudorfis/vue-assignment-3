<template>
  <div class="add-remove-tag" draggable="true" @dragstart="drag">
    <i class="fas fa-tags"></i>
    <label>Add/Remove Tag</label>
  </div>
</template>

<script>
import { dragElements, dragService } from '../../../services/drag.service'
export default {
    methods: {
        drag(event) {
            dragService.activeDrag = dragElements.SEND_EMAIL
            console.log('drag() in sendemail', event)
        }
    }
};
</script>

<style lang="scss" scoped>
.add-remove-tag {
  background: magenta;
  border: 5px solid lightseagreen;

  i {
    font-size: 40px;
    color: white;
    margin-top: -5px;
  }
  label {
    font-size: 14px;
    color: white;
    line-height: 13px;
    margin-top: 8px;
  }
}
</style>