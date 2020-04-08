<template>
  <div class="wait" draggable="true" @dragstart="onDrag">
    <i class="fas fa-stopwatch"></i>
    <div class="clear"></div>
    <label v-show="!isInsideCell">Wait</label>
  </div>
</template>

<script>
import { toolboxService } from '../services/toolbox.service'
export default {
    props: ['isInsideCell'],
    methods: {
        onDrag(event) {
          toolboxService.startDrag(event, 'wait')
        }
    }
};
</script>

<style lang="scss" scoped>
.wait {
  background: #4aa1ff;

  &.gridtool {
      box-shadow: 0px 0px 8px #4aa1ff;
  }
  i {
    color: white;
  }
  label {
    font-size: 14px;
    color: white;
  }
}
</style>