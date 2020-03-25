<template>
  <div class="send-email" draggable="true" @dragstart="onDrag">
    <i class="fas fa-envelope-open-text" :style="iStyle"></i>
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
    },
    computed: {
        iStyle() {
            return toolboxService.setIconStyle(this.isInsideCell)
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
    font-size: 40px;
    color: #3792bc;
  }
  label {
    font-size: 14px;
    color: #3792bc;
  }
}
</style>