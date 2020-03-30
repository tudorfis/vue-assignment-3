<template>
  <div class="send-email" draggable="true" @dragstart="onDrag">
    <i class="fas fa-envelope-open-text"></i>
    <div class="clear"></div>
    <label v-show="!isInsideCell">Send Email</label>
  </div>
</template>

<script>
import { toolboxService } from '../services/toolbox.service'
export default {
    props: ['isInsideCell'],
    methods: {
        onDrag(event) {
          toolboxService.startDrag(event, 'sendemail')
        }
    }
};
</script>

<style lang="scss" scoped>
.send-email {
  background: lightcyan;

  &.gridtool {
    box-shadow: 0px 0px 12px lightcyan;
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