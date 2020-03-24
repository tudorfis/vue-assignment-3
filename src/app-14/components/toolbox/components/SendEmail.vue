<template>
  <div class="send-email" draggable="true" @dragstart="drag">
    <i class="fas fa-envelope-open-text"></i>
    <label>Send Email</label>
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
.send-email {
  background: lightcyan;
  border: 5px solid lightseagreen;

  i {
    font-size: 40px;
    color: #3792bc;
  }
  label {
    font-size: 14px;
    color: #3792bc;
  }
}
</style>