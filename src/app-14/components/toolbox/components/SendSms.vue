<template>
  <div class="send-sms" draggable="true" @dragstart="onDrag">
    <i class="fas fa-sms"></i>
    <div class="clear"></div>
    <label v-show="!isInsideCell">Send SMS</label>
  </div>
</template>

<script>
import { toolboxService } from '../services/toolbox.service'
export default {
    props: ['isInsideCell'],
    methods: {
        onDrag(event) {
          toolboxService.startDrag(event, 'sendsms')
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