<template>
  <div class="send-sms" draggable="true" @dragstart="drag">
    <i class="fas fa-sms" :style="iStyle"></i>
    <label v-show="!isInsideCell">Send SMS</label>
  </div>
</template>

<script>
import { toolboxService } from '../services/toolbox.service'
export default {
    props: ['isInsideCell'],
    methods: {
        drag(event) {
          toolboxService.startDrag(event, 'sendsms')
        }
    },
    computed: {
        iStyle() {
            const extraStyle = { 'margin-left': '5px' }
            return toolboxService.setIconStyle(this.isInsideCell, extraStyle)
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
    font-size: 40px;
    color: #3792bc;
  }
  label {
    font-size: 14px;
    color: #3792bc;
  }
}
</style>