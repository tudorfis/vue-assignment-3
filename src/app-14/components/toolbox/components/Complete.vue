<template>
  <div class="complete" draggable="true" @dragstart="onDrag">
    <i class="far fa-check-square"></i>
    <div class="clear"></div>
    <label v-show="!isInsideCell">Complete</label>
  </div>
</template>

<script>
import { toolboxService } from '../services/toolbox.service'
export default {
    props: ['isInsideCell'],
    methods: {
        onDrag(event) {
          toolboxService.startDrag(event, 'complete')
        }
    }
};
</script>

<style lang="scss" scoped>
.complete {
  background: #86c92f;

  &.gridtool {
      box-shadow: 0px 0px 8px #86c92f;
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