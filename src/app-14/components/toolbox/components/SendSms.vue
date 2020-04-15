<template>
  <div class="send-sms" draggable="true" @dragstart="onDrag">
    <i class="fas fa-sms"></i>
    <div class="clear"></div>
    <label v-show="!isInsideCell">Send SMS</label>
  </div>
</template>

<script>
import { toolboxDragService } from '../services/toolboxDrag.service'
import { toolboxElementsEnum } from '../enum/toolboxElements.enum';
export default {
    props: ['isInsideCell'],
    methods: {
        onDrag(event) {
          toolboxDragService.startDrag(event, toolboxElementsEnum.SEND_SMS)
        }
    }
};
</script>

<style lang="scss" scoped>
.send-sms {
  background: lime;

  &.gridtool {
      box-shadow: 0px 0px 8px lime;
  }
  i {
    color: #3792bc;
  }
  label {
    font-size: 14px;
    color: #3792bc;
  }
}
</style>