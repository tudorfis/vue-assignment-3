<template>
  <div class="send-sms" draggable="true" @dragstart="drag">
    <i class="fas fa-sms"></i>
    <label>Send SMS</label>
  </div>
</template>

<script>
import { dragElements, dragService } from '../../../services/drag.service'
export default {
    methods: {
        drag(event) {
            dragService.activeDrag = dragElements.SEND_SMS
            console.log('drag() in sendemail', event)
        }
    }
};
</script>

<style lang="scss" scoped>
.send-sms {
  background: lime;
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