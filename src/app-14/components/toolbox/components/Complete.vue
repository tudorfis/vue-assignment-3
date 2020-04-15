<template>
  <div class="complete" draggable="true" @dragstart="onDrag">
    <i class="far fa-check-square"></i>
    <div class="clear"></div>
    <label v-show="!isInsideCell">Complete</label>
  </div>
</template>

<script>
import { toolboxDragService } from '../services/toolboxDrag.service'
import { toolboxElementsEnum } from '../enum/toolboxElements.enum';
export default {
    props: ['isInsideCell'],
    methods: {
        onDrag(event) {
          toolboxDragService.startDrag(event, toolboxElementsEnum.COMPLETE)
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